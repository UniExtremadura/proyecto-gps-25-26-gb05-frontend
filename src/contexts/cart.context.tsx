import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Song } from './song.context.tsx';
import type { Album } from './album.context.tsx';
import type { Merch } from './merch.context.tsx';
import CartDrawer from '../components/cart-drawer.component.tsx';
import { useToast } from './toast.context.tsx';

export interface CartItem {
	type: 'song' | 'album' | 'merch';
	uuid: string;
	format?: 'cd' | 'vinyl' | 'cassette' | 'digital';
	quantity: number;
}

export interface CartItemPopulated extends CartItem {
	title: string;
	author: string;
	cover: string;
	price: number;
}

interface CartContextType {
	cart: CartItem[];
	populatedCart: CartItemPopulated[] | undefined;
	add: (
		item: Song | Album | Merch,
		format?: 'cd' | 'vinyl' | 'cassette' | 'digital',
	) => void;
	remove: (item: CartItem) => void;
	setQuantity: (item: CartItem, quantity: number) => void;
	clear: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
	const [cart, setCart] = useState<CartItem[]>(() => {
		const savedCart = localStorage.getItem('cart');
		if (!savedCart) {
			return [];
		} else {
			return JSON.parse(savedCart);
		}
	});
	const [populatedCart, setPopulatedCart] = useState<
		CartItemPopulated[] | undefined
	>(undefined);
	const toast = useToast();

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));

		populate().then((cart) => setPopulatedCart(cart));
	}, [cart]);

	const itemEquals = (item1: CartItem, item2: CartItem) => {
		return item1.uuid == item2.uuid && item1.format === item2.format;
	};

	const populate = async () => {
		const result: CartItemPopulated[] = [];
		for (const item of cart) {
			const endpoint = item.type === 'merch' ? 'products' : item.type + 's';

			const response = await fetch(
				`${window.location.origin}/api/v1/${endpoint}/${item.uuid}`,
				{
					method: 'GET',
				},
			);
			if (!response.ok) continue;

			const body = await response.json();
			result.push({
				...item,
				title: body.title,
				author: item.type === 'merch' ? body.reference.author.artistName : body.author.artistName,
				cover: item.type === 'merch' ? body.previews[0] : body.cover,
				price: item.type === 'merch' ? body.price : body.pricing[item.format!],
			});
		}
		return result;
	};

	const add = async (
		item: Song | Album | Merch,
		format?: 'cd' | 'vinyl' | 'cassette' | 'digital',
	) => {
		const cartItem: CartItem = {
			type: (item as any).songs
				? 'album'
				: (item as any).pricing
					? 'song'
					: 'merch',
			format: format,
			uuid: item.uuid,
			quantity: 1,
		};
		const index = cart.findIndex((i) => itemEquals(i, cartItem));

		if (index !== -1) {
			if (cartItem.format === 'digital') {
				toast.showToast('Sólo puedes adquirir una unidad digital', 'error', 3000);
				return;
			}
			cartItem.quantity += cart[index].quantity;
			cart[index] = cartItem;
			setCart([...cart]);
		} else {
			setCart([...cart, cartItem]);
		}
	};

	const remove = (item: CartItem) => {
		setCart([...cart.filter((i) => !itemEquals(i, item))]);
	};

	const clear = () => {
		setCart([]);
	};

	const setQuantity = (item: CartItem, quantity: number) => {
		if (quantity <= 0) {
			remove(item);
			return;
		}
		const index = cart.findIndex((i) => itemEquals(i, item));
		if (index !== -1) {
			cart[index].quantity = quantity;
			setCart([...cart]);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				populatedCart,
				add,
				remove,
				setQuantity,
				clear,
			}}
		>
			{children}
			<CartDrawer />
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context)
		throw new Error('useCart sólo puede ser usado dentro de CartContext');
	return context;
};
