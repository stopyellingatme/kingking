<script lang="ts">
	import Meta from '$lib/meta.svelte';

	const blobs = [
		{ color: 'bg-amber-400', delay: 0 },
		{ color: 'bg-teal-400', delay: 2000 },
		{ color: 'bg-teal-400', delay: 1000 },
		{ color: 'bg-indigo-400', delay: 5000 },
		{ color: 'bg-amber-400', delay: 4000 },
		{ color: 'bg-teal-400', delay: 5000 },
		{ color: 'bg-amber-400', delay: 3000 },
		{ color: 'bg-amber-400', delay: 0 },
		{ color: 'bg-indigo-400', delay: 2000 },
		{ color: 'bg-indigo-400', delay: 1000 }
	];
</script>

<Meta title="Zeal · TK" description="Soft blobs of colour that move slowly." />

<div class="flex flex-1 items-start justify-center px-8 py-48">
	<div class="relative flex h-full w-full flex-wrap">
		{#each blobs as blob, i (i)}
			<div
				class="animate-blob relative h-32 w-32 rounded-full p-32 opacity-70 blur-xl {blob.color}"
				style="animation-delay: {blob.delay}ms"
			></div>
		{/each}
	</div>
</div>
