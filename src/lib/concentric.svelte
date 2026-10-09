<script lang="ts">
	import Circle from '$lib/circle.svelte';

	interface Props {
		count?: number;
		dist?: number;
		color?: string;
		styles?: string;
	}

	let { count = 75, dist = 7, color = 'yellow', styles = 'position: absolute;' }: Props = $props();

	const radii = $derived(Array.from({ length: count }, (_, i) => `${(i + 1) * dist}px`));
</script>

{#each radii as r (r)}
	<Circle {r} {color} {styles} />
{/each}
