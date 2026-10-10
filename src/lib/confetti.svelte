<script lang="ts">
	import { hslToRgb, toHex, turnHue } from '$lib/colour';
	import { animate, approach, reducedMotion } from '$lib/motion';

	// The confetti illusion, after David Novick. All the balls have one colour. On the left,
	// stripes of the first colour cross the balls. On the right, stripes of the second colour
	// cross them. The eye mixes each ball with its stripes, so the two sides look different.

	const sets = [
		{ name: 'POP', a: '#ff2d55', b: '#00b7ff', ball: '#e6d36a' },
		{ name: 'CITRUS', a: '#ffd60a', b: '#8a2be2', ball: '#ff8c69' },
		{ name: 'MINT', a: '#00e0a0', b: '#ff4fd8', ball: '#b9b9b9' }
	];

	interface Ball {
		x: number;
		y: number;
		r: number;
		phase: number;
		// How much the ball floats, from 0 to 1. A held ball does not float.
		float: number;
		// Where the ball goes after SWAP.
		target?: number;
	}

	let balls: Ball[] = $state([]);
	let width = $state(0);
	let height = $state(0);
	let set = $state(0);
	let colours = $state({ ...sets[0] });
	let stripe = $state(4);
	let reveal = $state(false);
	let cycle = $state(true);
	let turn = $state(0);
	let time = $state(0);
	let held: Ball | undefined;
	let grip = { x: 0, y: 0 };

	const a = $derived(turnHue(colours.a, turn));
	const b = $derived(turnHue(colours.b, turn));
	const ball = $derived(turnHue(colours.ball, turn));

	function scatter() {
		const scale = Math.max(0.6, Math.min(1.4, Math.min(width, height) / 600));
		const count = Math.max(8, Math.min(30, Math.round((width * height) / 30000)));
		const next: Ball[] = [];
		for (let tries = 0; next.length < count && tries < 2000; tries++) {
			const r = (22 + Math.random() * 22) * scale;
			// Put half of the balls on each side.
			const left = next.length % 2 === 0;
			const x = (left ? r : width / 2 + r) + Math.random() * (width / 2 - 2 * r);
			const y = r + Math.random() * (height - 2 * r);
			if (next.some((other) => Math.hypot(other.x - x, other.y - y) < other.r + r + 6)) continue;
			next.push({ x, y, r, phase: Math.random() * Math.PI * 2, float: 1 });
		}
		balls = next;
	}

	function side(item: Ball) {
		return item.x < width / 2 ? 'a' : 'b';
	}

	// The small, slow movement that each ball adds to its position.
	function offset(item: Ball) {
		return {
			x: Math.sin(time * 0.6 + item.phase) * 5 * item.float,
			y: Math.cos(time * 0.5 + item.phase * 1.3) * 7 * item.float
		};
	}

	$effect(() => {
		if (reducedMotion()) cycle = false;
		const calm = reducedMotion();

		return animate((dt) => {
			if (!calm) time += dt;
			if (cycle) turn = (turn + dt * 12) % 360;
			for (const item of balls) {
				item.float = approach(item.float, item === held ? 0 : 1, 6, dt);
				if (item.target === undefined) continue;
				item.x = approach(item.x, item.target, 4, dt);
				if (Math.abs(item.x - item.target) < 0.5) {
					item.x = item.target;
					item.target = undefined;
				}
			}
		});
	});

	// Make the balls when the size is first known. Later, move them with the size.
	let known = { width: 0, height: 0 };
	$effect(() => {
		if (width === 0 || height === 0) return;
		if (balls.length === 0) scatter();
		else if (known.width && known.height) {
			for (const item of balls) {
				item.x *= width / known.width;
				item.y *= height / known.height;
				item.target = undefined;
			}
		}
		known = { width, height };
	});

	function local(event: PointerEvent) {
		const box = (event.currentTarget as Element).getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	}

	function down(event: PointerEvent) {
		const point = local(event);
		// The ball on top is the last one drawn.
		const hit = balls.findLast((item) => {
			const shift = offset(item);
			return Math.hypot(item.x + shift.x - point.x, item.y + shift.y - point.y) <= item.r;
		});
		if (!hit) return;
		const shift = offset(hit);
		hit.x += shift.x;
		hit.y += shift.y;
		hit.float = 0;
		hit.target = undefined;
		held = hit;
		grip = { x: point.x - hit.x, y: point.y - hit.y };
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
	}

	function move(event: PointerEvent) {
		if (!held) return;
		const point = local(event);
		held.x = Math.min(Math.max(point.x - grip.x, held.r), width - held.r);
		held.y = Math.min(Math.max(point.y - grip.y, held.r), height - held.r);
	}

	function swap() {
		for (const item of balls) item.target = width - item.x;
	}

	function shuffle() {
		const hue = Math.random() * 360;
		const tone = (h: number, s: number, l: number) => toHex(hslToRgb(h % 360, s, l));
		colours = {
			name: 'SHUFFLE',
			a: tone(hue, 1, 0.55),
			b: tone(hue + 150 + Math.random() * 60, 1, 0.5),
			ball: tone(hue + 60 + Math.random() * 240, 0.35 + Math.random() * 0.4, 0.65)
		};
		set = -1;
		turn = 0;
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<div class="flex flex-wrap gap-2" role="group" aria-label="Colours">
			{#each sets as item, i (item.name)}
				<button
					type="button"
					class="btn"
					aria-pressed={set === i}
					onclick={() => {
						set = i;
						colours = { ...item };
						turn = 0;
					}}>{item.name}</button
				>
			{/each}
			<button type="button" class="btn" aria-pressed={set === -1} onclick={shuffle}>SHUFFLE</button>
		</div>
		<label class="flex items-center gap-2">
			STRIPES
			<input type="range" min="2" max="12" step="1" bind:value={stripe} class="w-24" />
		</label>
		<button type="button" class="btn" aria-pressed={cycle} onclick={() => (cycle = !cycle)}
			>CYCLE</button
		>
		<button type="button" class="btn" onclick={swap}>SWAP</button>
		<button type="button" class="btn" aria-pressed={reveal} onclick={() => (reveal = !reveal)}
			>REVEAL</button
		>
		<span class="opacity-70">All balls are one colour. Drag one across the middle.</span>
	</div>

	<div
		class="relative min-h-80 flex-1 touch-none overflow-hidden"
		role="presentation"
		bind:clientWidth={width}
		bind:clientHeight={height}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (held = undefined)}
		onpointercancel={() => (held = undefined)}
	>
		<svg
			class="absolute inset-0 h-full w-full"
			viewBox="0 0 {width || 1} {height || 1}"
			role="img"
			aria-label="Balls of one colour behind coloured stripes"
		>
			<defs>
				<pattern id="confetti-a" width="10" height={stripe * 2} patternUnits="userSpaceOnUse">
					<rect width="10" height={stripe} fill={a} shape-rendering="crispEdges" />
				</pattern>
				<pattern id="confetti-b" width="10" height={stripe * 2} patternUnits="userSpaceOnUse">
					<rect y={stripe} width="10" height={stripe} fill={b} shape-rendering="crispEdges" />
				</pattern>
			</defs>
			<rect {width} {height} fill="url(#confetti-a)" />
			<rect {width} {height} fill="url(#confetti-b)" />
			{#each balls as item, i (i)}
				{@const shift = offset(item)}
				<g class="ball" data-side={side(item)}>
					<circle cx={item.x + shift.x} cy={item.y + shift.y} r={item.r} fill={ball} />
					<circle
						class="stripes"
						cx={item.x + shift.x}
						cy={item.y + shift.y}
						r={item.r}
						fill="url(#confetti-{side(item)})"
						style="opacity: {reveal ? 0 : 1}"
					/>
				</g>
			{/each}
		</svg>
	</div>
</div>

<style>
	.stripes {
		transition: opacity 600ms ease;
	}
</style>
