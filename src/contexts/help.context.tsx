import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './auth.context.tsx';

// Tipo de artículo
export interface HelpArticle {
	uuid: string;
	title: string;
	category: HelpCategory;
	date: string;
	content: string;
}

// Categorías de artículos
export const HelpCategories = {
	CANCIONES: 'canciones',
	ALBUMES: 'albumes',
	MERCHANDISING: 'merchandising',
	COMPRAS: 'compras',
	USUARIOS: 'usuarios',
	ESTADISTICAS: 'estadisticas',
	COMENTARIOS: 'comentarios',
} as const;

// Tipado del contexto
interface HelpContextType {
	getHelpArticles: () => Promise<HelpArticle[]>;
	getHelpArticleById: (uuid: string) => Promise<HelpArticle>;
	addHelpArticle: (article: Omit<HelpArticle, 'uuid' | 'date'>) => Promise<void>;
	updateHelpArticle: (article: HelpArticle) => Promise<HelpArticle>;
	deleteHelpArticle: (uuid: string) => Promise<boolean>;
}

// Crear contexto
const HelpContext = createContext<HelpContextType | undefined>(undefined);

// Provider
interface HelpProviderProps {
	children: ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
	// Autorización
	const auth = useAuth();

	// Función para obtener todos los artículos de ayuda
	const getHelpArticles = async (): Promise<HelpArticle[]> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/content/help`,
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

		return (await response.json()) as HelpArticle[];
	};

	// Función para obtener un artículo de ayuda por su ID
	const getHelpArticleById = async (uuid: string): Promise<HelpArticle> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/content/help/${uuid}`,
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

		return (await response.json()) as HelpArticle;
	};

	// Función para agregar un nuevo artículo de ayuda
	const addHelpArticle = async (
		article: Omit<HelpArticle, 'uuid' | 'date'>,
	): Promise<void> => {
		const newHelpArticle = {
			...article,
		};

		const response = await fetch(`${window.location.origin}/api/v1/help`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.session?.access_token}`,
			},
			body: JSON.stringify(newHelpArticle),
		});

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}
	};

	// Función para actualizar un artículo de ayuda
	const updateHelpArticle = async (
		article: HelpArticle,
	): Promise<HelpArticle> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/help/${article.uuid}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.session?.access_token}`,
				},
				body: JSON.stringify(article),
			},
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}

		return (await response.json()) as HelpArticle;
	};

	// Función para eliminar un artículo de ayuda
	const deleteHelpArticle = async (uuid: string): Promise<boolean> => {
		const response = await fetch(
			`${window.location.origin}/api/v1/help/${uuid}`,
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
		<HelpContext.Provider
			value={{
				getHelpArticles,
				getHelpArticleById,
				addHelpArticle,
				updateHelpArticle,
				deleteHelpArticle,
			}}
		>
			{children}
		</HelpContext.Provider>
	);
};

// Hook para usar el contexto
export const useHelpArticles = (): HelpContextType => {
	const context = useContext(HelpContext);
	if (!context) {
		throw new Error('useHelpArticles debe usarse dentro de un HelpProvider');
	}
	return context;
};

// Exportar las categorías
export type HelpCategory = (typeof HelpCategories)[keyof typeof HelpCategories];
