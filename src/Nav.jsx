import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './components/Login';

const Nav = () => {
	const { isLoggedIn } = useContext(AuthContext);

	return (
		<>
			<div className="nav">
				<Link to="/" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>Profile </Link>
				<Link to="/progress" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>Stats </Link>
				<Link to="/timer" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>Training </Link>
				<Link to="/nutrition" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>Nutrition </Link>
				<Link to="/info" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>Info </Link>
			</div>
		</>
	);
};

export default Nav;