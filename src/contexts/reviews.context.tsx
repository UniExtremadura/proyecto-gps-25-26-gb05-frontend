import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './auth.context.tsx';
import type { FullUser } from './user.context.tsx';

// Tipo de reseñas
export interface Review {
	uuid: string;
	productType: 'Song' | 'Album';
	productId: string;
	user: FullUser;
	rating: number;
	title?: string;
	content?: string;
	date: string;
}

// Tipado del contexto
interface ReviewsContextType {
	getReviews: () => Promise<Review[]>;
	getReviewById: (uuid: string) => Promise<Review>;
	getReviewsByProductId: (productUuid: string) => Promise<Review[]>;
	addReview: (article: Omit<Review, 'uuid' | 'date'>) => Promise<void>;
	deleteReview: (uuid: string) => Promise<boolean>;
}

// Crear contexto
const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Provider
interface ReviewsProviderProps {
	children: ReactNode;
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({
	children,
}) => {
	// Autorización
	const auth = useAuth();

	// Función para obtener todas las reseñas
	const getReviews = async (): Promise<Review[]> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/content/reviews`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body).message;
		}

		return (await response.json()) as Review[];
	};

	// Función para obtener una reseña por su ID
	const getReviewById = async (uuid: string): Promise<Review> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/content/reviews/${uuid}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}

		return (await response.json()) as Review;
	};

	// Función para obtener todas las reseñas de un producto por su ID.
	const getReviewsByProductId = async (
		productUuid: string,
	): Promise<Review[]> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/content/reviews/product/${productUuid}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}

		return (await response.json()) as Review[];
	};

	// Función para agregar una nueva reseña
	const addReview = async (
		review: Omit<Review, 'uuid' | 'user' | 'date'>,
	): Promise<void> => {
		const newReview = {
			...review,
		};

		const response = await fetch(`${window.location.origin}/api/v1/reviews`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.session?.access_token}`,
			},
			body: JSON.stringify(newReview),
		});

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}
	};

	// Función para eliminar una reseña
	const deleteReview = async (uuid: string): Promise<boolean> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/reviews/${uuid}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.session?.access_token}`,
				},
			},
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}

		return (await response.json()) as boolean;
	};

	return (
		<ReviewsContext.Provider
			value={{
				getReviews,
				getReviewById,
				getReviewsByProductId,
				addReview,
				deleteReview,
			}}
		>
			{children}
		</ReviewsContext.Provider>
	);
};

// Hook para usar el contexto
export const useReviews = (): ReviewsContextType => {
	const context = useContext(ReviewsContext);
	if (!context) {
		throw new Error('useReviews debe usarse dentro de un ReviewsProvider');
	}
	return context;
};
