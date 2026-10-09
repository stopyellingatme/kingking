<script lang="ts">
	import { animate, reducedMotion } from '$lib/motion';

	// Each blob fills with a gradient from the first colour to the second.
	const gradients = [
		['#fbbf24', '#f472b6'],
		['#2dd4bf', '#38bdf8'],
		['#818cf8', '#e879f9']
	];

	const MAX = 24;
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

	let width = $state(0);
	let height = $state(0);
	let blobs = $state<Blob[]>([]);
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
		return animate(step);
	});

	// Fill the canvas when it first has a size.
	$effect(() => {
		if (width > 0 && height > 0 && blobs.length === 0) fill();
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
			blobs = [...blobs.slice(-(MAX - 1)), blob];
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

	<div
		class="sky relative min-h-80 flex-1 overflow-hidden"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		<svg
			class="absolute inset-0 h-full w-full touch-none"
			viewBox="0 0 {width || 1} {height || 1}"
			role="img"
			aria-label="Soft blobs of colour that bounce"
			onpointerdown={down}
			onpointermove={(event) => (pointer = local(event))}
			onpointerup={up}
			onpointercancel={() => (pointer = press = undefined)}
			onpointerleave={() => (pointer = undefined)}
		>
			<defs>
				<!-- Blur the blobs, then make the edges sharp again, so near blobs join like liquid. -->
				<filter id="zeal-goo" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur in="SourceGraphic" stdDeviation="16" />
					<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5" />
				</filter>
				{#each gradients as [from, to], i (i)}
					<radialGradient id="zeal-fill-{i}" cx="35%" cy="30%" r="80%">
						<stop offset="0" stop-color={to} />
						<stop offset="1" stop-color={from} />
					</radialGradient>
				{/each}
			</defs>
			<g filter="url(#zeal-goo)" opacity="0.85">
				{#each blobs as blob (blob.id)}
					<ellipse
						rx={blob.r}
						ry={blob.r}
						fill="url(#zeal-fill-{blob.fill})"
						transform="translate({blob.x} {blob.y}) scale({blob.sx} {blob.sy})"
					/>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.sky {
		background: linear-gradient(
			120deg,
			var(--color-amber-50),
			var(--color-sky-50),
			var(--color-violet-100),
			var(--color-teal-50)
		);
		background-size: 300% 300%;
		animation: gradient 30s ease infinite;
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
</style>
