import React from 'react';
import { useState } from 'react';
import supabase from '../supabaseWrapper';

const LogStamina = ({ UpdateStaminaData, RenderGraph }) => {
	const [distance, setDistance] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [error, setError] = useState(null);

	const handleLog = async (e) => {
		e.preventDefault();
		const today = new Date();
		const formattedDate = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
		try {
			const { error } = await supabase
				.from('stamina')
				.insert([
					{
						member: sessionStorage.getItem('username'),
						date: formattedDate,
						distance: parseFloat(distance),
						hours: parseInt(hours),
						minutes: parseInt(minutes),
						seconds: parseInt(seconds)
					},
				]);
			if (error) {
				throw error;
			}
			await UpdateStaminaData();
			await RenderGraph();
			setDistance(0);
			setHours(0);
			setMinutes(0);
			setSeconds(0);
			setError('Entry added successfully');
		} catch (error) {
			setError(error.message);
			setTimeout(() => {
				setError(null);
			}, 5000);
		}
	};

	return (
		<>
			<form id="log-stamina-form" className="logform" onSubmit={handleLog}>
				<label>Distance (km):</label>
				<input type="number" step="any" value={distance} onChange={(e) => setDistance(e.target.value)} />
				<label>Hours:</label>
				<input type="number" value={hours} onChange={(e) => setHours(parseInt(e.target.value))} />
				<label>Minutes:</label>
				<input type="number" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))} />
				<label>Seconds:</label>
				<input type="number" value={seconds} onChange={(e) => setSeconds(parseInt(e.target.value))} />
			</form>
			<input type="submit" form="log-stamina-form" value="Add Entry" className="center button" />
			<p style={{ marginBottom: -5 + 'px' }}>{error}</p>
		</>
	);
}

export default LogStamina;