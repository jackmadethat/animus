import React from 'react';
import { useState } from 'react';
import WeightLoss from './stats/WeightLoss';
import ConditioningGauntlet from './stats/ConditioningGauntlet';
import Stamina from './stats/Stamina';

const Progress = () => {
	const [showLogWeight, setShowLogWeight] = useState(false);
	const [showLogCondition, setShowLogCondition] = useState(false);
	const [showLogStamina, setShowLogStamina] = useState(false);

	return (
		<>
			{!showLogStamina && !showLogCondition && (
				<WeightLoss showLogWeight={showLogWeight} setParentShowLogWeight={setShowLogWeight} />
			)}
			{!showLogStamina && !showLogWeight && (
				<ConditioningGauntlet showLogCondition={showLogCondition} setParentShowLogCondition={setShowLogCondition} />
			)}
			{!showLogWeight && !showLogCondition && (
				<Stamina showLogStamina={showLogStamina} setParentShowLogStamina={setShowLogStamina} />
			)}
		</>
	);
}

export default Progress;