// True when the visitor asks the system for less motion.
export function reducedMotion(): boolean {
	return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Calls `frame` on each animation frame with the time step and the time, in seconds.
// Returns a function that stops the loop. Use it as the cleanup of an $effect.
export function animate(frame: (dt: number, time: number) => void): () => void {
	let id = 0;
	let last = performance.now();

	const tick = (now: number) => {
		// After a long pause (for example, a hidden tab), do not jump far ahead.
		const dt = Math.min((now - last) / 1000, 1 / 20);
		last = now;
		frame(dt, now / 1000);
		id = requestAnimationFrame(tick);
	};

	id = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(id);
}

// Moves `value` toward `target`. A larger `rate` moves it faster. The result does not depend on the frame rate.
export function approach(value: number, target: number, rate: number, dt: number): number {
	return target + (value - target) * Math.exp(-rate * dt);
}
