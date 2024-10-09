import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import supabase from './supabaseWrapper';

const Register = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState(null);

	const handleRegister = async (event) => {
		event.preventDefault();
		if (!username || !password || !confirmPassword) {
			setError('Please fill in all fields');
			setTimeout(() => {
				setError(null);
			}, 5000);
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setTimeout(() => {
				setError(null);
			}, 5000);
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const { data, error: err } = await supabase
				.from('members')
				.insert([
					{
						name: username,
						password: hashedPassword,
					},
				]);
			if (err) {
				setError(err.message);
			} else {
				// Add new row to 'memberdata' table
				const { data: memberData, error: memberError } = await supabase
					.from('memberdata')
					.insert([
						{
							member: username,
							age: 0,
							height: 0,
							weight: 0,
							workouts: 0,
							workouttime: "00:00:00"
						},
					]);
				if (memberError) {
					setError(memberError.message);
				} else {
					navigate('/');
				}
			}
		}
	};

	return (
		<div className="login-container">
			<h3>Register</h3>
			<form onSubmit={handleRegister}>
				<label>Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				<label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<label>Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				<div>
					<button type="submit">Register</button>
					<button type="button" onClick={() => navigate('/')}>Back to Login</button>
				</div>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
}

export default Register;