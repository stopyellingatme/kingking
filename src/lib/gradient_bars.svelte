<script lang="ts">
	import { animate, approach, reducedMotion } from '$lib/motion';
	import { strip } from '$lib/palette';

	interface Bar {
		label: string;
		speed: number;
		// The flow position, in bar widths. The bar repeats after 1.
		offset: number;
		// The flow speed, in bar widths per second.
		velocity: number;
		dragging: boolean;
	}

	const speeds: [string, number][] = [
		['×0', 0],
		['×⅓', 1 / 3],
		['×½', 1 / 2],
		['×1', 1],
		['×2', 2],
		['×3', 3]
	];

	// Each bar flows at its own speed. Alternate bars flow in opposite directions.
	const drift = (i: number) => (i % 2 ? -1 : 1) * 0.015 * (speeds[i][1] + 0.5);

	const bars = $state<Bar[]>(
		speeds.map(([label, speed], i) => ({
			label,
			speed,
			offset: 0,
			velocity: drift(i),
			dragging: false
		}))
	);

	let rate = $state(1);
	let playing = $state(true);
	let clock = $state(0);

	// Turn from 0 to 360 degrees and back again.
	function hueOf(bar: Bar) {
		const turn = (clock * 20 * bar.speed) % 720;
		return Math.round(turn > 360 ? 720 - turn : turn);
	}

	$effect(() => {
		if (reducedMotion()) playing = false;

		return animate((dt) => {
			const step = playing ? dt * rate : 0;
			clock += step;

			bars.forEach((bar, i) => {
				if (bar.dragging) return;
				// After a throw, the bar slows down to its usual speed.
				bar.velocity = approach(bar.velocity, playing ? drift(i) * rate : 0, 1.2, dt);
				bar.offset = (((bar.offset + bar.velocity * dt) % 1) + 1) % 1;
			});
		});
	});

	let lastX = 0;
	let lastTime = 0;

	function grab(bar: Bar, event: PointerEvent) {
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		bar.dragging = true;
		bar.velocity = 0;
		lastX = event.clientX;
		lastTime = event.timeStamp;
	}

	function slide(bar: Bar, event: PointerEvent) {
		if (!bar.dragging) return;
		const width = (event.currentTarget as HTMLElement).clientWidth;
		const dx = (event.clientX - lastX) / width;
		const dt = Math.max((event.timeStamp - lastTime) / 1000, 1 / 240);
		bar.offset = (((bar.offset - dx) % 1) + 1) % 1;
		// Keep a smooth measure of the speed, so the bar continues when the visitor lets go.
		bar.velocity = bar.velocity * 0.6 + (-dx / dt) * 0.4;
		lastX = event.clientX;
		lastTime = event.timeStamp;
	}

	function release(bar: Bar) {
		bar.dragging = false;
	}

	function sync() {
		clock = 0;
		bars.forEach((bar) => (bar.offset = 0));
	}
</script>

<div class="flex flex-col gap-2">
	{#each bars as bar (bar.label)}
		<div class="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3 text-xs sm:text-sm">
			<span class="opacity-70">{bar.label}</span>
			<div
				class="bouncy cursor-grab touch-pan-y overflow-hidden rounded active:cursor-grabbing {bar.dragging
					? 'h-14'
					: 'h-8 hover:h-14'}"
				style="filter: hue-rotate({hueOf(bar)}deg)"
				role="presentation"
				onpointerdown={(event) => grab(bar, event)}
				onpointermove={(event) => slide(bar, event)}
				onpointerup={() => release(bar)}
				onpointercancel={() => release(bar)}
			>
				<div
					class="h-full w-[200%]"
					style="background-image: {strip}; background-size: 50% 100%; transform: translateX({-bar.offset *
						50}%)"
				></div>
			</div>
			<span class="text-right tabular-nums opacity-70">{hueOf(bar)}°</span>
		</div>
	{/each}

	<div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
		<label class="flex items-center gap-2">
			SPEED
			<input
				type="range"
				min="0"
				max="4"
				step="0.25"
				bind:value={rate}
				class="w-32 accent-current"
			/>
			<span class="w-12 tabular-nums">×{rate.toFixed(2)}</span>
		</label>
		<button type="button" class="btn" aria-pressed={!playing} onclick={() => (playing = !playing)}
			>{playing ? 'PAUSE' : 'PLAY'}</button
		>
		<button type="button" class="btn" onclick={sync}>SYNC</button>
		<span class="opacity-70">Drag a bar to throw it.</span>
	</div>
</div>
