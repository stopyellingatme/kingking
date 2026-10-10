<script lang="ts">
	import { orbColours, stareColours } from '$lib/orbs';
	import { strip } from '$lib/palette';
	import { GLOW, renderDisc, schemes } from '$lib/snake_pattern';

	// A small, light version of each experiment for the home page cards. It uses CSS animation only.
	let { slug }: { slug: string } = $props();

	let snakes: HTMLCanvasElement | undefined = $state();

	// The snakes discs do not move, so draw them one time for each size. The eye makes them turn.
	const discs = [
		{ x: 0.4, y: 0.4, r: 0.25, scheme: 0, mirror: false },
		{ x: 0.72, y: 0.66, r: 0.18, scheme: 1, mirror: true },
		{ x: 0.3, y: 0.78, r: 0.12, scheme: 2, mirror: true }
	];

	$effect(() => {
		const canvas = snakes;
		if (!canvas) return;
		const observer = new ResizeObserver(() => {
			const size = canvas.clientWidth;
			const ratio = Math.min(devicePixelRatio, 2);
			canvas.width = canvas.height = Math.round(size * ratio);
			const context = canvas.getContext('2d');
			if (!context || size === 0) return;
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			for (const disc of discs) {
				const r = disc.r * size;
				const half = r * (1 + GLOW);
				context.save();
				context.translate(disc.x * size, disc.y * size);
				if (disc.mirror) context.scale(-1, 1);
				context.drawImage(
					renderDisc(r, ratio, schemes[disc.scheme]),
					-half,
					-half,
					half * 2,
					half * 2
				);
				context.restore();
			}
		});
		observer.observe(canvas);
		return () => observer.disconnect();
	});

	const orbs = [
		{ x: 36, y: 40, r: 17, colour: 0 },
		{ x: 64, y: 38, r: 13, colour: 1 },
		{ x: 52, y: 66, r: 15, colour: 2 }
	];

	const chaser = [
		{ radius: 30, size: 6, colour: '#e07be0', reverse: false },
		{ radius: 18, size: 4.5, colour: '#3ccfe0', reverse: true }
	].map((ring) => ({
		...ring,
		dots: Array.from({ length: 12 }, (_, i) => {
			const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
			const order = ring.reverse ? 12 - i : i;
			return {
				x: Math.cos(angle) * ring.radius,
				y: Math.sin(angle) * ring.radius,
				delay: order * 0.1 - 1.2
			};
		})
	}));

	const confetti = [
		{ x: 24, y: 30, r: 11 },
		{ x: 30, y: 64, r: 13 },
		{ x: 14, y: 84, r: 8 },
		{ x: 74, y: 24, r: 12 },
		{ x: 68, y: 58, r: 10 },
		{ x: 84, y: 82, r: 11 }
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
		<canvas bind:this={snakes} class="aspect-square w-full" aria-hidden="true"></canvas>
	{:else if slug === 'afterimage'}
		<svg class="h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
			<defs>
				{#each orbs as orb, i (i)}
					{@const [edge, light] = stareColours(orbColours[orb.colour])}
					<radialGradient id="preview-orb-{i}" cx="35%" cy="30%" r="75%">
						<stop offset="0" stop-color={light} />
						<stop offset="1" stop-color={edge} />
					</radialGradient>
				{/each}
			</defs>
			<g class="preview-stare">
				{#each orbs as orb, i (i)}
					<circle cx={orb.x} cy={orb.y} r={orb.r} fill="url(#preview-orb-{i})" />
				{/each}
			</g>
			<g class="preview-flash">
				{#each orbs as orb, i (i)}
					<circle
						cx={orb.x}
						cy={orb.y}
						r={orb.r}
						fill="none"
						stroke="currentColor"
						stroke-opacity="0.45"
						stroke-width="0.6"
					/>
				{/each}
			</g>
			<circle cx="50" cy="50" r="1.8" class="fill-white" />
			<circle cx="50" cy="50" r="1.2" class="fill-black" />
		</svg>
	{:else if slug === 'chaser'}
		<div
			class="bg-tk-conic absolute animate-spin inset-[22%] rounded-full opacity-50 blur-2xl"
			style="animation-duration: 60s"
		></div>
		<svg class="relative h-full w-full" viewBox="-50 -50 100 100" aria-hidden="true">
			<defs>
				<radialGradient id="preview-lens">
					<stop offset="0.8" stop-color="#b4b4b4" />
					<stop offset="1" stop-color="#b4b4b4" stop-opacity="0" />
				</radialGradient>
				{#each chaser as ring, r (r)}
					<radialGradient id="preview-chaser-{r}">
						<stop offset="0.3" stop-color={ring.colour} />
						<stop offset="1" stop-color={ring.colour} stop-opacity="0" />
					</radialGradient>
				{/each}
			</defs>
			<circle r="44" fill="url(#preview-lens)" />
			{#each chaser as ring, r (r)}
				{#each ring.dots as dot, i (i)}
					<circle
						class="preview-chase"
						cx={dot.x}
						cy={dot.y}
						r={ring.size}
						fill="url(#preview-chaser-{r})"
						style="animation-delay: {dot.delay}s"
					/>
				{/each}
			{/each}
			<path d="M-2.5 0H2.5M0 -2.5V2.5" stroke="black" stroke-width="0.7" />
		</svg>
	{:else if slug === 'confetti'}
		<svg class="h-4/5 w-4/5 rounded-lg" viewBox="0 0 100 100" aria-hidden="true">
			<defs>
				<linearGradient id="preview-warm" gradientUnits="userSpaceOnUse" x2="100">
					<stop offset="0" stop-color="#f20019" />
					<stop offset="0.5" stop-color="#f76d02" />
					<stop offset="1" stop-color="#770e7d" />
				</linearGradient>
				<linearGradient id="preview-cool" gradientUnits="userSpaceOnUse" x2="100">
					<stop offset="0" stop-color="#015ad5" />
					<stop offset="0.5" stop-color="#0333b4" />
					<stop offset="1" stop-color="#33137a" />
				</linearGradient>
				<pattern id="preview-a" width="100" height="2" patternUnits="userSpaceOnUse">
					<rect width="100" height="1" fill="url(#preview-warm)" />
				</pattern>
				<pattern id="preview-b" width="100" height="2" patternUnits="userSpaceOnUse">
					<rect y="1" width="100" height="1" fill="url(#preview-cool)" />
				</pattern>
			</defs>
			<rect width="100" height="100" fill="url(#preview-cool)" />
			<rect width="100" height="100" fill="url(#preview-a)" />
			{#each confetti as ball, i (i)}
				<circle cx={ball.x} cy={ball.y} r={ball.r} fill="#fbbd00" />
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

	.preview-stare {
		animation: preview-stare 9s step-end infinite;
	}

	@keyframes preview-stare {
		0% {
			opacity: 1;
		}
		70% {
			opacity: 0;
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
