import React from 'react';
import { useContext, useEffect } from 'react';
import { AuthContext } from './components/Login';

const App = () => {
	const { isLoggedIn } = useContext(AuthContext);

	const checkAudioPermission = () => {
		// Check for Safari
		if (typeof Audio !== 'undefined' && Audio.prototype.play) {
		  	const audio = new Audio();
		  	try {
				// Attempt to play audio in silent mode
				audio.volume = 0;
				audio.play().then(() => {
			  	console.log('Audio playback allowed');
				}).catch(() => {
			  	console.log('Audio playback not allowed');
				});
		  	} catch (e) {
				console.log('Audio playback not allowed');
		 	}	
		} else {
		// Check for other browsers using navigator.permissions
			navigator.permissions.query({ name: 'audio', values: ['autoplay'] })
			.then(permission => {
			  	if (permission.state === 'granted') {
					console.log('Audio playback allowed');
			  	} else {
					console.log('Audio playback not allowed');
			  	}
			})
			.catch(error => {
			  	console.error('Error checking audio permission:', error);
			});
		}
	}

	useEffect(() => {
		checkAudioPermission();
	}, []);

	return (
		<>
			<h1 className="mainHeading">Animus</h1>
			{/*
			{isLoggedIn ? 
				<p className="sessionStatus">Logged in as: {sessionStorage.getItem('username')}</p> : 
				<p className="sessionStatus">Not Logged In</p>
			}
			*/}
		</>
	);
};

export default App;