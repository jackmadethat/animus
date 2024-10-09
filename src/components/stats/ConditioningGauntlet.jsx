import React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import LogCondition from './LogCondition';
import supabase from '../supabaseWrapper';
import * as d3 from 'd3';

const ConditioningGauntlet = ({ showLogCondition, setParentShowLogCondition }) => {
	const username = sessionStorage.getItem('username');
	const [fitnessData, setFitnessData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [checkedRows, setCheckedRows] = useState([]);
	const [showLogForm, setShowLogForm] = useState(false);

	const FetchFitnessData = useCallback(async () => {
		const { data, error } = await supabase
			.from('conditioning')
			.select('date, pushups, squats, situps, member, id');
		if (error) console.error(error);
		return data;
	}, []);

	const UpdateFitnessData = async () => {
		const data = await FetchFitnessData();
		data.sort((a, b) => {
			const dateA = new Date(`${a.date.year}-${a.date.month.toString().padStart(2, '0')}-${a.date.day.toString().padStart(2, '0')}`);
			const dateB = new Date(`${b.date.year}-${b.date.month.toString().padStart(2, '0')}-${b.date.day.toString().padStart(2, '0')}`);
			return dateB - dateA;
		});
		setFitnessData(data);
		setLoading(false);
		//console.log("Rendered Conditioning Data");
	};

	const filteredData = useMemo(() => {
		return fitnessData
		.filter((entry) => entry.member === username)
		.sort((a, b) => {
			const dateA = new Date(`${a.date.year}-${a.date.month}-${a.date.day}`);
			const dateB = new Date(`${b.date.year}-${b.date.month}-${b.date.day}`);
			return dateB - dateA; // Sort in descending order
		})
		.reverse()
		.slice(0, 4);
	}, [fitnessData, username]);

	const conditioningGraphRef = useRef(null);

	// Render graph using d3
	// ------------------------------------

	const RenderGraph = () => {
		if (!filteredData.length) return;
		d3.select(conditioningGraphRef.current).select('svg').remove();
		const margin = { top: 20, right: 20, bottom: 50, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 250 - margin.top - margin.bottom;
	
		const svg = d3
			.select(conditioningGraphRef.current)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);
	
		const xScale = d3.scaleBand()
			.domain(filteredData.map((d) => `${d.date.day}/${d.date.month}`))
			.range([0, width])
			.padding(0.2);
	
		const yScale = d3.scaleLinear()
			.domain([0, d3.max(filteredData, (d) => Math.max(d.pushups, d.squats, d.situps)) + 10])
			.range([height, 0]);
	
		const groups = svg
			.selectAll('g.group')
			.data(filteredData)
			.join('g')
			.attr('transform', (d) => `translate(${xScale(`${d.date.day}/${d.date.month}`)}, 0)`);
	
		// X axis values
		svg
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale))
	
		// Y axis values
		svg.append('g')
			.call(d3.axisLeft(yScale));

		// Bars
		groups
			.selectAll('rect')
			.data((d) => [
				{ name: 'Push-Ups', value: d.pushups },
				{ name: 'Squats', value: d.squats },
				{ name: 'Sit-Ups', value: d.situps },
			])
			.join('rect')
			.attr('x', (d, i) => i * (xScale.bandwidth() / 3))
			.attr('y', (d) => yScale(d.value))
			.attr('width', xScale.bandwidth() / 3)
			.attr('height', (d) => height - yScale(d.value))
			.attr('fill', (d, i) => ['#ff00008e', '#ff000050', '#ff00002a'][i]);
	
		// Vertical movement labels
		groups
			.selectAll('text.bar-label')
			.data((d) => [
				{ name: 'Push-Ups', value: d.pushups },
				{ name: 'Squats', value: d.squats },
				{ name: 'Sit-Ups', value: d.situps },
			])
			.join('text')
			.attr('class', 'bar-label')
			.attr('x', (d, i) => i * (xScale.bandwidth() / 3) + (xScale.bandwidth() / 6) + 25)
			.attr('y', (d) => height + 23)
			.style('font-size', '10px')
			.attr('transform', (d, i) => `rotate(-90, ${i * (xScale.bandwidth() / 3) + (xScale.bandwidth() / 6)}, ${height + 20})`)
			.text((d) => d.name)
			.selectAll('text')
  			.style('font-size', '6px');

		// Values on columns
		groups
			.selectAll('text.value-label')
			.data((d) => [
				{ name: 'Push-Ups', value: d.pushups },
				{ name: 'Squats', value: d.squats },
				{ name: 'Sit-Ups', value: d.situps },
			])
			.join('text')
			.attr('class', 'value-label')
			.attr('x', (d, i) => i * (xScale.bandwidth() / 3) + (xScale.bandwidth() / 6) - 7)
			.attr('y', (d) => Math.min(yScale(d.value) - 5, 115))
			.style('font-size', '10px')
			.text((d) => d.value);
	
		return () => {
			d3.select(conditioningGraphRef.current).select('svg').remove();
		};
	};

	// ------------------------------------

	const handleCheckboxChange = (e, entry) => {
		const isChecked = e.target.checked;
		const updatedCheckedRows = isChecked
			? [...checkedRows, entry.id]
			: checkedRows.filter((id) => id !== entry.id);
		setCheckedRows(updatedCheckedRows);
	};

	const handleDelete = async () => {
		try {
			for (const id of checkedRows) {
				const {error} = await supabase
					.from('conditioning')
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

	const toggleForm = () => {
		setShowLogForm(!showLogForm);
		setParentShowLogCondition(!showLogCondition);
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
		<div className="statsContainer" style={{ marginBottom: -20 + 'px', marginTop: -10 + 'px' }}>
			<div className="graphContainer">
				<div ref={conditioningGraphRef} id="conditioning-graph"></div>
			</div>
			<div className="tableContainer">
				<table className="center">
					<thead>
						<tr>
							<th style={{ width: 85 + 'px' }}>Date</th>
							<th>Push-Ups</th>
							<th>Squats</th>
							<th>Sit-Ups</th>
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
									<td>{entry.pushups}</td>
									<td>{entry.squats}</td>
									<td>{entry.situps}</td>
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
			<h3 className="center">Conditioning Gauntlet</h3>
			<p className="tooltip" style={{ marginBottom: 25 + 'px' }}>Perform as many repetitions as possible in a 3min interval for each movement</p>
			<div className="progress-container">

				{loading ? (
					<h4>Loading...</h4>
				) : (
					<>
						{showLogCondition ? (
							<LogCondition UpdateConditionData={UpdateFitnessData} toggleForm={toggleForm} RenderGraph={RenderGraph} />
						) : (
							<>
								{tableContent}
							</>
						)}
						<div className="enterDataButton">
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

export default ConditioningGauntlet;