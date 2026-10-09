<script lang="ts">
	import Gradient from '$lib/gradient.svelte';
	import Meta from '$lib/meta.svelte';
	import OptiGradient from '$lib/opti_gradient.svelte';
</script>

<Meta title="Gradients · TK" description="Animated colour gradients and a gradient editor." />

<div class="flex flex-1 items-center justify-center py-8">
	<div class="w-3/4">
		<OptiGradient />
		<OptiGradient modifier={(hue) => hue / 3} />
		<OptiGradient modifier={(hue) => hue / 2} />
		<OptiGradient rotate />
		<OptiGradient modifier={(hue) => hue * 2} />
		<OptiGradient modifier={(hue) => hue * 3} />
		<div class="h-12"></div>
		<Gradient with_swatch />
	</div>
</div>
