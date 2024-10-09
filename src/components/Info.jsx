import React, { useState, useEffect } from 'react';
import Warrior from './workouts/Warrior';
import Nomad from './workouts/Nomad';
import Survivor from './workouts/Survivor';
import Monk from './workouts/Monk';
import Spartan from './workouts/Spartan';
import Beast from './workouts/Beast';

const Info = () => {
	const [workout, setWorkout] = useState(null);
	const [buttonText, setButtonText] = useState("Pin to Timer");
	const [buttonClass, setButtonClass] = useState("initial-class");

	const xButton = () => {
		setWorkout(null);
		sessionStorage.removeItem('workout');
	}

	const workoutContentMap = {
		warrior: 
			<div className="warrior">
				<h2>Warrior</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("warrior")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Warrior />
					</>
				) : 
				(
					<></>
				)}
			</div>,
		nomad: 
			<div className="nomad">
				<h2>Nomad</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("nomad")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Nomad />
					</>
				) : 
				(
					<></>
				)}
			</div>,
		survivor: 
			<div className="survivor">
				<h2>Survivor</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("survivor")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Survivor />
					</>
				) : 
				(
					<></>
				)}
			</div>,
		monk: 
			<div className="monk">
				<h2>Monk</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("monk")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Monk />
					</>
				) : 
				(
					<></>
				)}
			</div>,
		spartan: 
			<div className="spartan">
				<h2>Spartan</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("spartan")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Spartan />
					</>
				) : 
				(
					<></>
				)}
			</div>,
		beast: 
			<div className="beast">
				<h2>Beast</h2>
				{workout !== null ? (
					<>
						<button className={buttonClass} type="button" onClick={() => setTimerWorkout("beast")}>{buttonText}</button>
						<button className="xButton" type="button" onClick={xButton}>X</button>
						<Beast />
					</>
				) : 
				(
					<></>
				)}
			</div>,
	};

	const setTimerWorkout = (workout) => {
		sessionStorage.setItem('workout', workout);
		console.log(sessionStorage.getItem('workout'));
		setButtonText("Pinned");
		setButtonClass("pinButtonAlt");
	}

	const loadWorkout = (workout) => {
		return workoutContent(workout);
	}

	useEffect(() => {
		setButtonText("Pin to Timer");
		setButtonClass("pinButton");
	}, [workout]);
	
	const workoutContent = (title) => workoutContentMap[title] || null;

	return (
		<div className="info-container">
			<h3 style={{ marginBottom: -18 + 'px' }}>Animus Workouts</h3>
			<div style={{ marginBottom: 30 + 'px', marginTop: 30 + 'px' }}>
				<button className="warriorButton" type="button" onClick={() => setWorkout("warrior")}></button>
				<button className="spartanButton" type="button" onClick={() => setWorkout("spartan")}></button>
				<button className="nomadButton" type="button" onClick={() => setWorkout("nomad")}></button>
				<button className="survivorButton" type="button" onClick={() => setWorkout("survivor")}></button>
				<button className="monkButton" type="button" onClick={() => setWorkout("monk")}></button>
				<button className="beastButton" type="button" onClick={() => setWorkout("beast")}></button>
			</div>
			{loadWorkout(workout)}
		</div>
	);
}

export default Info;