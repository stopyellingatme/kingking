<script lang="ts">
	import { onMount, tick } from "svelte";
	import Circle from "$lib/circle.svelte";

	export let radii = 75;
	export let dist = 7;
  export let color = "yellow";
  export let styles = "position: absolute;";

	let radiuses = [];
	let rs = radiuses.join(", ");
	$: _rs = rs.split(", ");

	onMount(() => {
		tick();
		for (let i = 1; radii >= i; ++i) {
			radiuses.push(`${i * dist}px`);
		}
		rs = radiuses.join(", ");
	});
</script>

{#each _rs as radi}
	<Circle r={radi} color={color} {styles} />
{/each}
