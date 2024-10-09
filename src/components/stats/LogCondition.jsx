import React from 'react'; 
import { useState } from 'react';
import supabase from '../supabaseWrapper';

const LogCondition = ({ UpdateConditionData, RenderGraph }) => {
	const [pushups, setPushups] = useState(0);
	const [squats, setSquats] = useState(0);
	const [situps, setSitups] = useState(0);
	const [error, setError] = useState(null);

	const handleLog = async (e) => {
		e.preventDefault();
		const today = new Date();
		const formattedDate = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
		try {
			const { error } = await supabase
				.from('conditioning')
				.insert([
					{
						member: sessionStorage.getItem('username'),
						date: formattedDate,
						pushups: pushups,
						squats: squats,
						situps: situps,
					},
				]);
			if (error) {
				throw error;
			}
			await UpdateConditionData();
			await RenderGraph();
			setPushups(0);
			setSquats(0);
			setSitups(0);
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
			<form id="log-condition-form" className="logform" onSubmit={handleLog}>
					<label>Push-Ups:</label>
					<input type="number" value={pushups} onChange={(e) => setPushups(parseInt(e.target.value))} />
					<label>Squats:</label>
					<input type="number" value={squats} onChange={(e) => setSquats(parseInt(e.target.value))} />
					<label>Sit-Ups:</label>
					<input type="number" value={situps} onChange={(e) => setSitups(parseInt(e.target.value))} />
			</form>
			<input type="submit" form="log-condition-form" value="Add Entry" className="center button" />
			<p style={{ marginBottom: -5 + 'px' }}>{error}</p>
		</>
	);
}

export default LogCondition;