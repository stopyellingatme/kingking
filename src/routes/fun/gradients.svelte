<script lang="ts">
	import Gradient from "$lib/gradient.svelte";
	import OptiGradient from "$lib/opti_gradient.svelte";

	const gradients: Array<Array<{ from: string; via: string; to: string }>> = [
		// [
		// 	// Batch 00
		// 	{ from: "from-red-900", via: "via-red-500", to: "to-red-300" },
		// 	{ from: "from-orange-900", via: "via-orange-500", to: "to-orange-300" },
		// 	{ from: "from-yellow-900", via: "via-yellow-500", to: "to-yellow-300" }
		// ],
		// [
		// 	// Batch 01
		// 	{ from: "from-green-900", via: "via-green-500", to: "to-green-300" },
		// 	{ from: "from-teal-900", via: "via-teal-500", to: "to-teal-300" },
		// 	{ from: "from-blue-900", via: "via-blue-500", to: "to-blue-300" }
		// ],
		// [
		// 	// Batch 02
		// 	{ from: "from-indigo-900", via: "via-indigo-500", to: "to-indigo-300" },
		// 	{ from: "from-purple-900", via: "via-purple-500", to: "to-purple-300" },
		// 	{ from: "from-pink-900", via: "via-pink-500", to: "to-pink-300" }
		// ]
	];

	const classes = "w-full h-8 my-1 rounded";
</script>

<div class="flex items-start justify-center h-full">
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
		<br />
		<br />
		{#each gradients as batch, i}
			<div>
				<span>COLOR {i < 10 && "0"}{i}</span>
				{#each batch as grad}
					<div class="{classes} bg-gradient-to-r {grad.from} {grad.via} {grad.to}" />
				{/each}
				<br />
			</div>
		{/each}
	</div>
</div>
