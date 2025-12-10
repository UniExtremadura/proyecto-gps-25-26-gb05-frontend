import type { Session, User } from '@supabase/supabase-js';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase.ts';
import { useNavigate } from 'react-router';
import { useToast } from './toast.context.tsx';

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signUp: (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		username: string,
		role: 'user' | 'artist',
	) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
	deleteAccount: () => Promise<void>;
	resetPassword: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		username: string,
		role: 'user' | 'artist',
	) => {
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) throw error;

		const response = await fetch(`${window.location.origin}/api/v1/auth/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.session?.access_token}`,
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				username,
				role,
			}),
		});

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}
	};

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
	};

	const signInWithGoogle = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/api/v1/auth/callback`,
			},
		});
		if (error) throw error;
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		window.location.reload();
		navigate('/');
	};

	const deleteAccount = async () => {
		const response = await fetch(`${window.location.origin}/api/v1/auth/users`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${session?.access_token}`,
			},
		});

		if (!response.ok) {
			const body = await response.json();
			throw new Error(body.message);
		}
	};

	const resetPassword = async () => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(
			user!.email!,
		);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				loading,
				signUp,
				signIn,
				signInWithGoogle,
				signOut,
				deleteAccount,
				resetPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('useAuth sólo puede ser usado dentro de AuthContext');
	return context;
};
