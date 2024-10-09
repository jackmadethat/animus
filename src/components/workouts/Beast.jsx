import React from 'react';

const Beast = () => {
	return (
		<div>
			<div className="container">
				<div>
					<p>
						A simplistic mobility, flexibility and cardio-oriented workout with a strong emphasis on 
						ground-based, animal-style locomotion patterns. The training is broken down into three 
						phases to introduce structure and limitation, which assists in the development of focus,
						creativity, adaptability, and proprioception. Rather than repeating each movement in
						sequence, focus on the transitions between movements and different movement combinations.
					</p>
				</div>
				<div>
					<h3>Warmup</h3>
					<p>Perform each movement for 30-45 seconds with no rest</p>
				</div>
				<div className="col-single">
					<table>
						<tbody>
							<tr>
								<td>Wrist circles</td>
							</tr>
							<tr>
								<td>Kneeling wrist extension</td>
							</tr>
							<tr>
								<td>Child pose to upward-facing dog</td>
							</tr>
							<tr>
								<td>Deep squat to 3-point-bridge (L+R)</td>
							</tr>
							<tr>
								<td>Downward-facing dog to low lunge (L+R)</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="container">
				<div style={{ marginBottom: -20 + 'px' }}>
					<h3>Training</h3>
					<p>Spend 5 minutes per phase transitioning between the movements, resting as necessary</p>
				</div>
				<div className="col-third">
					<h3>Phase 1</h3>
					<table>
						<tbody>
							<tr>
								<td>Frog-hopping</td>
							</tr>
							<tr>
								<td>Monkey-hopping</td>
							</tr>
							<tr>
								<td>Snakedown</td>
							</tr>
							<tr>
								<td>Duck walking</td>
							</tr>
							<tr>
								<td>Coffee grinder</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-third">
					<h3>Phase 2</h3>
					<table>
						<tbody>
							<tr>
								<td>Hip swipe</td>
							</tr>
							<tr>
								<td>Cartwheel</td>
							</tr>
							<tr>
								<td>Macaco</td>
							</tr>
							<tr>
								<td>Butterfly kick</td>
							</tr>
							<tr>
								<td>Spin jumps</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-third">
					<h3>Phase 3</h3>
					<table>
						<tbody>
							<tr>
								<td>Crab walk</td>
							</tr>
							<tr>
								<td>Bear crawl</td>
							</tr>
							<tr>
								<td>Under/overswitch</td>
							</tr>
							<tr>
								<td>Forward/backward rolls</td>
							</tr>
							<tr>
								<td>Side rolls</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Beast;