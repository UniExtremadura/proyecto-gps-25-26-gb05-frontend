import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './auth.context';
import { useToast } from './toast.context';
import { useContext } from 'react';
import { supabase } from '../lib/supabase.ts';

export interface FullUser {
	id: string;

	// PUBLIC
	username?: string;
	imgUrl?: string;

	// PRIVATE
	firstName?: string;
	lastName?: string;
	password?: string;
}

interface UserContextType {
	fullUser: FullUser | null;
	loading: boolean;
	fetchUser: () => Promise<void>;
	updatePublicUser: (data: Partial<FullUser>) => Promise<void>;
	updatePrivateUser: (data: Partial<FullUser>) => Promise<void>;
	updatePassword: (data: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { session } = useAuth();
	const [fullUser, setFullUser] = useState<FullUser | null>(null);
	const [loading, setLoading] = useState(true);
	const toast = useToast();

	//1. Obtener datos completos del usuario
	const fetchUser = async () => {
		if (!session) return;

		setLoading(true);

		const response = await fetch(`${window.location.origin}/api/v1/users/me`, {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		});

		const data = await response.json();
		setFullUser(data);
		setLoading(false);
	};

	//2. Traer datos cuando el usuario haga login
	useEffect(() => {
		if (session) fetchUser();
	}, [session]);

	//3. Update público
	const updatePublicUser = async (data: Partial<FullUser>) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/users/public`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`,
				},
				body: JSON.stringify(data),
			},
		);

		if (!response.ok) {
			toast.showToast('Error actualizando datos públicos', 'error', 4000);
			return;
		}

		await fetchUser();
		toast.showToast('Perfil actualizado', 'success', 3000);
	};

	//4. Update privado
	const updatePrivateUser = async (data: Partial<FullUser>) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/users/private`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`,
				},
				body: JSON.stringify(data),
			},
		);

		if (!response.ok) {
			toast.showToast('Error actualizando datos privados', 'error', 4000);
			return;
		}

		await fetchUser();
		toast.showToast('Datos privados actualizados', 'success', 3000);
	};

	//5. Update password

	const updatePassword = async (data: string) => {
		const response = await fetch(
			`${window.location.origin}/api/v1/users/password`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`,
				},
				body: JSON.stringify(data),
			},
		);

		if (!response.ok) {
			toast.showToast('Error actualizando contraseña', 'error', 4000);
			return;
		}

		await fetchUser();
		await supabase.auth.updateUser({ password: data });
		toast.showToast('Contraseña actualizada', 'success', 3000);
	};

	return (
		<UserContext.Provider
			value={{
				fullUser,
				loading,
				fetchUser,
				updatePublicUser,
				updatePrivateUser,
				updatePassword,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const ctx = useContext(UserContext);
	if (!ctx) {
		throw new Error('useUser debe usarse dentro de UserProvider');
	}
	return ctx;
};
