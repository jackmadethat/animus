import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import LogStamina from './LogStamina';
import supabase from '../supabaseWrapper';
import * as d3 from 'd3';

const FetchFitnessData = async () => {
	const { data, error } = await supabase
	  	.from('stamina')
	  	.select('date, distance, hours, minutes, seconds, member, id');
	if (error) console.error(error);
	return data;
};

const Stamina = ({ showLogStamina, setParentShowLogStamina }) => {
	const username = sessionStorage.getItem('username');
	const [showLogForm, setShowLogForm] = useState(false);
	const [fitnessData, setFitnessData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [checkedRows, setCheckedRows] = useState([]);

	const UpdateFitnessData = async () => {
		const data = await FetchFitnessData();
		data.sort((a, b) => {
			const dateA = new Date(`${a.date.year}-${a.date.month.toString().padStart(2, '0')}-${a.date.day.toString().padStart(2, '0')}`);
			const dateB = new Date(`${b.date.year}-${b.date.month.toString().padStart(2, '0')}-${b.date.day.toString().padStart(2, '0')}`);
			return dateB - dateA;
		});
		setFitnessData(data);
		setLoading(false);
		//console.log("Rendered Stamina Data");
	};

	const filteredData = useMemo(() => {
		return fitnessData
		.filter((entry) => entry.member === username)
		.sort((a, b) => new Date(`${a.date.year}-${a.date.month}-${a.date.day}`) - new Date(`${b.date.year}-${b.date.month}-${b.date.day}`))
		.slice(0, 6);
	}, [fitnessData, username]);

	const staminaGraphRef = useRef(null);

	// Render graph using d3
	// ------------------------------------

	const RenderGraph = () => {
		if (!filteredData.length) return;
		d3.select(staminaGraphRef.current).select('svg').remove();
		const margin = { top: 20, right: 20, bottom: 50, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;
		const minTime = d3.min(filteredData, (d) => calculateSeconds(d.hours, d.minutes, d.seconds)) - 300;
		const maxTime = d3.max(filteredData, (d) => calculateSeconds(d.hours, d.minutes, d.seconds)) + 60;
	
		// Bars
		const svg = d3
			.select(staminaGraphRef.current)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.attr('fill', '#ff00008e');
	
		
		const xScale = d3.scaleBand()
			.domain(filteredData.map((d) => `${d.date.day}/${d.date.month}`))
			.range([0, width])
			.padding(0.2);
	
		const yScale = d3.scaleLinear()
			.domain([minTime, maxTime])
			.range([height, 0]);
	
		// X axis values
		svg
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale));
	
		// Y axis values
		svg
			.append('g')
			.call(d3.axisLeft(yScale)
				.tickFormat((d) => {
					const hours = Math.floor(d / 3600);
					const minutes = Math.floor((d % 3600) / 60);
					const seconds = d % 60;
					return `${hours}:${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
				})
			);

		// Bars
		svg.selectAll('rect')
			.data(filteredData)
			.join('rect')
			.attr('x', (d) => xScale(`${d.date.day}/${d.date.month}`))
			.attr('y', (d) => yScale(calculateSeconds(d.hours, d.minutes, d.seconds)))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => height - yScale(calculateSeconds(d.hours, d.minutes, d.seconds)));

		// Distance labels on columns
		svg
			.selectAll('text.distance-label')
			.data(filteredData)
			.join('text')
			.attr('class', 'distance-label')
			.attr('x', (d) => xScale(`${d.date.day}/${d.date.month}`) + xScale.bandwidth() / 2)
			.attr('y', (d) => Math.min(yScale(calculateSeconds(d.hours, d.minutes, d.seconds)) - 5, 155))
			.attr('text-anchor', 'middle')
			.style('fill', 'black')
			.style('font-size', '11px')
			.text((d) => `${d.distance}km`);

		// Vertical pace labels
		svg
			.selectAll('text.pace-label')
			.data(filteredData)
			.join('text')
			.attr('class', 'pace-label')
			.attr('x', (d) => xScale(`${d.date.day}/${d.date.month}`) + xScale.bandwidth() / 2 + 73)
			.attr('y', height + 43)
			.attr('text-anchor', 'middle')
			.attr('transform', (d) => `rotate(-90, ${xScale(`${d.date.day}/${d.date.month}`) + xScale.bandwidth() / 2}, ${height + 40})`)
			.style('fill', 'black')
			.style('font-size', '10px')
			.text((d) => `${calculatePace(d.distance, d.hours, d.minutes, d.seconds)} km/h`);
	
		function calculateSeconds(hours, minutes, seconds) {
			return hours * 3600 + minutes * 60 + seconds;
		}
	
		return () => {
			d3.select(staminaGraphRef.current).select('svg').remove();
		};
	};

	// ------------------------------------

	const toggleForm = () => {
		setShowLogForm(!showLogForm);
		setParentShowLogStamina(!showLogForm);
	}

	const calculatePace = (distance, hours, minutes, seconds) => {
		const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
		const paceInSecondsPerKm = totalTimeInSeconds / distance;
		const paceKmPerHour = 3600 / paceInSecondsPerKm;
		return paceKmPerHour.toFixed(2);
	};

	const handleCheckboxChange = (e, entry) => {
		const isChecked = e.target.checked;
		const updatedCheckedRows = isChecked ? [...checkedRows, entry.id] : checkedRows.filter((id) => id !== entry.id);
		setCheckedRows(updatedCheckedRows);
	};

	const handleDelete = async () => {
		if (checkedRows.length === 0) {
			setError('No rows selected');
			setTimeout(() => {
				setError(null);
			}, 5000);
			return;
		}
		try {
			for (const id of checkedRows) {
				const {error} = await supabase
					.from('stamina')
					.delete()
					.eq('id', id);
				if (error) {
					throw error;
				}
			}
			const data = await FetchFitnessData();
			setFitnessData(data);
			setCheckedRows([]);
		} catch (error) {
			setError(error.message);
			setTimeout(() => {
				setError(null);
			}, 5000);
		}
	};

	useEffect(() => {
		UpdateFitnessData();
	}, [username]);

	useEffect(() => {
		if (!loading && fitnessData.length > 0 && !showLogForm) {
		  	RenderGraph();
		}
	}, [loading, fitnessData, showLogForm]);

	const hasData = fitnessData.filter((entry) => entry.member === username).length > 0;
	const tableContent = hasData ? (
		<div className="statsContainer" style={{ marginBottom: -20 + 'px' }}>
			<div className="graphContainer">
				<div ref={staminaGraphRef} id="stamina-graph"></div>
			</div>
			<div className="tableContainer">
				<table className="center">
					<thead>
						<tr>
							<th style={{ width: 85 + 'px' }}>Date</th>
							<th style={{ width: 77 + 'px' }}>Distance (km)</th>
							<th>Time</th>
							<th style={{ width: 77 + 'px' }}>Pace<br /> (km/h)</th>
							<th style={{ width: 60 + 'px' }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{fitnessData
							.filter((entry) => entry.member === username)
							.slice(0, 5)
							.map((entry) => (
								<tr key={entry.id}>
									<td style={{ fontSize: 0.8 + 'em' }}>{entry.date.day}/{entry.date.month}/{entry.date.year % 100}</td>
									<td>{entry.distance}</td>
									<td>{entry.hours}:{entry.minutes.toString().padStart(2, '0')}.{entry.seconds.toString().padStart(2, '0')}</td>
									<td>{calculatePace(entry.distance, entry.hours, entry.minutes, entry.seconds)}</td>
									<td><input type="checkbox" checked={checkedRows.includes(entry.id)} onChange={(e) => handleCheckboxChange(e, entry)} /></td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	) : (
		<p>No data found for this member.</p>
	);
	
	return (
		<>
			<h3 className="center">Stamina Drills</h3>
			<p className="tooltip" style={{ marginBottom: 15 + 'px' }}>Run regularly, aim to increase pace to around 14km/h over 30min</p>
			<div className="progress-container">
				{loading ? (
					<h4>Loading...</h4>
				) : (
					<>
						{showLogForm ? (
							<LogStamina onCancel={toggleForm} UpdateStaminaData={UpdateFitnessData} RenderGraph={RenderGraph} />
						) : (
							<>
								{tableContent}
							</>
						)}
						<div className="enterDataButton staminaButtons">
							{showLogForm ? (
								<button type="button" onClick={toggleForm} className="center" style={{ marginTop: 15 + 'px' }}>Back</button>
							) : (
								<>
									<button type="button" onClick={toggleForm} className="center" style={{ marginTop: 15 + 'px' }}>Enter Data</button>
									<button type="button" onClick={handleDelete} style={{ width: 100 + '%' }}>Delete Selected</button>
								</>
							)}
						</div>
						{error && <p style={{ color: 'red' }}>{error}</p>}
					</>
				)}
			</div>
		</>
	);
}

export default Stamina;