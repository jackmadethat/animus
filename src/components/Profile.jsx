import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './Login';
import ProfileData from './ProfileData';
import bcrypt from 'bcryptjs';
import supabase from './supabaseWrapper';

const Profile = () => {
	const { isLoggedIn, handleLogout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [showProfileData, setShowProfileData] = useState(false);
	const [memberData, setMemberData] = useState({});
	const [resetConfirm, setResetConfirm] = useState(false);
	const [passwordInput, setPasswordInput] = useState('');
	const [resetMessage, setResetMessage] = useState('');
	const [showMessage, setShowMessage] = useState(false);

	const fetchMemberData = async () => {
		if (!isLoggedIn) return;
		const username = sessionStorage.getItem('username');
		const { data, error } = await supabase
			.from('memberdata')
			.select('age, height, weight, sex, workouts, workouttime')
			.eq('member', username);
		if (error) {
			console.error(error);
		} else {
			setMemberData(data[0]);
		}
	};

	useEffect(() => {
		fetchMemberData();
	}, [isLoggedIn]);

	if (!isLoggedIn) {
		return <Navigate to="/" />;
	}

	const handleLogOut = () => {
		handleLogout();
		navigate('/');
	};

	const handleToggleProfileData = () => {
		setShowProfileData(!showProfileData);
		fetchMemberData(); 
	};

	const handleResetWorkoutData = async () => {
		const hashedPassword = sessionStorage.getItem('password');
		const isValidPassword = await bcrypt.compare(passwordInput, hashedPassword);
		
		if (isValidPassword) {
			try {
				const { data, error } = await supabase
					.from('memberdata')
					.update({
						workouts: 0,
						workouttime: "00:00:00",
					})
					.eq('member', sessionStorage.getItem('username'));
		
				if (error) {
					console.error('Error resetting workout data:', error);
					setResetMessage('Error resetting workout data');
				} else {
					fetchMemberData();
					setResetMessage('Workout data successfully reset');
				}
			} catch (error) {
				console.error('Error resetting workout data:', error);
				setResetMessage('Error resetting workout data');
			} finally {
				setResetConfirm(false);
			}
			setShowMessage(true);
			setTimeout(() => {
				setShowMessage(false);
				setResetMessage('');
			}, 5000);
		} else {
			setResetMessage('Incorrect password');
			setShowMessage(true);
			setTimeout(() => {
				setShowMessage(false);
				setResetMessage(' ');
			}, 5000);
		}
	};
	
	const handleCancelReset = () => {
		setResetConfirm(false);
		setPasswordInput('');
	};

	const hasWorkouts = memberData.workouts > 0;
	const workoutDisplay = hasWorkouts ? (
		<>
			<p className="leftSide">Workouts Completed:</p><p className="rightSide">{memberData.workouts}</p>
			<p className="leftSide">Total Workout Time:</p><p className="rightSide">{memberData.workouttime}</p>
		</>
	) : (
		<div className="centered">
			<p>No workouts logged yet</p>
		</div>
	)

	return (
		<div className="profile-container">
			<h3>{!showProfileData ? sessionStorage.getItem('username') : "Update Details"}</h3>
			{!isLoggedIn ? (
				<Navigate to="/" />
			) : !memberData || Object.keys(memberData).length === 0 ? (
				<h4>Loading...</h4>
			) : !showProfileData ? (
				<div>
					<div className="dataDiv">
						{/*<p>Password:</p><p>{sessionStorage.getItem('password')}</p>*/}
						<p className="leftSide">Age:</p><p className="rightSide">{memberData.age}</p>
						<p className="leftSide">Sex:</p><p className="rightSide">{memberData.sex}</p>
						<p className="leftSide">Height:</p><p className="rightSide">{memberData.height}cm</p>
						<p className="leftSide">Weight:</p><p className="rightSide">{memberData.weight}kg</p>
						{workoutDisplay}
					</div>
					<div className="buttonDiv">
						<button onClick={handleToggleProfileData}>Update Details</button>
						{resetConfirm ? (
							<>
								<input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter password" /><br />
								<div className="confirmButtons">
									<button className="confirm-cancel" onClick={handleResetWorkoutData}>Confirm</button>
									<button className="confirm-cancel" onClick={handleCancelReset}>Cancel</button>
								</div>
							</>
						) : (
								<button onClick={() => setResetConfirm(true)}>Reset Workout Data</button>
						)}
						<button onClick={handleLogOut}>Logout</button>
						{showMessage && <p style={{ color: resetMessage === 'Incorrect password' ? 'red' : 'green' }}>{resetMessage}</p>}
					</div>
				</div>
			) : (
				<>
					<ProfileData 
						onUpdate={fetchMemberData} 
						handleToggleProfileData={handleToggleProfileData} 
					/>
				</>
			)}
		</div>
	);
}

export default Profile;