import { createContext, type ReactNode, useContext } from 'react';
import type { Pricing } from '../common/pricing.interface.ts';
import type { Genre } from './genre.context.tsx';
import type { Artist } from './artist.context.tsx';
import { useAuth } from './auth.context.tsx';

export interface Song {
	uuid: string;
	title: string;
	releaseDate: string;
	author: Artist;
	featuring: Artist[];
	genres: Genre[];
	cover: string;
	duration: number;
	pricing: Pricing;
	formats: ('flac' | 'aac' | 'mp3-128' | 'mp3-320')[];
}

interface SongContextType {
	getSong: (uuid: string) => Promise<Song>;
	downloadSong: (uuid: string, format: string) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }: { children?: ReactNode }) => {
	const auth = useAuth();

	const getSong = async (uuid: string) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/songs/${uuid}`,
			{
				method: 'GET',
			},
		);
		if (!response.ok) throw new Error();

		const body = await response.json();
		return body as Song;
	};

	const downloadSong = async (uuid: string, format: string) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/songs/${uuid}/download?format=${format}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${auth.session?.access_token}`,
				},
			},
		);
		if (!response.ok) throw new Error();
		const song = await getSong(uuid);

		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const extension = format.includes('mp3') ? 'mp3' : format;

		const a: HTMLAnchorElement = document.createElement('a');
		a.href = url;
		a.download = `${song.author.artistName} - ${song.title}.${extension}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<SongContext.Provider
			value={{
				getSong,
				downloadSong,
			}}
		>
			{children}
		</SongContext.Provider>
	);
};

export const useSong = () => {
	const context = useContext(SongContext);
	if (!context)
		throw new Error('useSong sólo puede ser usado dentro de SongContext');
	return context;
};
