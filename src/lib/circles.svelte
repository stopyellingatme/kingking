<script lang="ts">
	import Concentric from '$lib/concentric.svelte';

	const MAX = 150;

	const groups = [
		{
			color: 'yellow',
			styles: 'position: absolute; animation: YtoM 10s ease infinite alternate;'
		},
		{
			color: 'cyan',
			styles:
				'position: absolute; margin: -9px 93px 0 0px; animation: CtoY 14s ease infinite alternate;'
		},
		{
			color: 'magenta',
			styles:
				'position: absolute; margin: 57px 0 0 -74px; animation: MtoC 25s ease infinite alternate;'
		}
	];

	let input = $state(75);

	// The input can be empty or out of range while the visitor types.
	const count = $derived(Math.min(MAX, Math.max(1, Math.round(Number(input) || 1))));
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-2 p-5">
		<label for="circle-count"># of Circles</label>
		<input
			id="circle-count"
			type="number"
			min="1"
			max={MAX}
			bind:value={input}
			class="w-20 rounded border border-gray-300 px-1 dark:border-gray-700 dark:bg-black"
		/>
	</div>
	<div class="relative mt-[375px] h-[375px]">
		{#each groups as { color, styles } (color)}
			<div class="flex items-center justify-center">
				<Concentric {count} {color} {styles} />
			</div>
		{/each}
	</div>
</div>
