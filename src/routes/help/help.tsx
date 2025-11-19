import React, { useEffect, useState } from 'react';
import { useHelpArticles, type HelpArticle } from '../../contexts/help.context';
import HelpArticleComponent from './help-article';
import HelpArticleCard from './help-article-card.tsx';

const Help: React.FC = () => {
	const { getHelpArticles } = useHelpArticles();

	const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(true);

	// Cargar artículos desde la API
	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const data = await getHelpArticles();
				setHelpArticles(data);
			} catch (err) {
				console.error('Error al obtener artículos:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchArticles();
	}, [getHelpArticles]);

	// Filtrado por texto
	const filtered = helpArticles.filter((a) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
		);
	});

	return (
		<div className="min-h-screen bg-base-100 py-10 px-6 flex flex-col items-center">
			{/* Título */}
			<h1 className="text-4xl font-bold mb-10 text-center">Centro de Ayuda</h1>

			{/* Buscador y botón crear */}
			<div className="w-full flex flex-col sm:flex-row justify-center mb-10">
				<div className="form-control w-full max-w-md">
					<label className="input input-bordered flex items-center gap-2 w-full">
						{/* Icono de búsqueda */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 opacity-70"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
							/>
						</svg>
						<input
							type="text"
							className="grow"
							placeholder="Buscar artículos..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</label>
				</div>
			</div>

			{/* Lista de artículos */}
			{loading ? (
				<span className="loading loading-spinner loading-lg text-primary mt-10" />
			) : filtered.length > 0 ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
					{filtered.map((article) => (
						<HelpArticleCard
							key={article.uuid}
							uuid={article.uuid}
							title={article.title}
							category={article.category}
							setSelectedId={() => setSelectedId(article.uuid)}
						/>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500 mt-8">
					No se encontraron artículos.
				</p>
			)}

			{/* Modal de lectura */}
			{selectedId && (
				<HelpArticleComponent
					uuid={selectedId}
					onClose={() => setSelectedId(null)}
				/>
			)}
		</div>
	);
};

export default Help;
