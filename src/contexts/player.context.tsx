import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import type { Song } from './song.context.tsx';
import { useToast } from './toast.context.tsx';
import { useAuth } from './auth.context.tsx';

export interface TracklistItem {
	title: string;
	authorUuid: string;
	authorName: string;
	cover: string;
	src: string;
}

interface PlayerContextType {
	tracklist: TracklistItem[];
	currentTrack: number;
	pastTrack: () => void;
	nextTrack: () => void;
	playPause: () => void;
	playSong: (song: Song) => void;
	playNext: (song: Song) => void;
	addToQueue: (song: Song) => void;
	changeProgress: (e: any) => void;
	changeVolume: (e: any) => void;
	playing: boolean;
	duration: number;
	progress: number;
	volume: number;
	tracklistVisible: boolean;
	setTracklistVisible: (value: boolean) => void;
	reset: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children?: ReactNode }) => {
	const toast = useToast();
	const auth = useAuth();
	const audioRef = useRef(new Audio());

	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playing, setPlaying] = useState(false);

	const [volume, setVolume] = useState(audioRef.current.volume);
	const [tracklist, setTracklist] = useState<TracklistItem[]>([]);
	const [currentTrack, setCurrentTrack] = useState<number>(-1);

	const [tracklistVisible, setTracklistVisible] = useState<boolean>(false);

	useEffect(() => {
		if (tracklist.length > 0 && currentTrack === -1) {
			setCurrentTrack(currentTrack + 1);
		}
	}, [tracklist]);

	useEffect(() => {
		if (
			currentTrack < tracklist.length &&
			tracklist.length !== 0 &&
			currentTrack !== -1
		) {
			audioRef.current.src = tracklist[currentTrack].src;
			audioRef.current.play();
			resetMediaMetadata();
		}
	}, [currentTrack]);

	useEffect(() => {
		setInterval(() => {
			setProgress(audioRef.current.currentTime);
		}, 1000);

		audioRef.current.addEventListener('playing', () => {
			setDuration(audioRef.current.duration);
			setPlaying(true);
		});

		audioRef.current.addEventListener('pause', () => {
			setPlaying(false);
		});

		audioRef.current.addEventListener('ended', () => {
			if (currentTrack < tracklist.length) {
				setCurrentTrack(currentTrack + 1);
			}
		});

		audioRef.current.addEventListener('volumechange', (e) => {
			setVolume(audioRef.current.volume);
		});
	}, []);

	const fetchSong = async (uuid: string) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/songs/${uuid}/play`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${auth.session?.access_token}`,
				},
			},
		);
		if (!response.ok) throw new Error();

		const blob = await response.blob();
		return window.URL.createObjectURL(blob);
	};

	const play = async () => {
		audioRef.current.play();
	};

	const playSong = async (song: Song) => {
		try {
			const src = await fetchSong(song.uuid);
			setTracklist([
				{
					title: song.title,
					authorUuid: song.author.uuid,
					authorName: song.author.artistName,
					cover: song.cover,
					src,
				},
			]);
			setCurrentTrack(-1);
		} catch (error) {
			toast.showToast('No tienes permiso para reproducir', 'error', 5000);
		}
	};

	const pause = () => {
		audioRef.current.pause();
	};

	const resetMediaMetadata = () => {
		const cTrack = currentTrack === -1 ? 0 : currentTrack;
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: tracklist[cTrack].title,
				artist: tracklist[cTrack].authorName,
				artwork: [{ src: tracklist[cTrack].cover }],
			});
			navigator.mediaSession.setActionHandler('play', play);
			navigator.mediaSession.setActionHandler('pause', pause);
			navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
			navigator.mediaSession.setActionHandler('previoustrack', () => pastTrack());
			navigator.mediaSession.setActionHandler(
				'seekto',
				(handler) => (audioRef.current.currentTime = handler.seekTime!),
			);
		}
	};

	const playPause = () => {
		if (audioRef.current.paused) {
			play();
		} else {
			pause();
		}
	};

	const nextTrack = async () => {
		if (currentTrack + 1 < tracklist.length) {
			setCurrentTrack(currentTrack + 1);
		}
	};

	const pastTrack = async () => {
		if (progress > 5 || currentTrack == 0) {
			audioRef.current.currentTime = 0;
		} else if (currentTrack > 0) {
			setCurrentTrack(currentTrack - 1);
		}
	};

	const changeVolume = (e: any) => {
		audioRef.current.volume = parseFloat(e.target.value);
	};

	const changeProgress = (e: any) => {
		audioRef.current.currentTime = parseInt(e.target.value);
		setProgress(parseInt(e.target.value));
	};

	const reset = () => {
		setTracklist([]);
		audioRef.current.src = '';
	};

	const playNext = async (song: Song) => {
		let t = tracklist;
		if (tracklist.length > 0) {
			t.splice(1, 0, {
				title: song.title,
				authorUuid: song.author.uuid,
				authorName: song.author.artistName,
				cover: song.cover,
				src: await fetchSong(song.uuid),
			});
			setTracklist([...t]);
		} else {
			await play();
		}
	};

	const addToQueue = async (song: Song) => {
		setTracklist([
			...tracklist,
			{
				title: song.title,
				authorUuid: song.author.uuid,
				authorName: song.author.artistName,
				cover: song.cover,
				src: await fetchSong(song.uuid),
			},
		]);
	};

	return (
		<PlayerContext.Provider
			value={{
				tracklist,
				currentTrack,
				pastTrack,
				nextTrack,
				playPause,
				playSong,
				playNext,
				addToQueue,
				changeProgress,
				changeVolume,
				playing,
				duration,
				progress,
				volume,
				tracklistVisible,
				setTracklistVisible,
				reset,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = () => {
	const context = useContext(PlayerContext);
	if (!context)
		throw new Error('usePlayer sólo puede ser usado dentro de PlayerContext');
	return context;
};
