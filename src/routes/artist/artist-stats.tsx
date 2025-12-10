import {
	MdAlbum,
	MdLibraryMusic,
	MdMonetizationOn,
	MdMusicNote,
	MdPeople,
	MdPlayArrow,
} from 'react-icons/md';
import { FaShirt } from 'react-icons/fa6';
import { CgVinyl } from 'react-icons/cg';
import { LuCassetteTape } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { useArtistStats, type ArtistStats } from '../../contexts/artist.stats.context.tsx';

const ArtistStatsComponent = () => {
	const artistStats = useArtistStats();
	const [item, setItem] = useState<ArtistStats | undefined>(undefined);

	useEffect(() => {
		console.log("lego")
		artistStats.get()
			.then(m => setItem(m))
	}, []);

	if (item === undefined) return <div className="skeleton w-full h-96" />

	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-3xl font-bold">Estadísticas</h1>
			<div className="flex flex-col gap-2">
				<div className="stats shadow">
					<div className="stat">
						<div className="stat-figure">
							<MdPeople className="w-12 h-12" />
						</div>
						<div className="stat-title">Seguidores</div>
						<div className="stat-value">{item.totalFollowers}</div>
					</div>

					<div className="stat">
						<div className="stat-figure">
							<MdMonetizationOn className="w-12 h-12" />
						</div>
						<div className="stat-title">Ganancias totales</div>
						<div className="stat-value">{item.earn / 100} €</div>
					</div>

					<div className="stat">
						<div className="stat-figure">
							<MdPlayArrow className="w-12 h-12" />
						</div>
						<div className="stat-title">Reproducciones</div>
						<div className="stat-value">{item.totalPlays}</div>
					</div>
				</div>

				<div className="flex gap-5">
					<div className="stats shadow stats-vertical flex-1">
						<div className="stat">
							<div className="stat-figure">
								<MdMusicNote className="w-12 h-12" />
							</div>
							<div className="stat-title">Canciones vendidas</div>
							<div className="stat-value">{item.totalSongs}</div>
						</div>

						<div className="stat">
							<div className="stat-figure">
								<MdAlbum className="w-12 h-12" />
							</div>
							<div className="stat-title">Álbumes vendidos</div>
							<div className="stat-value">{item.totalAlbums}</div>
						</div>

						<div className="stat">
							<div className="stat-figure">
								<FaShirt className="w-12 h-12" />
							</div>
							<div className="stat-title">Merchandising vendido</div>
							<div className="stat-value">{item.totalMerch}</div>
						</div>
					</div>

					<div className="stats shadow stats-vertical flex-1">
						<div className="stat">
							<div className="stat-figure">
								<MdLibraryMusic className="w-12 h-12" />
							</div>
							<div className="stat-title">Productos digitales vendidos</div>
							<div className="stat-value">{item.totalDigitals}</div>
						</div>

						<div className="stat">
							<div className="stat-figure">
								<MdAlbum className="w-12 h-12" />
							</div>
							<div className="stat-title">CDs vendidos</div>
							<div className="stat-value">{item.totalCds}</div>
						</div>

						<div className="stat">
							<div className="stat-figure">
								<CgVinyl className="w-12 h-12" />
							</div>
							<div className="stat-title">Vinilos vendidos</div>
							<div className="stat-value">{item.totalVinyls}</div>
						</div>

						<div className="stat">
							<div className="stat-figure">
								<LuCassetteTape className="w-12 h-12" />
							</div>
							<div className="stat-title">Cassettes vendidos</div>
							<div className="stat-value">{item.totalCassettes}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ArtistStatsComponent;