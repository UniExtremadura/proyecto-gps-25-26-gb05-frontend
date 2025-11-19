import React, { useEffect, useState } from 'react';
import { useHelpArticles, type HelpArticle } from '../../contexts/help.context';

interface HelpArticleComponentProps {
	uuid: string;
	onClose: () => void;
}

const HelpArticleComponent: React.FC<HelpArticleComponentProps> = ({
	uuid,
	onClose,
}) => {
	const { getHelpArticleById } = useHelpArticles();
	const [article, setArticle] = useState<HelpArticle | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArticle = async () => {
			try {
				const data = await getHelpArticleById(uuid);
				setArticle(data);
			} catch (err) {
				console.error('Error al obtener artículo:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchArticle();
	}, [uuid, getHelpArticleById]);

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-2xl">
				<form method="dialog">
					<button
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={onClose}
					>
						✕
					</button>
				</form>

				{loading ? (
					<div className="flex justify-center py-10">
						<span className="loading loading-spinner loading-lg text-primary" />
					</div>
				) : article ? (
					<>
						<h2 className="text-2xl font-bold mb-2">{article.title}</h2>
						<p className="text-sm text-gray-500 mb-4">
							Categoría: {article.category} · Última actualización:{' '}
							{article.date.slice(0, 10)}
						</p>
						<div className="prose max-w-none whitespace-pre-line">
							{article.content.trim()}
						</div>
					</>
				) : (
					<p className="text-center text-error py-10">
						No se pudo cargar el artículo.
					</p>
				)}
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>Cerrar</button>
			</form>
		</dialog>
	);
};

export default HelpArticleComponent;
