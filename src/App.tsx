import './App.css';
import { Outlet, Route, Routes } from 'react-router';
import SignUp from './routes/auth/sign-up.tsx';
import SignIn from './routes/auth/sign-in.tsx';
import NavBarContainer from './components/navbar.container.tsx';
import Index from './routes';
import UserDashboard from './routes/user/user-dashboard.tsx';
import RequiredRoleContainer from './components/required-role.container.tsx';
import UserSettings from './routes/user/user-settings.tsx';
import UserOrders from './routes/user/user-orders.tsx';
import OrderDetails from './routes/user/orders/order-details.tsx';
import NotFound from './routes/not-found.tsx';
import SongInfo from './routes/song/song-info.tsx';
import { OrderProvider } from './contexts/order.context.tsx';
import AlbumInfo from './routes/album/album-info.tsx';
import { GenreProvider } from './contexts/genre.context.tsx';
import UserLibrary from './routes/user/user-library.tsx';
import Shop from './routes/shop/shop.tsx';
import Checkout from './routes/checkout/checkout.tsx';
import CheckoutSuccess from './routes/checkout/checkout-success.tsx';
import CheckoutCancel from './routes/checkout/checkout-cancel.tsx';
import ArtistDashboard from './routes/artist/artist-dashboard.tsx';
import ArtistReleases from './routes/artist/artist-releases.tsx';
import { ArtistProvider } from './contexts/artist.context.tsx';
import { HelpProvider } from './contexts/help.context.tsx';
import Help from './routes/help/help.tsx';
import UserWishlist from './routes/user/user-wishlist.tsx';
import AdminDashboard from './routes/admin/admin-dashboard.tsx';
import AdminGenres from './routes/admin/admin-genres.tsx';
import ArtistPayments from './routes/artist/artist-payments.tsx';
import ArtistStatsComponent from './routes/artist/artist-stats.tsx';
import Dashboard from './routes/auth/dashboard.tsx';
import MerchInfo from './routes/merch/merch-info.tsx';
import AdminOrders from './routes/admin/admin-orders.tsx';
import ArtistProfile from './routes/profile/artist/artist-profile.tsx';
import ArtistEditProfile from './routes/artist/artist-edit-profile.tsx';
import LibraryAlbum from './routes/user/library/library-album.tsx';
import AdminHelp from './routes/admin/admin-help.tsx';
import UserStats from './routes/user/user-stats.tsx';

function App() {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />

			<Route path="auth">
				<Route path="sign-up" element={<SignUp />} />
				<Route path="sign-in" element={<SignIn />} />
			</Route>
			<Route path="dashboard" element={<Dashboard />} />

			<Route path="admin" element={<RequiredRoleContainer roles={['admin']} />}>
				<Route path="dashboard" element={<AdminDashboard />}>
					<Route path="genres" element={<GenreProvider><AdminGenres /></GenreProvider>} />
					<Route path="orders" element={<OrderProvider><AdminOrders /></OrderProvider>} />
					<Route path="help" element={<HelpProvider><AdminHelp /></HelpProvider>} />
				</Route>
			</Route>

			<Route path="" element={<NavBarContainer />}>
				<Route path="" element={<Index />} />
				<Route
					path="help"
					element={
						<HelpProvider>
							<Help />
						</HelpProvider>
					}
				/>

				<Route
					path="shop"
					element={
						<GenreProvider>
							<Shop />
						</GenreProvider>
					}
				/>

				<Route
					path="checkout"
					element={
						<OrderProvider>
							<Outlet />
						</OrderProvider>
					}
				>
					<Route index element={<Checkout />} />
					<Route path="success" element={<CheckoutSuccess />} />
					<Route path="cancel" element={<CheckoutCancel />} />
				</Route>

				<Route path="song/:uuid" element={<SongInfo />} />
				<Route path="album/:uuid" element={<AlbumInfo />} />
				<Route path="merch/:uuid" element={<MerchInfo />} />

				<Route path="profile/artist/:uuid" element={
					<ArtistProvider>
						<RequiredRoleContainer roles={['user', 'artist', 'guest']} />
					</ArtistProvider>
				}>
					<Route index element={<ArtistProfile />} />
				</Route>

				<Route
					path="user"
					element={<RequiredRoleContainer roles={['user', 'artist']} />}
				>
					<Route path="dashboard" element={<UserDashboard />}>
						<Route path="for-you" />
						<Route path="wishlist" element={<UserWishlist />} />
						<Route path="library" element={<UserLibrary />} />
						<Route path="library/album/:uuid" element={<LibraryAlbum />} />
						<Route path="stats" element={<UserStats />} />
						<Route
							path="orders"
							element={
								<OrderProvider>
									<Outlet />
								</OrderProvider>
							}
						>
							<Route index element={<UserOrders />} />
							<Route path=":uuid" element={<OrderDetails />} />
						</Route>
						<Route path="stats" />
						<Route path="profile" />
						<Route path="settings" element={<UserSettings />} />
					</Route>
				</Route>

				<Route path="artist" element={<RequiredRoleContainer roles={['artist']} />}>
					<Route
						path="dashboard"
						element={
							<ArtistProvider>
								<ArtistDashboard />
							</ArtistProvider>
						}
					>
						<Route path="for-you" />
						<Route
							path="releases"
							element={
								<GenreProvider>
									<ArtistReleases />
								</GenreProvider>
							}
						/>
						<Route path="payments" element={<ArtistPayments />} />
						<Route path="stats" element={<ArtistStatsComponent />} />
						<Route path="profile" element={<ArtistEditProfile />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
