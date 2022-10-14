<script>
	const blob_items = [
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

	const classes = 'relative p-32 w-32 h-32 rounded-full opacity-70 filter blur-xl animate-blob';
	// mix-blend-multiply
</script>

<div class="flex items-start justify-center min-h-screen px-8 py-48">
	<div class="relative flex flex-wrap w-full h-full">
		<!-- Blobs -->
		{#each blob_items as item}
			{#if item.delay !== 0}
				<div class="{classes} {item.color} animation-delay-{item.delay}" />
			{:else}
				<div class="{classes} {item.color}" />
			{/if}
		{/each}
	</div>
</div>
