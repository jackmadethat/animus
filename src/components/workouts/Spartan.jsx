import React from 'react';

const Spartan = () => {
	return (
		<div>
			<div className="container">
				<div>
					<p>
						A minimalist strength and agility routine designed to be completed in around 15-30 
						minutes. The push-pull-squat structure is formulated to enable progression in key 
						areas, and the core section ensures attention is paid to the abdominals. This 
						routine can be safely performed every day, though it's recommended to take 1-2 rest 
						days per week.
					</p>
				</div>
				<div>
					<h3>Warmup</h3>
					<p>Perform each movement for 30 seconds with no rest in between</p>
				</div>
				<div className="col-single">
					<table>
						<thead>
							<tr>
								<th>Flexibility</th>
								<th>Mobility</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Deep squat</td>
								<td>Leg swings</td>
							</tr>
							<tr>
								<td>Downward-facing dog</td>
								<td>Arm circles</td>
							</tr>
							<tr>
								<td>Prone belly twist</td>
								<td>High knees</td>
							</tr>
							<tr>
								<td>Wide stance hinge</td>
								<td>Skater jumps</td>
							</tr>
							<tr>
								<td>Standing knee hug</td>
								<td>Tuck jumps</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div>
					<h3>Strength Conditioning</h3>
					<p><br />Choose 1 movement from each column and alternate 3 sets of 5-12 reps or 3x45sec intervals<br />60sec rest between sets/intervals<br />Optional: Repeat cycle with a different movement from each column as desired.</p>
				</div>
				<div className="col-third">
					<table>
						<thead>
							<tr>
								<th>Push</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Knee push-up</td>
							</tr>
							<tr>
								<td>Push-up</td>
							</tr>
							<tr>
								<td>Diamond push-up</td>
							</tr>
							<tr>
								<td>Pike push-up</td>
							</tr>
							<tr>
								<td>Archer push-up (L+R)</td>
							</tr>
							<tr>
								<td>One arm push-up (L+R)</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-third">
					<table>
						<thead>
							<tr>
								<th>Pull</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Row (bar/band)</td>
							</tr>
							<tr>
								<td>Pull-down (band)</td>
							</tr>
							<tr>
								<td>Bicep curl (bar/band)</td>
							</tr>
							<tr>
								<td>Negative pull-up</td>
							</tr>
							<tr>
								<td>Chin-up</td>
							</tr>
							<tr>
								<td>Pull-up</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-third">
					<table>
						<thead>
							<tr>
								<th>Squat</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Bodyweight squat</td>
							</tr>
							<tr>
								<td>Box step-up</td>
							</tr>
							<tr>
								<td>Fwd/back lunge (L+R)</td>
							</tr>
							<tr>
								<td>Cossack squat</td>
							</tr>
							<tr>
								<td>Jump squat</td>
							</tr>
							<tr>
								<td>Pistol squat (L+R)</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div>
					<h3>Core Work</h3>
					<p>Select a movement and perform for a minimum of 45 seconds.</p>
				</div>
				<div className="col-single">
					<table>
						<tbody>
							<tr>
								<td>Elbow plank</td>
							</tr>
							<tr>
								<td>Side plank (L+R)</td>
							</tr>
							<tr>
								<td>Leg raises</td>
							</tr>
							<tr>
								<td>Mountain climbers</td>
							</tr>
							<tr>
								<td>Hollow body hold</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Spartan;