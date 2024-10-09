import React, { useState, useEffect } from 'react';
import supabase from './supabaseWrapper';

// Enter desired body weight (BW) in kg
// Convert to pounds: BW * 2.20462
// BW in lbs * 10 = approx caloric requirement
// Example for BW = 100kg: (100 * 2.20462) * 10 = 2204 calories

// AGGRESSIVE SHRED
// Protein: 1g/lb of BW (35%)
// Carbs: 0.4g/lb of BW (15%)
// Fats: 0.65g/lb of BW (50%)
// Example for BW = 100kg: (220 * 4) + (88 * 4) + (143 * 9) = 2519 calories

// BALANCED
// Protein: 1g/lb of BW (40%)
// Carbs: 0.8g/lb of BW (35%)
// Fats: 0.3g/lb of BW (25%)
// Example for BW = 100kg: (220 * 4) + (176 * 4) + (66 * 9) = 2178 calories

// 1g Protein = 4 Calories
// 1g Carbs = 4 Calories
// 1g Fats = 9 Calories

// Calculate caloric intake
// Protein * 4 + Carbs * 4 + Fats * 9 = Adjusted calorie requirement

const Nutrition = () => {
	const [memberData, setMemberData] = useState({});
	const username = sessionStorage.getItem('username');
	const [weight, setWeight] = useState('');
	const [weightInPounds, setWeightInPounds] = useState(0);
	const [weightInKg, setWeightInKg] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const fetchMemberData = async () => {
		const { data, error } = await supabase
			.from('memberdata')
			.select('weight')
			.eq('member', username);
		if (error) {
			console.error(error);
		} else {
			setMemberData(data[0]);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchMemberData();
	}, [username]);

	const calculateNutrition = () => {
		setWeightInPounds(Math.round(memberData.weight * 2.20462));
	}

	useEffect(() => {
		if (memberData && memberData.weight) {
		  	calculateNutrition();
			setIsLoading(false);
		}
	}, [memberData]);

	const handleSubmit = (event) => {
		event.preventDefault();
		const weightInKg = parseFloat(weight);
		const weightInPounds = weightInKg * 2.20462;
		setWeightInPounds(weightInPounds);
		setWeightInKg(weightInKg);
		setWeight('');
	};

	return (
		<div className="nutrition-container">
			<h3>Nutrition</h3>
			{isLoading ? (
				<h4>Loading...</h4>
			) : (
				<>
					<div className="dataDiv">
						<p className="leftSide">Weight:</p><p className="rightSide">{memberData.weight}kg</p>
						<p className="leftSide">Weight in Pounds:</p><p className="rightSide">~{Math.round(memberData.weight * 2.20462)}</p>
						<p className="leftSide">BMR (approx):</p><p className="rightSide">{Math.round(memberData.weight * 2.20462 * 10)} calories</p>
					</div>
					<form id="set-desired-weight" onSubmit={handleSubmit}>
						<label htmlFor="weight" style={{ fontSize: 0.8 + 'em', marginRight: 15 + 'px' }}>Set Desired Weight (kg):</label>
						<input type="number" id="weight" name="weight" value={weight} onChange={(event) => setWeight(event.target.value)} style={{ padding: 10 + 'px', width: 85 + 'px' }} />
						<input type="submit" form="set-desired-weight" value="Set" className="button" style={{ width: 50 + 'px', marginLeft: 20 + 'px', marginBottom: 15 + 'px' }} /><br />
					</form>
					<p>Desired Weight: {weightInKg === 0 ? ("Not Set") : (weightInKg + "kg")}</p>
					<div className="nutrition-plans">
						<p className="shred" style={{ marginBottom: 30 + 'px' }}>
							<b style={{ fontSize: 1.5 + 'em' }}>AGGRESSIVE SHRED</b><br /><br />
							Protein: 1g/lb of BW (35%) = {Math.round(weightInPounds)}g<br />
							Carbs: 0.4g/lb of BW (15%) = {Math.round(weightInPounds * 0.4)}g<br />
							Fats: 0.65g/lb of BW (50%) = {Math.round(weightInPounds * 0.65)}g<br />
							<p style={{ fontSize: 1 + 'em' }}>Total Calories per Day: <b>{Math.round(weightInPounds * 4 + (weightInPounds * 0.4 * 4) + (weightInPounds * 0.65 * 9))}</b></p>
						</p>
						<p className="balance">
							<b style={{ fontSize: 1.5 + 'em' }}>BALANCED INTAKE</b><br /><br />
							Protein: 1g/lb of BW (40%) = {Math.round(weightInPounds)}g<br />
							Carbs: 0.8g/lb of BW (35%) = {Math.round(weightInPounds * 0.8)}g<br />
							Fats: 0.3g/lb of BW (25%) = {Math.round(weightInPounds * 0.3)}g<br />
							<p style={{ fontSize: 1 + 'em' }}>Total Calories per Day: <b>{Math.round(weightInPounds * 4 + (weightInPounds * 0.8 * 4) + (weightInPounds * 0.3 * 9))}</b></p>
						</p>
					</div>
				</>
			)}
		</div>
	);
}

export default Nutrition;