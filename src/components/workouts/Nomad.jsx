import React from 'react';

const Nomad = () => {
	return (
		<div>
			<div className="container">
				<div>
					<p>
						A mobility, strength and cardio-focused workout that requires no equipment whatsoever 
						and can be completed in 15-20min. This routine is your go-to daily workout for 
						conditioning and maintenance. Each movement is selected so that this routine exercises 
						the whole body and provides a good level of cardio in addition to having some attention 
						paid to flexibility. This routine can be safely performed every day, though it's 
						recommended to take 1-2 rest days per week.
					</p>
				</div>
				<div>
					<h3>Warmup</h3>
					<p>Perform each movement for 30 seconds with a 60 second rest after</p>
				</div>
				<div className="col-single">
					<table>
						<tbody>
							<tr>
								<td>Jumping jacks</td>
							</tr>
							<tr>
								<td>Skater jumps</td>
							</tr>
							<tr>
								<td>Tuck jumps</td>
							</tr>
							<tr>
								<td>High knees</td>
							</tr>
							<tr>
								<td>Butt kicks</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div>
					<h3>Conditioning</h3>
					<p>Perform each movement for 45 seconds with no rest<br />Repeat 3 times with 120 second rest between</p>
				</div>
				<div className="col-single">
					<table>
						<tbody>
							<tr>
								<td>Mountain climbers</td>
							</tr>
							<tr>
								<td>Bicycle crunches</td>
							</tr>
							<tr>
								<td>Push-ups</td>
							</tr>
							<tr>
								<td>Cossack squats</td>
							</tr>
							<tr>
								<td>Burpees</td>
							</tr>
							<tr>
								<td>Crab toe-taps</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div>
					<h3>Mobility</h3>
					<p>Perform each movement for at least 30 seconds, resting as needed</p>
				</div>
				<div className="col-single">
					<table>
						<tbody>
							<tr>
								<td>Deep squat</td>
							</tr>
							<tr>
								<td>Downward-facing dog</td>
							</tr>
							<tr>
								<td>Upward-facing dog</td>
							</tr>
							<tr>
								<td>Childs pose</td>
							</tr>
							<tr>
								<td>Forward fold</td>
							</tr>
							<tr>
								<td>Pigeon pose</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Nomad;