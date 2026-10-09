<script lang="ts">
	import Meta from '$lib/meta.svelte';
</script>

<Meta title="M1 · TK" description="A glowing conic gradient behind the TK letters." />

<div class="flex flex-1 items-center justify-center">
	<div class="relative flex h-[400px] w-96">
		<div
			class="absolute z-10 flex h-full w-full items-center justify-center bg-linear-to-br from-gray-900 to-black"
		>
			<h1
				class="-mt-2 bg-linear-to-br from-gray-600 to-white bg-clip-text text-8xl font-bold text-transparent"
			>
				TK
			</h1>
		</div>
		<div class="bg-tk-conic absolute h-full w-full blur-xl"></div>
		<div class="bg-tk-conic absolute h-full w-full animate-pulse opacity-60 blur-3xl"></div>
		<div class="bg-tk-conic absolute -inset-0.5 rounded-xs"></div>
	</div>
</div>
