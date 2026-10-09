<script lang="ts">
	import { animate, reducedMotion } from '$lib/motion';

	const MAX = 150;

	interface Group {
		name: string;
		animation: string;
		// The start position, from the centre of the canvas.
		home: [number, number];
		x: number;
		y: number;
		vx: number;
		vy: number;
		phase: number;
	}

	const groups = $state<Group[]>(
		[
			{ name: 'yellow', animation: 'YtoM 10s ease infinite alternate', home: [0, -24] },
			{ name: 'cyan', animation: 'CtoY 14s ease infinite alternate', home: [-46, 12] },
			{ name: 'magenta', animation: 'MtoC 25s ease infinite alternate', home: [40, 20] }
		].map((group, i) => ({
			...group,
			home: group.home as [number, number],
			x: group.home[0],
			y: group.home[1],
			vx: 0,
			vy: 0,
			phase: i * 2.1
		}))
	);

	let count = $state(75);
	let gap = $state(7);
	let drift = $state(true);
	let width = $state(0);
	let height = $state(0);
	let time = $state(0);

	let held: Group | undefined = $state();
	let grip = { x: 0, y: 0 };
	let last = { x: 0, y: 0, t: 0 };

	$effect(() => {
		if (reducedMotion()) drift = false;
		// Fewer rings fit on a small screen.
		if (innerWidth < 640) count = 40;

		return animate((dt) => {
			if (drift) time += dt;

			for (const group of groups) {
				if (group === held) continue;
				group.x += group.vx * dt;
				group.y += group.vy * dt;
				// Friction slows a thrown group.
				const friction = Math.exp(-1.6 * dt);
				group.vx *= friction;
				group.vy *= friction;
				bounce(group);
			}
		});
	});

	// Keep each centre on the canvas. A thrown group bounces at the edge.
	function bounce(group: Group) {
		const halfW = width / 2;
		const halfH = height / 2;
		if (Math.abs(group.x) > halfW) {
			group.x = Math.sign(group.x) * halfW;
			group.vx *= -0.7;
		}
		if (Math.abs(group.y) > halfH) {
			group.y = Math.sign(group.y) * halfH;
			group.vy *= -0.7;
		}
	}

	// The small, slow movement that each group adds to its position.
	function wobble(group: Group) {
		return {
			x: group.x + Math.sin(time * 0.31 + group.phase) * 10,
			y: group.y + Math.cos(time * 0.23 + group.phase * 1.3) * 10,
			s: 1 + Math.sin(time * 0.5 + group.phase) * 0.025
		};
	}

	function local(event: PointerEvent) {
		const box = (event.currentTarget as SVGElement).getBoundingClientRect();
		return {
			x: event.clientX - box.left - box.width / 2,
			y: event.clientY - box.top - box.height / 2
		};
	}

	function grab(event: PointerEvent) {
		const point = local(event);
		// Pick up the group with the centre nearest to the pointer.
		let nearest = groups[0];
		for (const group of groups) {
			const w = wobble(group);
			const n = wobble(nearest);
			if (Math.hypot(w.x - point.x, w.y - point.y) < Math.hypot(n.x - point.x, n.y - point.y)) {
				nearest = group;
			}
		}
		(event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
		held = nearest;
		grip = { x: nearest.x - point.x, y: nearest.y - point.y };
		last = { ...point, t: event.timeStamp };
		nearest.vx = 0;
		nearest.vy = 0;
	}

	function drag(event: PointerEvent) {
		if (!held) return;
		const point = local(event);
		const dt = Math.max((event.timeStamp - last.t) / 1000, 1 / 240);
		held.x = point.x + grip.x;
		held.y = point.y + grip.y;
		// Keep a smooth measure of the speed, so the rings continue when the visitor lets go.
		held.vx = held.vx * 0.5 + ((point.x - last.x) / dt) * 0.5;
		held.vy = held.vy * 0.5 + ((point.y - last.y) / dt) * 0.5;
		last = { ...point, t: event.timeStamp };
	}

	function release(event: PointerEvent) {
		if (!held) return;
		// A pointer that stops before it lets go does not throw the rings.
		if (event.timeStamp - last.t > 80) {
			held.vx = 0;
			held.vy = 0;
		}
		held = undefined;
	}

	// Pull all the rings to one point. Then they drift apart again.
	function gather(event: MouseEvent) {
		const box = (event.currentTarget as SVGElement).getBoundingClientRect();
		const x = event.clientX - box.left - box.width / 2;
		const y = event.clientY - box.top - box.height / 2;
		groups.forEach((group, i) => {
			group.x = x;
			group.y = y;
			const direction = (i / groups.length) * Math.PI * 2;
			group.vx = Math.cos(direction) * 60;
			group.vy = Math.sin(direction) * 60;
		});
	}

	function nudge(group: Group, event: KeyboardEvent) {
		const step = event.shiftKey ? 40 : 10;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step]
		};
		const move = moves[event.key];
		if (!move) return;
		event.preventDefault();
		group.x += move[0];
		group.y += move[1];
		bounce(group);
	}

	function reset() {
		for (const group of groups) {
			[group.x, group.y] = group.home;
			group.vx = 0;
			group.vy = 0;
		}
	}

	const radii = $derived(Array.from({ length: count }, (_, i) => ((i + 1) * gap) / 2));
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<label class="flex items-center gap-2">
			RINGS
			<input type="range" min="1" max={MAX} bind:value={count} class="w-28 accent-current" />
			<span class="w-8 tabular-nums">{count}</span>
		</label>
		<label class="flex items-center gap-2">
			GAP
			<input type="range" min="3" max="20" bind:value={gap} class="w-28 accent-current" />
			<span class="w-8 tabular-nums">{gap}</span>
		</label>
		<button type="button" class="btn" aria-pressed={drift} onclick={() => (drift = !drift)}
			>DRIFT</button
		>
		<button type="button" class="btn" onclick={reset}>RESET</button>
		<span class="opacity-70">Drag and throw the rings. Double-click to gather them.</span>
	</div>

	<div
		class="relative min-h-80 flex-1 overflow-hidden"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		<svg
			class="absolute inset-0 h-full w-full touch-none select-none {held
				? 'cursor-grabbing'
				: 'cursor-grab'}"
			viewBox="{-width / 2} {-height / 2} {width || 1} {height || 1}"
			role="img"
			aria-label="Three sets of rings in yellow, cyan, and magenta"
			onpointerdown={grab}
			onpointermove={drag}
			onpointerup={release}
			onpointercancel={release}
			ondblclick={gather}
		>
			{#each groups as group (group.name)}
				{@const w = wobble(group)}
				<g
					class="rings"
					style="animation: {group.animation}"
					transform="translate({w.x} {w.y}) scale({w.s})"
				>
					{#each radii as r (r)}
						<circle {r} fill="none" stroke="currentColor" vector-effect="non-scaling-stroke" />
					{/each}
					<circle
						r="5"
						fill="currentColor"
						class="outline-none focus-visible:stroke-current focus-visible:stroke-[6]"
						tabindex="0"
						role="button"
						aria-label="Move the {group.name} rings with the arrow keys"
						onkeydown={(event) => nudge(group, event)}
					/>
				</g>
			{/each}
		</svg>
	</div>
</div>

<style>
	.rings {
		mix-blend-mode: multiply;
	}

	:global(.dark) .rings {
		mix-blend-mode: screen;
	}
</style>
