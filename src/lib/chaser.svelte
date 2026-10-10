<script lang="ts">
	import { animate, reducedMotion } from '$lib/motion';

	// The lilac chaser, after Jeremy Hinton. One dot goes out at a time. If you look only at the
	// cross, the eye stops seeing the still dots, and the gap looks like a dot of the opposite colour.

	const COUNT = 12;
	const presets = [
		{ name: 'LILAC', colour: '#e07be0' },
		{ name: 'CYAN', colour: '#3ccfe0' },
		{ name: 'LIME', colour: '#9be03c' },
		{ name: 'ORANGE', colour: '#ff9a3c' }
	];

	let colour = $state(presets[0].colour);
	// The steps in each second.
	let speed = $state(10);
	let soft = $state(0.6);
	let playing = $state(true);
	let hidden = $state(0);

	const dots = Array.from({ length: COUNT }, (_, i) => {
		const angle = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
		return { x: Math.cos(angle) * 70, y: Math.sin(angle) * 70 };
	});

	$effect(() => {
		if (reducedMotion()) playing = false;
		let steps = 0;
		return animate((dt) => {
			if (!playing) return;
			steps += dt * speed;
			while (steps >= 1) {
				steps -= 1;
				hidden = (hidden + 1) % COUNT;
			}
		});
	});
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Colour">
			{#each presets as preset (preset.name)}
				<button
					type="button"
					class="btn flex items-center gap-2"
					aria-pressed={colour === preset.colour}
					onclick={() => (colour = preset.colour)}
				>
					<span class="h-3 w-3 rounded-full" style="background: {preset.colour}" aria-hidden="true"
					></span>
					{preset.name}
				</button>
			{/each}
			<input
				type="color"
				bind:value={colour}
				aria-label="Your colour"
				class="h-7 w-9 cursor-pointer"
			/>
		</div>
		<label class="flex items-center gap-2">
			SPEED
			<input type="range" min="2" max="20" step="1" bind:value={speed} class="w-24" />
		</label>
		<label class="flex items-center gap-2">
			SOFT
			<input type="range" min="0" max="1" step="0.05" bind:value={soft} class="w-24" />
		</label>
		<button type="button" class="btn w-16" onclick={() => (playing = !playing)}
			>{playing ? 'PAUSE' : 'PLAY'}</button
		>
		<span class="opacity-70">Look only at the cross for 20 seconds.</span>
	</div>

	<div class="chaser relative flex min-h-80 flex-1 items-center justify-center">
		<svg
			class="absolute inset-0 h-full w-full"
			viewBox="-100 -100 200 200"
			role="img"
			aria-label="A ring of dots around a cross. One dot goes out at a time."
			data-hidden={hidden}
		>
			<defs>
				<radialGradient id="chaser-dot">
					<stop offset={(1 - soft) * 0.7} stop-color={colour} />
					<stop offset="1" stop-color={colour} stop-opacity="0" />
				</radialGradient>
			</defs>
			{#each dots as dot, i (i)}
				<circle
					cx={dot.x}
					cy={dot.y}
					r="13"
					fill="url(#chaser-dot)"
					visibility={i === hidden ? 'hidden' : 'visible'}
				/>
			{/each}
			<path d="M-5 0H5M0 -5V5" stroke="black" stroke-width="1.2" />
		</svg>
	</div>
</div>

<style>
	/* The illusion needs a middle grey behind the dots. */
	.chaser {
		background: #c4c4c4;
	}

	:global(.dark) .chaser {
		background: #808080;
	}
</style>
