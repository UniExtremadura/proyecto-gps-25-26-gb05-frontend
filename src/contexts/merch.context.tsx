import type { Song } from './song.context.tsx';
import type { Album } from './album.context.tsx';
import { createContext, type ReactNode, useContext } from 'react';
import { useAuth } from './auth.context.tsx';

export enum MerchType {
	TSHIRT = 'tshirt',
	HOODIE = 'hoodie',
	CAP = 'cap',
	POSTER = 'poster',
	TOTEBAG = 'totebag',
	STICKERS = 'stickers',
	PHONECASE = 'phonecase',
	BRACELET = 'bracelet',
	MUG = 'mug',
}

export const MerchTypeMapping = {
	[MerchType.TSHIRT]: 'Camiseta',
	[MerchType.HOODIE]: 'Sudadera',
	[MerchType.CAP]: 'Gorra',
	[MerchType.POSTER]: 'Póster',
	[MerchType.TOTEBAG]: 'Totebag',
	[MerchType.STICKERS]: 'Pegatinas',
	[MerchType.PHONECASE]: 'Funda de móvil',
	[MerchType.BRACELET]: 'Pulsera',
	[MerchType.MUG]: 'Taza'
}

export interface Merch {
	uuid: string;
	type: MerchType;
	title: string;
	description: string;
	price: number;
	reference: Song | Album;
	referenceType: 'song' | 'album';
	previews: string[];
}

interface MerchContextType {
	get: (uuid: string) => Promise<Merch>;
	getFromToken: () => Promise<Merch[]>;
	upload: (merch: Partial<Merch>) => Promise<void>;
	update: (merch: Partial<Merch>) => Promise<void>;
	remove: (uuid: string) => Promise<void>;
}

const MerchContext = createContext<MerchContextType | undefined>(undefined);

export const MerchProvider = ({ children }: { children?: ReactNode }) => {
	const auth = useAuth();

	const get = async (uuid: string) => {
		const response = await fetch(`${window.location.origin}/api/v1/products/${uuid}`, {
			method: 'GET',
		});
		if (!response.ok) throw new Error();

		return (await response.json()) as Merch;
	}

	const getFromToken = async () => {
		const response = await fetch(`${window.location.origin}/api/v1/products`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`
			}
		});
		if (!response.ok) throw new Error();
		const body = await response.json();
		return body as Merch[];
	}

	const upload = async (merch: Partial<Merch>) => {
		const response = await fetch(`${window.location.origin}/api/v1/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(merch)
		});
		if (!response.ok) throw new Error();
	}

	const update = async (merch: Partial<Merch>) => {
		const response = await fetch(`${window.location.origin}/api/v1/products/${merch.uuid}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(merch)
		});
		if (!response.ok) throw new Error();
	}

	const remove = async (uuid: string) => {
		const response = await fetch(`${window.location.origin}/api/v1/products/${uuid}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`
			}
		});
		if (!response.ok) throw new Error();
	}

	return (
		<MerchContext.Provider
			value={{
				get,
				getFromToken,
				upload,
				update,
				remove,
			}}
		>
			{children}
		</MerchContext.Provider>
	)
}

export const useMerch = () => {
	const context = useContext(MerchContext);
	if (!context) {
		throw new Error('useMerch sólo puede usarse dentro de MerchProvider');
	}
	return context;
}