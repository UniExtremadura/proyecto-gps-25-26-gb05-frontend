import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReviews, type Review } from '../../contexts/reviews.context.tsx';
import ReviewCard from './Review-card.tsx';

interface ReviewsComponentProps {
	productType: 'Song' | 'Album';
}

const Reviews: React.FC<ReviewsComponentProps> = ({ productType }) => {
	const { uuid } = useParams();
	const { getReviewsByProductId, addReview } = useReviews();

	const [reviews, setReviews] = useState<Review[]>([]);
	const [title, setTitle] = useState<string>();
	const [rating, setRating] = useState<string>();
	const [content, setContent] = useState<string>();
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState<string | null>(null);

	// Cargar reseñas desde la API
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const data = await getReviewsByProductId(uuid);
				setReviews(data);
			} catch (err) {
				console.error('Error al obtener reseñas:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchReviews();
	}, [getReviewsByProductId, uuid]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			await addReview({
				productType: productType,
				productId: uuid,
				rating: parseInt(rating),
				title,
				content,
			});
			setMessage('Reseña creada correctamente ✅');
		} catch (err) {
			console.error(err);
			setMessage('❌ Error al guardar la reseña.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full">
			<h2 className="text-2xl font-bold mb-4">Comentarios</h2>

			{/* Formulario para agregar comentario */}
			<form onSubmit={handleSubmit}>
				<div className="card bg-base-200 shadow-md mb-6">
					<div className="card-body">
						<h3 className="card-title text-lg">Agregar un comentario</h3>

						{/* Selector de título */}
						<label className="label">
							<span className="label-text">Selecciona un título</span>
						</label>
						<input
							type="text"
							className="input input-bordered w-full mb-3"
							placeholder="Título del comentario"
							name="commentTitle"
							onChange={(e) => setTitle(e.target.value)}
						/>

						{/* Valoración con estrellas seleccionables */}
						<label className="label">
							<span className="label-text">Valoración</span>
						</label>
						<div className="rating mb-3">
							<input
								type="radio"
								name="rating"
								value="1"
								className="mask mask-star-2"
								onChange={(e) => setRating(e.target.value)}
							/>
							<input
								type="radio"
								name="rating"
								value="2"
								className="mask mask-star-2"
								onChange={(e) => setRating(e.target.value)}
							/>
							<input
								type="radio"
								name="rating"
								value="3"
								className="mask mask-star-2"
								onChange={(e) => setRating(e.target.value)}
							/>
							<input
								type="radio"
								name="rating"
								value="4"
								className="mask mask-star-2"
								onChange={(e) => setRating(e.target.value)}
							/>
							<input
								type="radio"
								name="rating"
								value="5"
								className="mask mask-star-2"
								onChange={(e) => setRating(e.target.value)}
							/>
						</div>

						{/* Content */}
						<textarea
							className="textarea textarea-bordered w-full"
							placeholder="Escribe tu comentario aquí..."
							onChange={(e) => setContent(e.target.value)}
						></textarea>

						<div className="modal-action flex justify-end items-center">
							{/* Mensaje respuesta formulario */}
							{message && (
								<p
									className={`text-sm mr-10 ${
										message.includes('Error')
											? 'text-error'
											: 'text-success font-semibold'
									}`}
								>
									{message}
								</p>
							)}

							{/* Botón */}
							<div className="card-actions justify-end mt-2">
								<button
									type="submit"
									className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
									disabled={loading}
								>
									{loading ? (
										<span className="loading loading-spinner loading-sm" />
									) : (
										'Publicar'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>

			{/* Lista de comentarios */}
			{loading ? (
				<span className="loading loading-spinner loading-lg text-primary mt-10" />
			) : reviews?.length > 0 ? (
				<div className="space-y-4">
					{reviews?.map((review: Review) => (
						<ReviewCard
							key={review.uuid}
							userName={review.user.username}
							rating={review.rating}
							title={review.title}
							content={review.content}
							date={review.date}
						/>
					))}
				</div>
			) : (
				<span />
			)}
		</div>
	);
};

export default Reviews;
