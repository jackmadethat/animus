import React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import LogWeight from './LogWeight';
import supabase from '../supabaseWrapper';
import * as d3 from 'd3';

const WeightLoss = ({ showLogWeight, setParentShowLogWeight }) => {
	const username = sessionStorage.getItem('username');
	const [fitnessData, setFitnessData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showLogWeightForm, setShowLogWeightForm] = useState(false);
	const [error, setError] = useState(null);
	const [checkedRows, setCheckedRows] = useState([]);

	const FetchFitnessData = useCallback(async () => {
		const { data, error } = await supabase
			  .from('jackfitness')
			  .select('date, weight, member, id');
		if (error) console.error(error);
		return data;
	}, []);

	const UpdateFitnessData = async () => {
		const data = await FetchFitnessData();
		data.sort((a, b) => {
			const dateA = new Date(`${a.date.year}-${a.date.month.toString().padStart(2, '0')}-${a.date.day.toString().padStart(2, '0')}`);
			const dateB = new Date(`${b.date.year}-${b.date.month.toString().padStart(2, '0')}-${b.date.day.toString().padStart(2, '0')}`);
			return dateA - dateB;
		});
		setFitnessData(data);
		setLoading(false);
		//console.log("Rendered Weight Loss Data");
	};

	const filteredData = useMemo(() => {
		return fitnessData
			.filter((entry) => entry.member === username)
			.slice().reverse()
			.map((entry) => ({
				date: `${entry.date.day}/${entry.date.month}`,
				weight: entry.weight.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
			}))
			.sort((a, b) => new Date(`${a.date.year}-${a.date.month}-${a.date.day}`) - new Date(`${b.date.year}-${b.date.month}-${b.date.day}`))
			.slice(0, 6);	
	}, [fitnessData, username]);

	const weightlossGraphRef = useRef(null);

	// Render graph using d3
	// ------------------------------------

	const RenderGraph = () => {
		if (!filteredData.length) return;
		d3.select(weightlossGraphRef.current).select('svg').remove();
		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 250 - margin.top - margin.bottom;

		const svg = d3
			.select(weightlossGraphRef.current)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const xScale = d3.scaleBand()
			.domain([...filteredData].reverse().map((d) => d.date))
			.range([0, width])
			.padding(0.2);

			const yScale = d3.scaleLinear()
			.domain([
			  	d3.min(filteredData, (d) => +d.weight) - 5, 
			  	d3.max(filteredData, (d) => +d.weight) + 5
			])
			.range([height, 0]);

		// Bars
		svg
			.selectAll('rect')
			.data(filteredData)
			.join('rect')
			.attr('x', (d) => xScale(d.date))
			.attr('y', (d) => yScale(d.weight))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => height - yScale(d.weight))
			.attr('fill', '#ff00008e');

		// X axis values
		svg
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale))
			.selectAll('text')
  			.style('font-size', '8px');
		
		// Y axis values
		svg.append('g')
			.call(d3.axisLeft(yScale))
			.selectAll('text')
  			.style('font-size', '8px');

		// Weight labels on columns
		svg
			.selectAll('text.weight-label')
			.data(filteredData)
			.join('text')
			.attr('class', 'weight-label')
			.attr('x', (d) => xScale(d.date) + xScale.bandwidth() / 2 - 22)
			.attr('y', (d) => yScale(d.weight) - 5)
			.style('font-size', '10px')
			.text((d) => `${d.weight}kg`);

		return () => {
			d3.select(weightlossGraphRef.current).select('svg').remove();
		};
	};

	// ------------------------------------

	const toggleForm = () => {
		setShowLogWeightForm(!showLogWeightForm);
		setParentShowLogWeight(!showLogWeightForm);
	};
	
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
				const { data, error } = await supabase
					.from('jackfitness')
					.delete()
					.eq('id', id);
				if (error) {
					throw error;
				}
			}

			// Retrieve all weights for the member
			const { data: weights, error: weightsError } = await supabase
				.from('jackfitness')
				.select('weight, date')
				.eq('member', sessionStorage.getItem('username'));
	
			if (weightsError) {
				throw weightsError;
			}

			const filteredWeights = weights.filter((entry) => !checkedRows.includes(entry.id));
	
			// Update 'weight' in 'memberdata' only if filteredWeights is not empty
			if (filteredWeights.length > 0) {
				// Find the most recent weight
				const mostRecentWeight = filteredWeights.reduce((mostRecent, current) => {
					const mostRecentDate = new Date(mostRecent.date.year, mostRecent.date.month - 1, mostRecent.date.day);
					const currentDate = new Date(current.date.year, current.date.month - 1, current.date.day);
					return currentDate > mostRecentDate ? current : mostRecent;
				}, filteredWeights[0]);
	
	
				// Update the 'weight' field in 'memberdata'
				const { error: updateError } = await supabase
					.from('memberdata')
					.update({ weight: mostRecentWeight.weight })
					.eq('member', sessionStorage.getItem('username'));
	
				if (updateError) {
					throw updateError;
				}
			} else {
				// If all weights are deleted, update 'weight' to null
				const { error: updateError } = await supabase
					.from('memberdata')
					.update({ weight: null })
					.eq('member', sessionStorage.getItem('username'));
	
				if (updateError) {
					throw updateError;
				}
			}
			UpdateFitnessData();
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
		if (!loading && fitnessData.length > 0 && !showLogWeightForm) {
		  	RenderGraph();
		}
	}, [loading, fitnessData, showLogWeightForm]);

	const hasData = fitnessData.filter((entry) => entry.member === username).length > 0;
	const tableContent = hasData ? (
		<div className="statsContainer">
			<div className="graphContainer">
				<div ref={weightlossGraphRef} id="weightloss-graph"></div>
			</div>
			<div className="tableContainer">
				<table className="center">
					<thead>
						<tr>
							<th style={{ width: 85 + 'px' }}>Date</th>
							<th>Weight</th>
							<th style={{ width: 60 + 'px' }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{fitnessData
							.filter((entry) => entry.member === username)
							.reverse()
							.slice(0, 5)
							.map((entry) => (
								<tr key={entry.id}>
									<td style={{ fontSize: 0.8 + 'em' }}>{entry.date.day}/{entry.date.month}/{entry.date.year % 100}</td>
									<td>{entry.weight} kg</td>
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
			<h3 className="center">Weight Tracking</h3>
			<p className="tooltip">Weigh-in at regular intervals using the same scales at the same time of day</p>
			<div className="progress-container">

				{loading ? (
					<h4>Loading...</h4>
				) : (
					<>
						{showLogWeight ? (
							<LogWeight UpdateFitnessData={UpdateFitnessData} RenderGraph={RenderGraph} />
						) : (
							<>
								{tableContent}
							</>
						)}
						<div className="enterDataButton">
							{showLogWeightForm ? (
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

export default WeightLoss;