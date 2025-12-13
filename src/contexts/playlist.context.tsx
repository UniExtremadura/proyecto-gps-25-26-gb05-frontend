import { createContext, useState, type ReactNode, useContext } from 'react';
import { useAuth } from './auth.context.tsx';
import { useToast } from './toast.context.tsx';
import { type Song } from './song.context.tsx';

export interface Playlist {
	uuid: string;
	title: string;
	description: string;
	cover: string;
	public: boolean;
	authorUuid: string;
	songs: Song[];
	duration: number;
}

interface PlaylistContextType {
	playlist: Playlist | null;
	fetchPlaylist: (uuid: string) => Promise<void>;
	addSong: (playlistUuid: string, songUuid: string) => Promise<void>;
	removeSong: (playlistUuid: string, songUuid: string) => Promise<void>;
	createPlaylist: (data: {
		title: string;
		description: string;
		cover: string;
		public: boolean;
	}) => Promise<boolean>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
	undefined,
);

export const PlaylistProvider = ({ children }: { children?: ReactNode }) => {
	const { session } = useAuth();
	const toast = useToast();

	const [playlist, setPlaylist] = useState<Playlist | null>(null);

	const fetchPlaylist = async (uuid: string) => {
		if (!session) return;

		const res = await fetch(
			`${window.location.origin}/api/v1/playlists/${uuid}`,
			{
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		);

		if (!res.ok) {
			toast.showToast('Error al cargar la playlist', 'error', 4000);
			return;
		}

		const data = await res.json();
		setPlaylist(data);
	};

	const addSong = async (playlistUuid: string, songUuid: string) => {
		const res = await fetch(
			`${window.location.origin}/api/v1/playlists/${playlistUuid}/songs`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`,
				},
				body: JSON.stringify({ songUuid }),
			},
		);

		if (!res.ok) {
			toast.showToast('No se pudo añadir la canción', 'error', 4000);
			return;
		}

		await fetchPlaylist(playlistUuid);
		toast.showToast('Canción añadida', 'success', 3000);
	};

	const removeSong = async (playlistUuid: string, songUuid: string) => {
		const res = await fetch(
			`${window.location.origin}/api/v1/playlists/${playlistUuid}/songs/${songUuid}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${session?.access_token}`,
				},
			},
		);

		if (!res.ok) {
			toast.showToast('No se pudo eliminar la canción', 'error', 4000);
			return;
		}

		await fetchPlaylist(playlistUuid);
		toast.showToast('Canción eliminada', 'success', 3000);
	};

	const createPlaylist = async (data: {
		title: string;
		description: string;
		cover: string;
		public: boolean;
	}): Promise<boolean> => {
		if (!session) return false;

		const res = await fetch(`${window.location.origin}/api/v1/playlists`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			toast.showToast('No se pudo crear la playlist', 'error', 4000);
			return false;
		}

		toast.showToast('Playlist creada correctamente', 'success', 3000);
		return true;
	};

	return (
		<PlaylistContext.Provider
			value={{
				playlist,
				fetchPlaylist,
				addSong,
				removeSong,
				createPlaylist,
			}}
		>
			{children}
		</PlaylistContext.Provider>
	);
};

export const usePlaylist = () => {
	const ctx = useContext(PlaylistContext);
	if (!ctx) {
		throw new Error('usePlaylist debe usarse dentro de PlaylistProvider');
	}
	return ctx;
};
