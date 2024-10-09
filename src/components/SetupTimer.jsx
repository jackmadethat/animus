import React from 'react';

const SetupTimer = ({
	intervalTime,
	setIntervalTime,
	restTime,
	setRestTime,
	totalCycles,
	setTotalCycles,
	onClose,
}) => {
		
	const handleSubmit = (event) => {
		event.preventDefault();
		onClose();
	};

	return (
		<div className="setuptimer-container">
			<h3>Setup Timer</h3>
			<form id="setupTimer" onSubmit={handleSubmit}>
				<label>Interval Time (sec):</label><input type="number" value={intervalTime} onChange={(event) => setIntervalTime(event.target.valueAsNumber)} />
				<label>Rest Time (sec):</label><input type="number" value={restTime} onChange={(event) => setRestTime(event.target.valueAsNumber)} />
				<label>Total Intervals:</label><input type="number" value={totalCycles} onChange={(event) => setTotalCycles(event.target.valueAsNumber)} />
			</form>
			<div>
				<button type="submit" form="setupTimer" style={{ width: 200 + 'px' }}>Save</button>
				<button type="button" onClick={onClose} style={{ width: 200 + 'px' }}>Cancel</button>
			</div>
		</div>
	);
}

export default SetupTimer;