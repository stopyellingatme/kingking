<script lang="ts">
	import Gradient from '$lib/gradient.svelte';
	import GradientBars from '$lib/gradient_bars.svelte';
	import Meta from '$lib/meta.svelte';
</script>

<Meta
	title="Gradients · TK"
	description="Colour gradients that flow at different speeds, and an editor to make your own."
/>

<div class="flex flex-1 flex-col items-center gap-12 px-4 py-8 sm:px-8">
	<section class="w-full max-w-4xl">
		<h1 class="mb-4 text-xl">FLOW</h1>
		<GradientBars />
	</section>
	<section class="w-full max-w-4xl">
		<h2 class="mb-4 text-xl">MAKE YOUR OWN</h2>
		<Gradient />
	</section>
</div>
