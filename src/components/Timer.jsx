import React, { useState, useEffect } from 'react';
import SetupTimer from './SetupTimer';
import supabase from './supabaseWrapper';
import * as pBar from './progressbarfunctions';

import getReadySound from '../audio/ElevenLabs_GetReady.mp3';
import oneSound from '../audio/ElevenLabs_One.mp3';
import restSound from '../audio/ElevenLabs_Rest.mp3';
import sessionCompletedSound from '../audio/ElevenLabs_SessionCompleted.mp3';
import startWorkingSound from '../audio/ElevenLabs_StartWorking.mp3';
import threeSound from '../audio/ElevenLabs_Three.mp3';
import twoSound from '../audio/ElevenLabs_Two.mp3';
import beepSound from '../audio/beep.mp3';

import Warrior from './workouts/Warrior';
import Nomad from './workouts/Nomad';
import Survivor from './workouts/Survivor';
import Monk from './workouts/Monk';
import Spartan from './workouts/Spartan';
import Beast from './workouts/Beast';

const Timer = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [audio, setAudio] = useState({});
	const [count, setCount] = useState(3);
	const [isRunning, setIsRunning] = useState(false);
	const [isInterval, setIsInterval] = useState(true);
	const [cycles, setCycles] = useState(0);
	const [isInitialCountdown, setIsInitialCountdown] = useState(true);
	const [isSessionOver, setIsSessionOver] = useState(false);
	const [totalCycles, setTotalCycles] = useState(10);
	const [intervalTime, setIntervalTime] = useState(45);
	const [restTime, setRestTime] = useState(120);
	const [showSetup, setShowSetup] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [logStatus, setLogStatus] = useState(null);
	const [sessionStarted, setSessionStarted] = useState(false);

// Audio Object
	const audioFiles = {
		getReady: getReadySound,
		one: oneSound,
		rest: restSound,
		sessionCompleted: sessionCompletedSound,
		startWorking: startWorkingSound,
		three: threeSound,
		two: twoSound,
		beep: beepSound,
	};

// Audio Handler
	const playSound = (soundKey) => {
		if (audio[soundKey]) {
			audio[soundKey].play();
			//console.log("Playing sound: " + soundKey);
		}
	};

// Pre-Load Audio Files
	useEffect(() => {
		const loadAudioFiles = async () => {
			setIsLoading(true);
			try {
				const audioObjects = {};
	
				// Load each audio file
				for (const key in audioFiles) {
					const audioObject = new Audio(audioFiles[key]);
					audioObject.preload = 'auto'; // Force preload
					audioObjects[key] = audioObject;
					//console.log(key); // Log key before loading
					await audioObject.play().then(() => audioObject.pause()); // Load audio
				}
	
				setAudio(audioObjects);
				setTimeout(() => {
					setIsLoading(false);
				}, 250);
			} catch (error) {
				console.error('Error loading audio files:', error);
			}
		};
		(async () => {
			await loadAudioFiles();
		})();
	}, []);

// Initialize Progress Bars
	const initProgressBars = () => {
		pBar.destroyIntervalBar();
		pBar.createIntervalBar(0.01);
		pBar.startInterval();
		pBar.destroySetBar();
		pBar.createSetBar(0.01);
		pBar.startSet();
	};
	useEffect(() => {
		initProgressBars();
	}, []);

// Complete Session
	const CompleteSession = () => {
		playSound('sessionCompleted');
		handleLogWorkout();
		setTimeout(() => {
			setIsRunning(false);
			setIsSessionOver(true);	
		}, 1000);
	}

// Handle Timer
	useEffect(() => {
		let intervalId;
		if (isRunning && !isSessionOver) {
			intervalId = setInterval(() => {
				setCount((prevCount) => {
					console.log(prevCount);
					if (prevCount <= 3 && prevCount > 0) {
						playSound('beep');
					}
					if (prevCount === 0) {
						if (isInitialCountdown) {
							setIsInitialCountdown(false);
							setCycles(1);
							playSound('startWorking');
							setIsInterval(true); // Start with interval
							pBar.destroyIntervalBar();
							pBar.createIntervalBar(intervalTime + 1);
							pBar.startInterval();
							pBar.destroySetBar();
							pBar.createSetBar(totalCycles * (intervalTime + restTime + 2) - restTime);
							pBar.startSet();
							return intervalTime; // Interval duration
						} else {
							if (isInterval) {
								if (cycles < totalCycles) {
									setIsInterval(false); // Switch to rest
									playSound('rest');
									pBar.destroyIntervalBar();
									pBar.createIntervalBar(restTime + 1);
									pBar.startInterval();
									return restTime; // Rest duration
								} else {
									// Complete session
									pBar.destroyIntervalBar();
									pBar.createIntervalBar(0.5);
									pBar.startInterval();
									pBar.destroySetBar();
									pBar.createSetBar(0.5);
									pBar.startSet();
									CompleteSession();
								}
							} else {
								if (cycles < totalCycles) {
									setIsInterval(true); // Switch to interval
									playSound('startWorking');
									setCycles(cycles + 1); // Increment cycle
									pBar.destroyIntervalBar();
									pBar.createIntervalBar(intervalTime + 1);
									pBar.startInterval();
									return intervalTime; // Interval duration
								} else {
									// Complete session
									CompleteSession();						
								}
							}
						}
					}
					return prevCount - 1;
				});
				
				setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
			}, 1000); // Update every 1000ms
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning, isInterval, cycles, isInitialCountdown, isSessionOver, totalCycles, intervalTime, restTime]);

// Toggle Setup
	const handleToggle = () => {
		setIsRunning(!isRunning);
		if (!sessionStarted) {
			playSound('getReady');
			pBar.destroyIntervalBar();
			pBar.destroySetBar();
			setSessionStarted(true);
		} else {
			if (isRunning) {
				pBar.pauseInterval();
				pBar.pauseSet();
			} else {
				pBar.resumeSet(totalCycles * (intervalTime + restTime) - restTime);
				if (isInterval) {
					pBar.resumeInterval(intervalTime);
				} else {
					pBar.resumeInterval(restTime);
				}
			}
		}
	};
	const handleSetupOpen = () => {
		if (!isRunning) {
		  	setShowSetup(true);
		}
	};
	const handleSetupClose = () => {
		setShowSetup(false);
	};

// Reset Session
	const handleReset = () => {
		initProgressBars();
		setIsRunning(false);
		setCount(3);
		setIsInterval(true);
		setCycles(0);
		setIsInitialCountdown(true);
		setIsSessionOver(false);
		setSessionStarted(false);
		setElapsedTime(0);
		setLogStatus(null);	
	};

// Format Time for Clock
	const formatTime = (count) => {
		if (isSessionOver) {
			return '00:00';
		} else {
			const countValue = Math.max(count, 0);
			const minutes = Math.floor(countValue / 60);
			const seconds = countValue % 60;
			return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
	};

// Format Duration of Session
	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secondsRemaining = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
	};

// Handle Logging Workouts
	const handleLogWorkout = async () => {
		try {
			const username = sessionStorage.getItem('username');
			console.log('Username:', username);
	
			const workoutDuration = totalCycles * (intervalTime + restTime); 
			console.log('Workout Duration:', workoutDuration);
	
			const { data, error } = await supabase
				.from('memberdata')
				.select('workouttime, workouts')
				.eq('member', username);
	
			if (error) {
				console.error('Error selecting workouttime:', error);
			} else {
				const existingTime = data[0].workouttime.split(':').map(Number);
				const existingSeconds = existingTime[0] * 3600 + existingTime[1] * 60 + existingTime[2];
				const newSeconds = existingSeconds + workoutDuration;
	
				const hours = Math.floor(newSeconds / 3600);
				const minutes = Math.floor((newSeconds % 3600) / 60);
				const seconds = newSeconds % 60;
	
				const newWorkoutTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	
				const currentWorkouts = data[0].workouts;
				const newWorkouts = currentWorkouts + 1;
	
				const { data: updateData, error: updateError } = await supabase
					.from('memberdata')
					.update({
						workouts: newWorkouts,
						workouttime: newWorkoutTime,
					})
					.eq('member', username);
	
				if (updateError) {
					console.error('Error updating workouttime:', updateError);
					setLogStatus('error');
					setTimeout(() => {
						setLogStatus(null);
					}, 5000);
				} else {
					setLogStatus('success');
					setTimeout(() => {
						setLogStatus(null);
					}, 5000);
				}
			}
		} catch (error) {
			console.error('Error logging workout:', error);
			setLogStatus('error');
			setTimeout(() => {
				setLogStatus(null);
			}, 5000);
		}
	};

// Load Workout
	const loadWorkout = () => {
		let workout = sessionStorage.getItem('workout');
		switch (workout) {
			case 'warrior':
				return <Warrior />;
			case 'nomad':
				return <Nomad />;
			case 'survivor':
				return <Survivor />;
			case 'spartan':
				return <Spartan />;
			case 'monk':
				return <Monk />;
			case 'beast':
				return <Beast />;
			default:
				return null;
		}
	}

// Return
	return (
		<>
			<div className="timer-container">
				<div className="intervalprogress" id="intervalprogress" />
				<div className="setprogress" id="setprogress" />
				<div className="clock">
					<div className="major twelve">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major one">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major two">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major three">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major four">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major five">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major six">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major seven">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major eight">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major nine">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major ten">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
					<div className="major eleven">
						<div className="minor minor-one" />
						<div className="minor minor-two" />
						<div className="minor minor-three" />
						<div className="minor minor-four" />
						<div className="minor minor-five" />
						<div className="minor minor-six" />
						<div className="minor minor-seven" />
						<div className="minor minor-eight" />
						<div className="minor minor-nine" />
					</div>
				</div>
				{isLoading ? (
					<h3 className="center" style={{ marginTop: -315 + 'px' }}>Loading...</h3>
				) : (
					<>
						{!showSetup ? (
							<div className="timerData">
								<div className="sessionTracker">
									<p>Interval</p>
									<p>Remaining</p>
									<p className="sessionNumber">{isInitialCountdown ? 0 : cycles}</p>
									<p className="sessionNumber">{isInitialCountdown ? totalCycles : totalCycles - cycles}</p>
								</div>
								<div className="mainClock">{formatTime(count)}</div>
								{/*
								<div className="statusText">
									{isSessionOver ? 
											(logStatus === null ? 'Session Over' : logStatus === 'success' ? (
											<>	
												<p style={{ color: 'green' }}>Workout logged successfully</p>
											</>
										) : (
											<>	
												<p style={{ color: 'red' }}>Error logging workout</p>
												<button onClick={handleLogWorkout}>Log Workout</button>
											</>
										)) : isRunning ? 
											(isInitialCountdown ? 'Get Ready' : (isInterval ? 'Interval' : 'Rest')
										) : !isInitialCountdown ? 'Press play to resume session' : 'Press start to begin session'
									}
								</div>
								*/}
								<div className="timerButtons">
									<button onClick={handleToggle} style={{ marginRight: 10 + 'px' }}>{isRunning ? 'Pause' : isInitialCountdown ? 'Start' : 'Play'}</button>
									<button onClick={handleReset} style={{ marginLeft: 10 + 'px' }}>Reset</button><br />
									<button onClick={handleSetupOpen} style={{ marginTop: 20 + 'px' }}>Setup Timer</button>
								</div>
								<table className="sessionStatus">
									<tbody>
										<tr>
											<td>Interval Time</td>
										</tr>
										<tr>
											<td style={{ fontWeight: 'bold', fontSize: 18 + 'px' }}>{intervalTime}sec</td>
										</tr>
										<tr>
											<td>Rest Time</td>
										</tr>
										<tr>
											<td style={{ fontWeight: 'bold', fontSize: 18 + 'px' }}>{restTime}sec</td>
										</tr>
										<tr>
											<td>Total Intervals</td>
										</tr>
										<tr>
											<td style={{ fontWeight: 'bold', fontSize: 18 + 'px' }}>{totalCycles}</td>
										</tr>
									</tbody>
								</table>
								<table className="timeStatus">
									<tbody>
										<tr>
											<td>Time Elapsed</td>
										</tr>
										<tr>
											<td style={{ fontWeight: 'bold', fontSize: 18 + 'px' }}>{formatDuration(elapsedTime)}</td>
										</tr>
										<tr>
											<td>Total Duration</td>
										</tr>
										<tr>
											<td style={{ fontWeight: 'bold', fontSize: 18 + 'px' }}>{formatDuration(totalCycles * (intervalTime + restTime))}</td>
										</tr>
									</tbody>
								</table>
							</div>
						) : (
							<SetupTimer
								intervalTime={intervalTime}
								setIntervalTime={setIntervalTime}
								restTime={restTime}
								setRestTime={setRestTime}
								totalCycles={totalCycles}
								setTotalCycles={setTotalCycles}
								onClose={handleSetupClose}
							/>
						)}
					</>
				)}
			</div>
			<div className="info-container container-adjust">
				{isLoading ? (
					<></>
				) : (
					<>
						{loadWorkout()}
					</>
				)}
			</div>
		</>
	);
};

export default Timer;