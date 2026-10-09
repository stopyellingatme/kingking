<script lang="ts">
	interface Props {
		with_swatch?: boolean;
		title?: string;
		color?: string;
	}

	let { with_swatch = false, title = 'CUSTOM', color = $bindable('#ffffff') }: Props = $props();

	let colors = $state([
		'#f20019',
		'#33137a',
		'#161415',
		'#222423',
		'#0333b4',
		'#015ad5',
		'#00a6f1',
		'#97d7e9',
		'#f9f5f2',
		'#f9f5f2',
		'#fbbd00',
		'#f76d02',
		'#f20019',
		'#770e7d',
		'#222423',
		'#161415',
		'#1c2121',
		'#0333b4',
		'#015ad5',
		'#00a6f1'
	]);
</script>

<div>
	<span class="text-xl">{title}</span>
	{#if with_swatch}
		<div class="flex items-center">
			<input
				class="rounded border-2 border-gray-200 dark:border-gray-700 dark:bg-black"
				aria-label="New color"
				bind:value={color}
				type="color"
			/>
			<button
				type="button"
				class="m-4 cursor-pointer rounded bg-stone-700 px-2 py-1 text-white"
				onclick={() => colors.push(color)}>ADD COLOR</button
			>
		</div>
		<div class="flex w-full flex-wrap justify-start pb-4">
			{#each colors, i (i)}
				<div class="flex items-center justify-center">
					<input
						class="rounded border-2 border-gray-200 dark:border-gray-700 dark:bg-black"
						aria-label="Color {i + 1}"
						bind:value={colors[i]}
						type="color"
					/>
					<button
						type="button"
						class="cursor-pointer pr-4 pl-1 text-xl"
						aria-label="Remove color {i + 1}"
						onclick={() => colors.splice(i, 1)}>X</button
					>
				</div>
			{/each}
		</div>
	{/if}
	<div
		style="background-image: linear-gradient(to right, {colors.join(', ')})"
		class="my-1 h-8 w-full rounded"
	></div>
</div>
