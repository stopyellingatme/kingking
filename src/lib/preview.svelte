<script lang="ts">
	import { strip } from '$lib/palette';

	// A small, light version of each experiment for the home page cards. It uses CSS animation only.
	let { slug }: { slug: string } = $props();

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
	{/if}
</div>

<style>
	.preview-rings {
		mix-blend-mode: multiply;
	}

	:global(.dark) .preview-rings {
		mix-blend-mode: screen;
	}
</style>
