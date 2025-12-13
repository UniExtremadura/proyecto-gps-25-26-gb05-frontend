import { createContext, type ReactNode, useContext, useState } from 'react';
import { useAuth } from './auth.context.tsx';
import type { Song } from './song.context.tsx';
import type { Album } from './album.context.tsx';

export interface Notification {
	uuid: string;
	message: string;
	type?: 'Song' | 'Album';
	item?: Song | Album;
}

interface NotificationContextType {
	notifications: Notification[];
	fetchNotifications: () => Promise<void>;
	deleteNotification: (uuid: string) => Promise<void>;
}

interface NotificationProviderProps {
	children?: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const NotificationProvider = ({
	children,
}: NotificationProviderProps) => {
	const { session } = useAuth();
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const fetchNotifications = async () => {
		if (!session) return;

		const res = await fetch(
			`${window.location.origin}/api/v1/users/notifications`,
			{
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		);

		if (res.ok) {
			setNotifications(await res.json());
		}
	};

	const deleteNotification = async (uuid: string) => {
		if (!session) return;

		const res = await fetch(
			`${window.location.origin}/api/v1/users/notifications/${uuid}`,
			{
				method: 'DELETE',
				headers: { Authorization: `Bearer ${session.access_token}` },
			},
		);

		if (res.ok) {
			fetchNotifications();
		}
	};

	return (
		<NotificationContext.Provider
			value={{ notifications, fetchNotifications, deleteNotification }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const ctx = useContext(NotificationContext);
	if (!ctx) {
		throw new Error(
			'useNotifications debe usarse dentro de NotificationProvider',
		);
	}
	return ctx;
};
