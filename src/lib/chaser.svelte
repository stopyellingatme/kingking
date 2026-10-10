<script lang="ts">
	import { hslToRgb, toHex } from '$lib/colour';
	import { animate, reducedMotion } from '$lib/motion';

	// The lilac chaser, after Jeremy Hinton. One dot goes out at a time. If you look only at the
	// cross, the eye stops seeing the still dots, and the gap looks like a dot of the opposite colour.
	// Here, up to three rings chase at different speeds and in different directions.

	interface Ring {
		radius: number;
		size: number;
		count: number;
		// The steps for each step of the outer ring. A negative value goes the other way.
		rate: number;
	}

	const rings: Ring[] = [
		{ radius: 72, size: 13, count: 12, rate: 1 },
		{ radius: 47, size: 10, count: 10, rate: -0.8 },
		{ radius: 25, size: 7, count: 8, rate: 0.6 }
	];

	const sets = [
		['#e07be0', '#3ccfe0', '#fbbd00'],
		['#f76d02', '#97d7e9', '#e07be0'],
		['#00a6f1', '#f20019', '#9be03c']
	];

	let colours = $state([...sets[0]]);
	let set = $state(0);
	let shown = $state(3);
	// The steps of the outer ring in each second.
	let speed = $state(10);
	let soft = $state(0.6);
	let playing = $state(true);
	let direction = $state(1);
	let hidden = $state(rings.map(() => 0));

	const dots = rings.map((ring) =>
		Array.from({ length: ring.count }, (_, i) => {
			const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
			return { x: Math.cos(angle) * ring.radius, y: Math.sin(angle) * ring.radius };
		})
	);

	$effect(() => {
		if (reducedMotion()) playing = false;
		const steps = rings.map(() => 0);
		return animate((dt) => {
			if (!playing) return;
			rings.forEach((ring, i) => {
				steps[i] += dt * speed * ring.rate * direction;
				while (Math.abs(steps[i]) >= 1) {
					const sign = Math.sign(steps[i]);
					steps[i] -= sign;
					hidden[i] = (hidden[i] + sign + ring.count) % ring.count;
				}
			});
		});
	});

	function shuffle() {
		const hue = Math.random() * 360;
		colours = rings.map((_, i) => toHex(hslToRgb((hue + i * 120) % 360, 0.75, 0.65)));
		set = -1;
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<div class="flex flex-wrap gap-2" role="group" aria-label="Colours">
			{#each sets as item, i (i)}
				<button
					type="button"
					class="btn flex items-center gap-1"
					aria-pressed={set === i}
					aria-label="Colours {i + 1}"
					onclick={() => {
						set = i;
						colours = [...item];
					}}
				>
					{#each item as colour (colour)}
						<span class="h-3 w-3 rounded-full" style="background: {colour}"></span>
					{/each}
				</button>
			{/each}
			<button type="button" class="btn" aria-pressed={set === -1} onclick={shuffle}>SHUFFLE</button>
		</div>
		<label class="flex items-center gap-2">
			RINGS
			<input type="range" min="1" max="3" step="1" bind:value={shown} class="w-16" />
		</label>
		<label class="flex items-center gap-2">
			SPEED
			<input type="range" min="2" max="20" step="1" bind:value={speed} class="w-20" />
		</label>
		<label class="flex items-center gap-2">
			SOFT
			<input type="range" min="0" max="1" step="0.05" bind:value={soft} class="w-20" />
		</label>
		<button
			type="button"
			class="btn"
			aria-pressed={direction < 0}
			onclick={() => (direction = -direction)}>REVERSE</button
		>
		<button type="button" class="btn w-16" onclick={() => (playing = !playing)}
			>{playing ? 'PAUSE' : 'PLAY'}</button
		>
		<span class="opacity-70">Look only at the cross for 20 seconds. Tap to turn back.</span>
	</div>

	<div class="relative flex min-h-80 flex-1 items-center justify-center overflow-hidden">
		<div
			class="relative aspect-square w-[min(90%,calc(100dvh-14rem))] max-w-full min-w-64 cursor-pointer"
			role="presentation"
			onpointerup={() => (direction = -direction)}
		>
			<div
				class="bg-tk-conic absolute animate-spin inset-[8%] rounded-full opacity-50 blur-3xl"
				style="animation-duration: 60s"
			></div>
			<div class="lens absolute inset-0 rounded-full"></div>
			<svg
				class="absolute inset-0 h-full w-full"
				viewBox="-100 -100 200 200"
				role="img"
				aria-label="Rings of dots around a cross. One dot in each ring goes out at a time."
				data-hidden={hidden[0]}
			>
				<defs>
					{#each colours as colour, i (i)}
						<radialGradient id="chaser-{i}">
							<stop offset={(1 - soft) * 0.7} stop-color={colour} />
							<stop offset="1" stop-color={colour} stop-opacity="0" />
						</radialGradient>
					{/each}
				</defs>
				{#each rings.slice(0, shown) as ring, r (r)}
					<g class="ring">
						{#each dots[r] as dot, i (i)}
							<circle
								class="dot"
								cx={dot.x}
								cy={dot.y}
								r={ring.size}
								fill="url(#chaser-{r})"
								style="opacity: {i === hidden[r] ? 0 : 1}"
							/>
						{/each}
					</g>
				{/each}
				<path d="M-4 0H4M0 -4V4" stroke="black" stroke-width="1" />
			</svg>
		</div>
	</div>
</div>

<style>
	/* The illusion needs a middle grey behind the dots. The edge fades into the page. */
	.lens {
		background: radial-gradient(circle, #b4b4b4 0 58%, rgb(180 180 180 / 0) 71%);
	}

	:global(.dark) .lens {
		background: radial-gradient(circle, #7a7a7a 0 58%, rgb(122 122 122 / 0) 71%);
	}

	.dot {
		transition: opacity 50ms linear;
	}
</style>
