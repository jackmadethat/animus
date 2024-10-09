import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import supabase from './supabaseWrapper';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogout = () => {
		setIsLoggedIn(false);
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('password');
		window.location.href = '/';
	};

	useEffect(() => {
		const storedUsername = sessionStorage.getItem('username');
		const storedPassword = sessionStorage.getItem('password');
		if (storedUsername) {
			setIsLoggedIn(true);
			setUsername(storedUsername);
		}
		if (storedPassword) {
			setPassword(storedPassword);
		}
	}, []);

	return (
		<AuthContext.Provider value={{
			isLoggedIn, 
			setIsLoggedIn, 
			username, 
			setUsername, 
			handleLogout
		}}>
			{children}
		</AuthContext.Provider>
	);
}

const Login = () => {
	const { isLoggedIn, setIsLoggedIn, username, setUsername, handleLogout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const handleLogin = async (event) => {
		event.preventDefault();
		const { data, error: err } = await supabase
			.from('members')
			.select('name, password')
			.eq('name', name);
		if (err || !data.length) {
			setError('Invalid username');
			setTimeout(() => {
				setError(null);
			}, 5000);
		} else {
			const isValidPassword = await bcrypt.compare(password, data[0].password);
			if (!isValidPassword) {
				setError('Invalid password');
				setTimeout(() => {
					setError(null);
				}, 5000);
			} else {
				setIsLoggedIn(true);
				setUsername(name);
				sessionStorage.setItem('username', name);
				sessionStorage.setItem('password', data[0].password);
				navigate('/profile');
			}
		}
	};

	const handleRegister = () => {
		navigate('/register');
	};

	if (isLoggedIn) {
		return <Navigate to="/profile" />;
	}

	return (
		<div className="login-container">
			<h3>Login</h3>
			<form onSubmit={handleLogin}>
				<label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} />
				<label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<div>
					<button type="submit">Login</button>
					<button type="button" onClick={handleRegister}>Register</button>
				</div>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
}

export { AuthProvider, AuthContext };
export default Login;