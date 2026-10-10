<script lang="ts">
	import { fillOf, shapes } from '$lib/afterimage_scene';
	import { strip } from '$lib/palette';
	import { drawSnakes, schemes } from '$lib/snake_pattern';

	// A small, light version of each experiment for the home page cards. It uses CSS animation only.
	let { slug }: { slug: string } = $props();

	let snakes: HTMLCanvasElement | undefined = $state();

	// The snakes picture does not move, so draw it one time for each size.
	$effect(() => {
		const canvas = snakes;
		if (!canvas) return;
		const observer = new ResizeObserver(() => {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			drawSnakes(canvas, {
				width,
				height,
				ratio: devicePixelRatio,
				cell: Math.min(width, height) / 1.6,
				colours: schemes[0].colours,
				flip: false
			});
		});
		observer.observe(canvas);
		return () => observer.disconnect();
	});

	const chaser = Array.from({ length: 12 }, (_, i) => {
		const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
		return { x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, delay: i * 0.1 - 1.2 };
	});

	const confetti = [
		{ x: 22, y: 30, r: 11 },
		{ x: 30, y: 62, r: 13 },
		{ x: 14, y: 82, r: 8 },
		{ x: 74, y: 24, r: 12 },
		{ x: 66, y: 56, r: 10 },
		{ x: 82, y: 80, r: 12 }
	];

	const rings = [
		{ name: 'yellow', animation: 'YtoM 10s ease infinite alternate', x: 0, y: -6 },
		{ name: 'cyan', animation: 'CtoY 14s ease infinite alternate', x: -12, y: 4 },
		{ name: 'magenta', animation: 'MtoC 25s ease infinite alternate', x: 10, y: 6 }
	];
</script>

<div class="relative flex h-full w-full items-center justify-center overflow-hidden">
	{#if slug === 'gradients'}
		<div class="flex w-4/5 flex-col gap-1">
			{#each [0, 60, 120, 180, 240] as hue, i (hue)}
				<div class="h-3 overflow-hidden rounded" style="filter: hue-rotate({hue}deg)">
					<div
						class="animate-flow h-full w-[200%]"
						style="background-image: {strip}; background-size: 50% 100%; animation-duration: {12 +
							i * 6}s; animation-direction: {i % 2 ? 'reverse' : 'normal'}"
					></div>
				</div>
			{/each}
		</div>
	{:else if slug === 'circular'}
		<svg class="h-full w-full" viewBox="-50 -50 100 100" aria-hidden="true">
			{#each rings as ring (ring.name)}
				<g
					class="preview-rings"
					style="animation: {ring.animation}"
					transform="translate({ring.x} {ring.y})"
				>
					{#each Array.from({ length: 11 }, (_, i) => (i + 1) * 3.2) as r (r)}
						<circle {r} fill="none" stroke="currentColor" stroke-width="0.4" />
					{/each}
				</g>
			{/each}
		</svg>
	{:else if slug === 'm1'}
		<div class="animate-tk-spin relative h-24 w-24">
			<div class="bg-tk-conic absolute h-full w-full blur-lg"></div>
			<div
				class="absolute z-10 flex h-full w-full items-center justify-center bg-linear-to-br from-gray-900 to-black"
			>
				<span class="tk-sheen animate-tk-sheen font-sans text-3xl font-bold">TK</span>
			</div>
		</div>
	{:else if slug === 'zeal'}
		<div class="flex">
			{#each ['from-amber-400 to-pink-400', 'from-teal-400 to-sky-400', 'from-indigo-400 to-fuchsia-400'] as colors, i (colors)}
				<div
					class="animate-blob -mx-2 h-16 w-16 rounded-full bg-radial-[at_35%_30%] opacity-80 blur-md {colors}"
					style="animation-delay: {i * 1500}ms"
				></div>
			{/each}
		</div>
	{:else if slug === 'snakes'}
		<canvas bind:this={snakes} class="h-full w-full" aria-hidden="true"></canvas>
	{:else if slug === 'afterimage'}
		{#each ['stare', 'grey'] as const as view (view)}
			<svg
				class="absolute inset-0 h-full w-full"
				class:preview-flash={view === 'grey'}
				viewBox="80 50 240 240"
				preserveAspectRatio="xMidYMid slice"
				aria-hidden="true"
			>
				{#each shapes as shape, i (i)}
					<svelte:element
						this={shape.kind}
						xmlns="http://www.w3.org/2000/svg"
						{...shape.attributes}
						fill={fillOf(shape, view, 0)}
					/>
				{/each}
				<circle cx="200" cy="150" r="4" fill="white" />
				<circle cx="200" cy="150" r="2.5" fill="black" />
			</svg>
		{/each}
	{:else if slug === 'chaser'}
		<svg class="h-full w-full bg-[#c4c4c4]" viewBox="-50 -50 100 100" aria-hidden="true">
			<defs>
				<radialGradient id="preview-chaser">
					<stop offset="0.3" stop-color="#e07be0" />
					<stop offset="1" stop-color="#e07be0" stop-opacity="0" />
				</radialGradient>
			</defs>
			{#each chaser as dot, i (i)}
				<circle
					class="preview-chase"
					cx={dot.x}
					cy={dot.y}
					r="6"
					fill="url(#preview-chaser)"
					style="animation-delay: {dot.delay}s"
				/>
			{/each}
			<path d="M-3 0H3M0 -3V3" stroke="black" stroke-width="0.8" />
		</svg>
	{:else if slug === 'confetti'}
		<svg class="h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
			<defs>
				<pattern id="preview-a" width="4" height="3" patternUnits="userSpaceOnUse">
					<rect width="4" height="1.5" fill="#ff2d55" />
				</pattern>
				<pattern id="preview-b" width="4" height="3" patternUnits="userSpaceOnUse">
					<rect y="1.5" width="4" height="1.5" fill="#00b7ff" />
				</pattern>
			</defs>
			<rect width="100" height="100" fill="url(#preview-a)" />
			<rect width="100" height="100" fill="url(#preview-b)" />
			{#each confetti as ball, i (i)}
				<circle cx={ball.x} cy={ball.y} r={ball.r} fill="#e6d36a" />
				<circle cx={ball.x} cy={ball.y} r={ball.r} fill="url(#preview-{ball.x < 50 ? 'a' : 'b'})" />
			{/each}
		</svg>
	{/if}
</div>

<style>
	.preview-rings {
		mix-blend-mode: multiply;
	}

	:global(.dark) .preview-rings {
		mix-blend-mode: screen;
	}

	/* The grey picture shows for a short time, after a long look at the colour picture. */
	.preview-flash {
		opacity: 0;
		animation: preview-flash 9s step-end infinite;
	}

	@keyframes preview-flash {
		0% {
			opacity: 0;
		}
		70% {
			opacity: 1;
		}
	}

	/* Each dot goes out for one twelfth of the turn. */
	.preview-chase {
		animation: preview-chase 1.2s step-end infinite;
	}

	@keyframes preview-chase {
		0% {
			opacity: 0;
		}
		8.333% {
			opacity: 1;
		}
	}
</style>
