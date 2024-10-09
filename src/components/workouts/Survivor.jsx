import React from 'react';

const Survivor = () => {
	return (
		<div>
			<div className="container">
				<div>
					<p>
						A high-intensity, full-body workout with a focus on conditioning and cardio fitness 
						that targets the whole body and can be completed in about 30 minutes. This is an 
						excellent option for working on functional strength, agility, and stamina that is 
						ideal for travelling and being away from home. This routine requires minimal space 
						and provides plenty of self-directed variety to prevent boredom via repetition while 
						still targeting the whole body if movements aren't repeated consecutively.
					</p>
				</div>
				<div>
					<h3>Training</h3>
					<p>Choose 2 movements per group (1 from each column) and alternate for 45 seconds each <br />3 times over. Repeat for each group with a 2 minute rest between<br /><br />Stretch as much as desired once the session is complete</p>
				</div>
				<div style={{ width: 100 + '%' }}>
					<h3>Group 1</h3>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Sit-ups</td>
							</tr>
							<tr>
								<td>Bicycle crunches</td>
							</tr>
							<tr>
								<td>Flutter kicks</td>
							</tr>
							<tr>
								<td>Leg raises</td>
							</tr>
							<tr>
								<td>Mountain climbers</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Lunges</td>
							</tr>
							<tr>
								<td>High knees</td>
							</tr>
							<tr>
								<td>Burpees</td>
							</tr>
							<tr>
								<td>Tuck jumps</td>
							</tr>
							<tr>
								<td>Calf raises</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div style={{ width: 100 + '%' }}>
					<h3>Group 2</h3>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Bodyweight squats</td>
							</tr>
							<tr>
								<td>Cossack squats</td>
							</tr>
							<tr>
								<td>Horse stance</td>
							</tr>
							<tr>
								<td>Plank w/ shoulder taps</td>
							</tr>
							<tr>
								<td>180 Jumps</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Push-ups</td>
							</tr>
							<tr>
								<td>Diamond push-ups</td>
							</tr>
							<tr>
								<td>Pike push-ups</td>
							</tr>
							<tr>
								<td>Downwards to upwards facing dog</td>
							</tr>
							<tr>
								<td>Walking plank</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div style={{ width: 100 + '%' }}>
					<h3>Group 3</h3>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Crab walking</td>
							</tr>
							<tr>
								<td>Bear crawling</td>
							</tr>
							<tr>
								<td>Frog hopping</td>
							</tr>
							<tr>
								<td>Under to overswitch</td>
							</tr>
							<tr>
								<td>Swing set to tabletop</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-half">
					<table>
						<tbody>
							<tr>
								<td>Reverse plank</td>
							</tr>
							<tr>
								<td>Superman</td>
							</tr>
							<tr>
								<td>Wheel pose</td>
							</tr>
							<tr>
								<td>Crab toe taps</td>
							</tr>
							<tr>
								<td>Hip swipe</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Survivor;