import {
	createContext,
	useState,
	useEffect,
	type ReactNode,
	useContext,
} from 'react';
import { useAuth } from './auth.context.tsx';
import { useToast } from './toast.context.tsx';
import type { Song } from './song.context.tsx';
import type { Merch } from './merch.context.tsx';
import type { Album } from './album.context.tsx';

export interface WishlistItem {
	type: 'song' | 'album' | 'merch',
	item: Song | Album | Merch
}

interface WishlistContextType {
	get: () => Promise<WishlistItem[]>,
	add: (uuid: string, type: 'song' | 'album' | 'merch') => Promise<void>,
	remove: (uuid: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined,
);

export const WishlistProvider = ({ children }: { children?: ReactNode }) => {
	const auth = useAuth();

	const get = async () => {
		const response = await fetch(`${window.location.origin}/api/v1/users/wishlist`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`
			}
		});
		if (!response.ok) throw new Error();

		return (await response.json()) as WishlistItem[];
	}

	const add = async (uuid: string, type: 'song' | 'album' | 'merch') => {
		const response = await fetch(`${window.location.origin}/api/v1/users/wishlist`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type,
				uuid
			})
		});
		if (!response.ok) throw new Error();
	}

	const remove = async (uuid: string) => {
		const response = await fetch(`${window.location.origin}/api/v1/users/wishlist/${uuid}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`
			}
		});
		if (!response.ok) throw new Error();
	}

	return (
		<WishlistContext.Provider
			value={{
				get,
				add,
				remove,
			}}
		>
			{children}
		</WishlistContext.Provider>
	);
};

export const useWishlist = () => {
	const ctx = useContext(WishlistContext);
	if (!ctx) {
		throw new Error('useWishlist debe usarse dentro de WishlistProvider');
	}
	return ctx;
};
