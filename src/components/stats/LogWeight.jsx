import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseWrapper';

const LogWeight = ({ UpdateFitnessData, RenderGraph }) => {
	const [fitnessData, setFitnessData] = useState([]);
	const [weight, setWeight] = useState('');
	const [submissionStatus, setSubmissionStatus] = useState('');
	const username = sessionStorage.getItem('username');
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchFitnessData() {
			const { data, error } = await supabase
				.from('jackfitness')
				.select('date, weight');
			if (error) console.error(error);
			else {
				setFitnessData(data);
			}
		}
		fetchFitnessData();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (weight === '') {
			setSubmissionStatus('Please fill in weight');
			return;
		}
		const today = new Date();
		const formattedDate = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
		const existingEntry = fitnessData.find((entry) => entry.member === username && entry.date.day === formattedDate.day && entry.date.month === formattedDate.month && entry.date.year === formattedDate.year);
		if (existingEntry) {
			setSubmissionStatus("Today's entry already exists");
		} else {
			const { data, error } = await supabase
				.from('jackfitness')
				.insert([{ member: username, date: formattedDate, weight: parseFloat(weight) }]);
			if (error) {
				console.error(error);
				setSubmissionStatus('Entry not added');
			} else {
				const { data: memberData, error: memberError } = await supabase
					.from('memberdata')
					.update({ weight: parseFloat(weight) })
					.eq('member', username);
				if (memberError) {
					console.error(memberError);
				}
				setFitnessData([...fitnessData, { member: username, date: formattedDate, weight: parseFloat(weight) }]);
				setSubmissionStatus('Entry added successfully');
				UpdateFitnessData();
				RenderGraph();
				navigate('/progress');
			}
		}
	};

	return (
		<>
			<form id="log-weight-form" className="logform" onSubmit={handleSubmit}>
				<label htmlFor="weight">Weight (kg):</label>
				<input type="number" id="weight" name="weight" value={weight} onChange={(event) => setWeight(event.target.value)} /><br /><br />
			</form>
			<input type="submit" form="log-weight-form" value="Add Entry" className="center button" />
			<p style={{ marginBottom: -5 + 'px' }}>{submissionStatus}</p>
		</>
	);
}

export default LogWeight;