import { createContext, type ReactNode, useContext } from 'react';
import { useAuth } from './auth.context.tsx';

export interface ArtistStats {
	"totalFollowers": number,
	"earn": number,
	"totalPlays": number,
	"totalSongs": number,
	"totalAlbums": number,
	"totalMerch": number,
	"totalCds": number,
	"totalVinyls": number,
	"totalCassettes": number,
	"totalDigitals": number,
}

interface ArtistStatsContextType {
	get: () => Promise<ArtistStats>;
}

const ArtistStatsContext = createContext<ArtistStatsContextType | undefined>(undefined);

export const ArtistStatsProvider = ({ children }: { children?: ReactNode }) => {
	const auth = useAuth();

	const get = async () => {
		console.log(auth.session?.access_token)
		const response = await fetch(`${window.location.origin}/api/v1/stats/artists/stats`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.session?.access_token}`
			}
		});
		if (!response.ok) throw new Error();
		const body = await response.json();
		return body as ArtistStats;
	}

	return (
		<ArtistStatsContext.Provider
			value={{
				get
			}}
		>
			{children}
		</ArtistStatsContext.Provider>
	)
}

export const useArtistStats = () => {
	const context = useContext(ArtistStatsContext);
	if (!context) {
		throw new Error('useArtistStats sólo puede usarse dentro de Artistprovider');
	}
	return context;
}