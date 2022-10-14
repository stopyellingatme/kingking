<script lang="ts">
	import Gradient from "$lib/gradient.svelte";
	import OptiGradient from "$lib/opti_gradient.svelte";
</script>

<div class="flex items-start justify-center h-screen">
	<div class="w-3/4 m-auto dark:text-cyan-50">
		<OptiGradient />
		<OptiGradient modifier={(hue) => (hue / 3).toFixed(0)} />
		<OptiGradient modifier={(hue) => (hue / 2).toFixed(0)} />
		<OptiGradient rotate={true} />
		<OptiGradient modifier={(hue) => (hue * 2).toFixed(0)} />
		<OptiGradient modifier={(hue) => (hue * 3).toFixed(0)} />
		<br />
		<br />
		<Gradient with_swatch={true} />
	</div>
</div>
