<script lang="ts">
	import '../app.css';
	import Header from '$lib/header.svelte';
	import shell from '$lib/store/shell.store';
</script>

<div class:dark={$shell.visual_mode === 'dark'} class="h-full">
	<Header />

	<body class="bg-white dark:bg-black h-full">
		<div class="flex flex-col h-full dark:text-cyan-50">
			<div class="flex items-center justify-center h-8 text-2xl">
				&#8249;&nbsp;
				<div class="w-screen h-[2px] mt-1 opti-01" />
				&nbsp;&#8250;
			</div>

			<div class="flex content-center justify-center h-full">
				<div class="flex flex-col items-center justify-center text-2xl">
					&#8593;
					<div class="w-[1px] h-full border-[1px] border-black dark:border-white" />
					&#8595;
				</div>
				<main class="w-full">
					<slot />
				</main>
				<div class="flex flex-col items-center justify-center text-2xl">
					&#8593;
					<div class="w-[1px] h-full border-[1px] border-black dark:border-white" />
					&#8595;
				</div>
			</div>
		</div>
	</body>

	<!-- <Footer /> -->
</div>
