import type { Artist } from './artist.context.tsx';
import type { Genre } from './genre.context.tsx';
import type { Song } from './song.context.tsx';
import type { Pricing } from '../common/pricing.interface.ts';
import { createContext, type ReactNode, useContext } from 'react';

export interface Album {
	uuid: string;
	title: string;
	releaseDate: string;
	author: Artist;
	genres: Genre[];
	cover: string;
	duration: number;
	songs: Song[];
	pricing: Pricing;
}

interface AlbumContextType {
	getAlbum: (uuid: string) => Promise<Album>;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider = ({ children }: { children?: ReactNode }) => {
	const getAlbum = async (uuid: string) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/albums/${uuid}`,
			{
				method: 'GET',
			},
		);
		if (!response.ok) throw new Error();

		const body = await response.json();
		return body as Album;
	};

	return (
		<AlbumContext.Provider
			value={{
				getAlbum,
			}}
		>
			{children}
		</AlbumContext.Provider>
	);
};

export const useAlbum = () => {
	const context = useContext(AlbumContext);
	if (!context)
		throw new Error('useAlbum sólo puede ser usado dentro de AlbumContext');
	return context;
};
