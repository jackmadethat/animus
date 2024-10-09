import React, { useState } from 'react';
import supabase from './supabaseWrapper';

const ProfileData = ({ onUpdate, handleToggleProfileData }) => {
	const [age, setAge] = useState('');
	const [height, setHeight] = useState('');
	const [weight, setWeight] = useState('');
	const [sex, setSex] = useState('');
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		const username = sessionStorage.getItem('username');

		if (!age || !height || !weight || !sex) {
			setMessage('Please fill in all fields');
			setIsError(true);
			setTimeout(() => {
				setMessage('');
				setIsError(false);
			}, 5000);
			return;
		}

		const sexValue = sex === 'M' ? 'Male' : 'Female';

		const { data, error: supabaseError } = await supabase
			.from('memberdata')
			.update({ age, height, weight, sex: sexValue })
			.eq('member', username);

		if (supabaseError) {
			setMessage(supabaseError.message);
			setIsError(true);
			setTimeout(() => {
				setMessage('');
				setIsError(false);
			}, 5000);
		} else {
			setMessage('Profile updated successfully');
			setIsError(false);
			setAge('');
			setHeight('');
			setWeight('');
			setSex('');
			onUpdate(); 
			setTimeout(() => {
				setMessage('');
			}, 5000);
		}
	};

	const handleBack = () => {
		handleToggleProfileData();
		onUpdate(); 
	};

	return (
		<div className="login-container">
			<form id="profile-form" onSubmit={handleUpdateProfile}>
				<label>Age:</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
				<label>Height (cm):</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
				<label>Weight (kg):</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
				<label>Sex:</label><select value={sex} onChange={(e) => setSex(e.target.value)}>
					<option value="">Select</option>
					<option value="M">Male</option>
					<option value="F">Female</option>
				</select>
				<div>
					<button type="submit" form="profile-form" style={{ marginBottom: 10 + 'px', marginTop: 5 + 'px' }}>Update Profile</button>
				</div>
			</form>
			<button onClick={handleBack}>Back</button>
			{message && <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>}
		</div>
	);
}

export default ProfileData;