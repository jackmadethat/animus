import ProgressBar from 'progressbar.js';

let intervalProgressBar;
let setProgressBar;
let intervalProgress = 0;
let setProgress = 0;

export const createIntervalBar = (time) => {
	intervalProgressBar = 
		new ProgressBar.Circle('#intervalprogress', {
			color: '#ff000da8',
			strokeWidth: 2,
			duration: time * 1000,
			easing: 'linear'
		});
}

export const createSetBar = (time) => {
	setProgressBar = 
		new ProgressBar.Circle('#setprogress', {
			color: '#000000c1',
			strokeWidth: 1.1,
			duration: time * 1000,
			easing: 'linear'
		});
}

export const destroyIntervalBar = () => {
	if (intervalProgressBar) {
		intervalProgressBar.destroy();
		intervalProgressBar = null;
	}
}

export const destroySetBar = () => {
	if (setProgressBar) {
		setProgressBar.destroy();
		setProgressBar = null;
	}
}

export const startInterval = () => {
	intervalProgressBar.animate(1.0);
}

export const startSet = () => {
	setProgressBar.animate(1.0);
}

export const pauseInterval = () => {
	if (intervalProgressBar) {
		intervalProgress = intervalProgressBar.value();
		intervalProgressBar.stop();
	}
}

export const pauseSet = () => {
	if (setProgressBar) {
		setProgress = setProgressBar.value();
		setProgressBar.stop();
	}
}

export const resumeInterval = (time) => {
	if (intervalProgressBar) {
		const remainingProgress = 1 - intervalProgress;
		const remainingDuration = remainingProgress * time * 1000;
		intervalProgressBar.animate(1, {
			from: intervalProgress,
			duration: remainingDuration,
			easing: 'linear'
		});
		intervalProgress = 0;
	}
}

export const resumeSet = (time) => {
	if (setProgressBar) {
		const remainingProgress = 1 - setProgress;
		const remainingDuration = remainingProgress * time * 1000;
		setProgressBar.animate(1, {
			from: setProgress,
			duration: remainingDuration,
			easing: 'linear'
		});
		setProgress = 0;
	}
}