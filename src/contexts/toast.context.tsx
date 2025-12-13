import { createContext, type ReactNode, useContext, useState } from 'react';

interface ToastContextType {
	showToast: (
		msg: string,
		type: '' | 'info' | 'success' | 'warning' | 'error',
		duration: number,
	) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children?: ReactNode }) => {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMsg, setToastMsg] = useState('');
	const [toastType, setToastType] = useState('');

	const showToast = (
		msg: string,
		type: string = '',
		duration: number = 5000,
	) => {
		setToastMsg(msg);
		setToastVisible(true);
		setToastType(type);
		setTimeout(() => {
			setToastVisible(false);
		}, duration);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}

			{toastVisible && (
				<div className="toast toast-top toast-center z-20">
					{/* Necesario para que se carguen las clases */}
					{/* alert-error alert-info alert-success alert-warning */}
					<div className={`alert alert-${toastType}`}>
						<span>{toastMsg}</span>
					</div>
				</div>
			)}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context)
		throw new Error('useToast sólo puede ser usado dentro de ToastContext');
	return context;
};
