import './App.css';
import { Route, Routes } from 'react-router';
import SignUp from './routes/auth/sign-up.tsx';
import SignIn from './routes/auth/sign-in.tsx';
import Catalog from './routes/products/catalog.tsx';
import Help from './routes/help/help.tsx';

function App() {
	return (
		<Routes>
			<Route path="auth">
				<Route path="sign-up" element={<SignUp />} />
				<Route path="sign-in" element={<SignIn />} />
			</Route>
			<Route path="catalog" element={<Catalog />} />
			<Route path="help" element={<Help />} />
		</Routes>
	);
}

export default App;
