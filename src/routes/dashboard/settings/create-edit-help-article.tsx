import React, { useEffect, useState } from 'react';
import {
	useHelpArticles,
	type HelpArticle,
	HelpCategories,
	type HelpCategory,
} from '../../../contexts/help.context.tsx';

interface CreateEditArticleProps {
	article?: HelpArticle; // Si existe, estamos editando
	onClose: () => void;
}

const CreateEditHelpArticle: React.FC<CreateEditArticleProps> = ({
	article,
	onClose,
}) => {
	const isEdit = Boolean(article);
	const { addHelpArticle, updateHelpArticle } = useHelpArticles();

	const [title, setTitle] = useState(article?.title ?? '');
	const [category, setCategory] = useState<HelpCategory | ''>(
		article?.category ?? '',
	);
	const [content, setContent] = useState(article?.content ?? '');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		setTitle(article?.title ?? '');
		setCategory(article?.category ?? '');
		setContent(article?.content ?? '');
	}, [article]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			if (isEdit && article) {
				await updateHelpArticle({
					...article,
					title,
					category,
					content,
				});
				setMessage('Artículo actualizado correctamente ✅');
			} else {
				await addHelpArticle({
					title,
					category,
					content,
				});
				setMessage('Artículo creado correctamente ✅');
			}

			// Cierra el modal después de un breve delay
			setTimeout(() => {
				onClose();
			}, 800);
		} catch (err) {
			console.error(err);
			setMessage('❌ Error al guardar el artículo.');
		} finally {
			setLoading(false);
		}
	};

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

				<h2 className="text-2xl font-bold mb-4">
					{isEdit ? 'Editar artículo de ayuda' : 'Crear nuevo artículo'}
				</h2>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{/* Título */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Título</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="input input-bordered w-full"
							required
						/>
					</div>

					{/* Categoría */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Categoría</span>
						</label>
						<select
							name="category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="select select-bordered w-full"
						>
							<option value="">Selecciona una categoría</option>
							{Object.entries(HelpCategories).map(([key, value]) => (
								<option key={key} value={value}>
									{key.charAt(0) + key.slice(1).toLowerCase()}
								</option>
							))}
						</select>
					</div>

					{/* Contenido */}
					<div className="form-control">
						<label className="label mr-5">
							<span className="label-text font-semibold">Contenido</span>
						</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="textarea textarea-bordered h-40 max-h-50"
							required
						/>
					</div>

					{/* Botones */}
					<div className="modal-action flex justify-between items-center">
						{message && (
							<p
								className={`text-sm ${
									message.includes('Error') ? 'text-error' : 'text-success font-semibold'
								}`}
							>
								{message}
							</p>
						)}

						<div className="flex gap-2">
							<button type="button" className="btn" onClick={onClose}>
								Cancelar
							</button>
							<button
								type="submit"
								className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
								disabled={loading}
							>
								{loading ? (
									<span className="loading loading-spinner loading-sm" />
								) : isEdit ? (
									'Guardar cambios'
								) : (
									'Crear artículo'
								)}
							</button>
						</div>
					</div>
				</form>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>Cerrar</button>
			</form>
		</dialog>
	);
};

export default CreateEditHelpArticle;
