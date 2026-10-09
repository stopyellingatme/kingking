<script lang="ts">
	import Concentric from '$lib/concentric.svelte';

	// A small, light version of each experiment for the home page cards.
	let { slug }: { slug: string } = $props();
</script>

<div class="relative flex h-full w-full items-center justify-center overflow-hidden">
	{#if slug === 'gradients'}
		<div class="flex w-4/5 flex-col gap-1">
			{#each [0, 60, 120, 180, 240] as hue (hue)}
				<div class="opti-gradient-01 h-3 rounded" style="filter: hue-rotate({hue}deg)"></div>
			{/each}
		</div>
	{:else if slug === 'circular'}
		<Concentric
			count={11}
			dist={9}
			color="yellow"
			styles="position: absolute; animation: YtoM 10s ease infinite alternate;"
		/>
		<Concentric
			count={11}
			dist={9}
			color="cyan"
			styles="position: absolute; margin: -9px 40px 0 0; animation: CtoY 14s ease infinite alternate;"
		/>
		<Concentric
			count={11}
			dist={9}
			color="magenta"
			styles="position: absolute; margin: 30px 0 0 -34px; animation: MtoC 25s ease infinite alternate;"
		/>
	{:else if slug === 'm1'}
		<div class="relative h-24 w-24">
			<div class="bg-tk-conic absolute h-full w-full blur-lg"></div>
			<div
				class="absolute z-10 flex h-full w-full items-center justify-center bg-linear-to-br from-gray-900 to-black"
			>
				<span
					class="bg-linear-to-br from-gray-600 to-white bg-clip-text font-sans text-3xl font-bold text-transparent"
					>TK</span
				>
			</div>
		</div>
	{:else if slug === 'zeal'}
		<div class="flex">
			{#each ['bg-amber-400', 'bg-teal-400', 'bg-indigo-400'] as color, i (color)}
				<div
					class="animate-blob -mx-2 h-16 w-16 rounded-full opacity-70 blur-lg {color}"
					style="animation-delay: {i * 1500}ms"
				></div>
			{/each}
		</div>
	{/if}
</div>
