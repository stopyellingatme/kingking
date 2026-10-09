<script lang="ts">
	import { createRenderer, MAX_BLOBS, type Fills } from '$lib/goo';
	import { animate, reducedMotion } from '$lib/motion';

	// Each blob fills with a gradient from the edge colour to the light colour.
	const gradients: Fills = [
		['#fbbf24', '#f472b6'],
		['#2dd4bf', '#38bdf8'],
		['#818cf8', '#e879f9']
	];

	const PUSH_RADIUS = 170;

	interface Blob {
		id: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
		r: number;
		// The scale on each axis, and its speed. A spring pulls the scale back to 1, so the blob wobbles.
		sx: number;
		sy: number;
		vsx: number;
		vsy: number;
		fill: number;
		phase: number;
	}

	// The blobs change on each frame. They are not Svelte state, so the page does not update
	// the DOM on each frame. Only the canvas changes.
	let blobs: Blob[] = [];
	let count = $state(0);
	let width = 0;
	let height = 0;
	let canvas: HTMLCanvasElement;
	let gravity = $state(false);
	let nextId = 0;
	let calm = false;
	let pointer: { x: number; y: number } | undefined;
	let press: { x: number; y: number } | undefined;

	function size() {
		return Math.max(0.5, Math.min(width, height) / 700);
	}

	function make(x: number, y: number, pop = false): Blob {
		const r = (45 + Math.random() * 55) * size();
		return {
			id: nextId++,
			x,
			y,
			vx: (Math.random() - 0.5) * 120,
			vy: (Math.random() - 0.5) * 120,
			r,
			sx: pop ? 0.2 : 1,
			sy: pop ? 0.2 : 1,
			vsx: 0,
			vsy: 0,
			fill: Math.floor(Math.random() * gradients.length),
			phase: Math.random() * Math.PI * 2
		};
	}

	function fill() {
		blobs = Array.from({ length: 11 }, () => make(Math.random() * width, Math.random() * height));
		count = blobs.length;
	}

	// Squash the blob along one axis and stretch it along the other.
	function squash(blob: Blob, axis: 'x' | 'y', speed: number) {
		const kick = Math.min(Math.abs(speed) * 0.006, 4);
		if (axis === 'x') {
			blob.vsx -= kick;
			blob.vsy += kick;
		} else {
			blob.vsy -= kick;
			blob.vsx += kick;
		}
	}

	function step(dt: number, time: number) {
		for (const blob of blobs) {
			if (gravity) blob.vy += 900 * dt;
			else if (!calm) {
				// A slow push in a direction that changes over time, so the blobs never stop.
				blob.vx += Math.cos(time * 0.4 + blob.phase) * 40 * dt;
				blob.vy += Math.sin(time * 0.3 + blob.phase * 1.7) * 40 * dt;
			}

			if (pointer) {
				const dx = blob.x - pointer.x;
				const dy = blob.y - pointer.y;
				const d = Math.hypot(dx, dy) || 1;
				const reach = PUSH_RADIUS + blob.r;
				if (d < reach) {
					const force = (1 - d / reach) * 2600 * dt;
					blob.vx += (dx / d) * force;
					blob.vy += (dy / d) * force;
					blob.vsx += (Math.random() - 0.5) * force * 0.004;
					blob.vsy += (Math.random() - 0.5) * force * 0.004;
				}
			}

			// Air slows the blobs. In gravity, they slow less, so they bounce well.
			const drag = Math.exp(-(gravity ? 0.2 : 0.6) * dt);
			blob.vx *= drag;
			blob.vy *= drag;
		}

		// Blobs that overlap too much push each other apart.
		for (let i = 0; i < blobs.length; i++) {
			for (let j = i + 1; j < blobs.length; j++) {
				const a = blobs[i];
				const b = blobs[j];
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const d = Math.hypot(dx, dy) || 1;
				const overlap = (a.r + b.r) * 0.8 - d;
				if (overlap <= 0) continue;
				const push = overlap * 40 * dt;
				a.vx -= (dx / d) * push;
				a.vy -= (dy / d) * push;
				b.vx += (dx / d) * push;
				b.vy += (dy / d) * push;
			}
		}

		for (const blob of blobs) {
			blob.x += blob.vx * dt;
			blob.y += blob.vy * dt;

			const rx = blob.r * blob.sx;
			const ry = blob.r * blob.sy;
			if (blob.x < rx || blob.x > width - rx) {
				blob.x = Math.min(Math.max(blob.x, rx), Math.max(rx, width - rx));
				squash(blob, 'x', blob.vx);
				blob.vx *= -0.8;
			}
			if (blob.y < ry || blob.y > height - ry) {
				blob.y = Math.min(Math.max(blob.y, ry), Math.max(ry, height - ry));
				// A blob that rests on the floor does not shake.
				if (Math.abs(blob.vy) > 40) squash(blob, 'y', blob.vy);
				blob.vy *= -0.8;
			}

			// A spring with little damping, so the blob wobbles like jelly.
			const k = 160;
			const damping = 7;
			const breathe = calm ? 0 : Math.sin(time * 1.3 + blob.phase) * 0.04;
			blob.vsx += (-k * (blob.sx - 1 - breathe) - damping * blob.vsx) * dt;
			blob.vsy += (-k * (blob.sy - 1 + breathe) - damping * blob.vsy) * dt;
			blob.sx = Math.max(0.3, blob.sx + blob.vsx * dt);
			blob.sy = Math.max(0.3, blob.sy + blob.vsy * dt);
		}
	}

	$effect(() => {
		calm = reducedMotion();
		const renderer = createRenderer(canvas, gradients);

		const observer = new ResizeObserver(() => {
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			// A ratio above 1.5 costs more than it adds to soft edges.
			renderer?.resize(width, height, Math.min(devicePixelRatio, 1.5));
			if (blobs.length === 0 && width > 0 && height > 0) fill();
			// A new size clears the canvas. Draw again now, so the canvas does not flash empty.
			renderer?.draw(blobs);
		});
		observer.observe(canvas);

		const stop = animate((dt, time) => {
			step(dt, time);
			renderer?.draw(blobs);
		});

		return () => {
			stop();
			observer.disconnect();
			renderer?.dispose();
		};
	});

	function local(event: PointerEvent) {
		const box = (event.currentTarget as Element).getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	}

	function down(event: PointerEvent) {
		press = local(event);
		pointer = press;
	}

	function up(event: PointerEvent) {
		const point = local(event);
		// A tap adds a blob. A drag only pushes.
		if (press && Math.hypot(point.x - press.x, point.y - press.y) < 8) {
			const blob = make(point.x, point.y, true);
			blob.vx = 0;
			blob.vy = 0;
			blobs = [...blobs.slice(-(MAX_BLOBS - 1)), blob];
			count = blobs.length;
		}
		press = undefined;
		if (event.pointerType !== 'mouse') pointer = undefined;
	}

	function shake() {
		for (const blob of blobs) {
			blob.vx += (Math.random() - 0.5) * 1400;
			blob.vy += (Math.random() - 0.5) * 1400 - (gravity ? 500 : 0);
			blob.vsx += (Math.random() - 0.5) * 6;
			blob.vsy += (Math.random() - 0.5) * 6;
		}
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<button type="button" class="btn" aria-pressed={gravity} onclick={() => (gravity = !gravity)}
			>GRAVITY</button
		>
		<button type="button" class="btn" onclick={shake}>SHAKE</button>
		<button type="button" class="btn" onclick={fill}>RESET</button>
		<span class="opacity-70">Move to push. Tap to add a blob.</span>
	</div>

	<div class="relative min-h-80 flex-1 overflow-hidden">
		<div class="sky absolute -inset-1/2" aria-hidden="true"></div>
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full touch-none"
			aria-label="Soft blobs of colour that bounce"
			data-blobs={count}
			onpointerdown={down}
			onpointermove={(event) => (pointer = local(event))}
			onpointerup={up}
			onpointercancel={() => (pointer = press = undefined)}
			onpointerleave={() => (pointer = undefined)}
		></canvas>
	</div>
</div>

<style>
	/* The gradient layer is twice the size of the canvas and moves with a transform.
	   A transform does not make the browser paint the layer again. */
	.sky {
		background: linear-gradient(
			120deg,
			var(--color-amber-50),
			var(--color-sky-50),
			var(--color-violet-100),
			var(--color-teal-50)
		);
		animation: sky 30s ease-in-out infinite alternate;
	}

	:global(.dark) .sky {
		background-image: linear-gradient(
			120deg,
			var(--color-indigo-950),
			var(--color-black),
			var(--color-teal-950),
			var(--color-black)
		);
	}

	@keyframes sky {
		from {
			transform: translate(-20%, -15%);
		}
		to {
			transform: translate(20%, 15%);
		}
	}
</style>
