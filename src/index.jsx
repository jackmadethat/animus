import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App';
import Nav from './Nav';
import Progress from './components/Progress';
import Timer from './components/Timer';
import Nutrition from './components/Nutrition';
import Info from './components/Info';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { AuthProvider, AuthContext } from './components/Login';
import './styles.scss';

//         Animus
//   Train. Grow. Evolve.

//   (\ /)
//   ( . .)
//   c(")(")

const Main = () => {
	return (
		<>
			<AuthProvider>
				<HashRouter>
					<App />
					<Nav />
					<Routes>
						<Route path="/" element={<Navigate to="/login" />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={ <RequiresAuth><Profile /></RequiresAuth> } />
						<Route path="/progress" element={ <RequiresAuth><Progress /></RequiresAuth> } />
						<Route path="/timer" element={ <RequiresAuth><Timer /></RequiresAuth> } />
						<Route path="/nutrition" element={ <RequiresAuth><Nutrition /></RequiresAuth> } />
						<Route path="/info" element={ <RequiresAuth><Info /></RequiresAuth> } />
					</Routes>
				</HashRouter>
			</AuthProvider>
			<p className="footer">jackmadethat.github.io</p>
		</>
	);
}

const RequiresAuth = ({ children }) => {
	const { isLoggedIn } = useContext(AuthContext);
	if (!isLoggedIn) {
		return <Navigate to="/profile" />;
	}
	return children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);