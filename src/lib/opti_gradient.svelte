<script>
	import { onMount, tick } from "svelte";

	// Example: (hue) => ((hue/3).toFixed(0))
	export let modifier = null;
	export let rotate = false;

	let dir = 0;
	let hue = 0;
	onMount(() => {
		if (rotate || modifier) {
			tick();
			setInterval(() => {
				hanldeDir();
			}, 100);
		}
	});

	function hanldeDir() {
		if (dir === 0) {
			hue += 1;
			if (hue >= 360) {
				dir = 1;
			}
		} else {
			hue -= 1;
			if (hue <= 0) {
				dir = 0;
			}
		}
	}
</script>

{#if modifier}
	<div
		style="filter: hue-rotate({(hue = modifier(hue))}deg)"
		class="w-full h-8 my-1 rounded opti-gradient-01"
	/>
{:else}
	<div style="filter: hue-rotate({hue}deg)" class="w-full h-8 my-1 rounded opti-gradient-01" />
{/if}
