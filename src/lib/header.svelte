<script lang="ts">
	import { page } from "$app/stores";
	import shell from "$lib/store/shell.store";
</script>

<header class="flex justify-between h-10 bg-black">
	<div class="flex items-center justify-between w-[115px] h-5 pl-2 mt-2">
		<a href="/">
			<span class="text-2xl text-yellow-50">TK&nbsp;&#8592;</span>
		</a>
		<!-- Light/Dark Mode toggle -->
		{#if $shell.visual_mode === "dark"}
			<span
				title="Toggle Light Mode"
				class="cursor-pointer select-none"
				on:click={shell.toggleVisialMode}>☀️</span
			>
		{:else}
			<span
				title="Toggle Dark Mode"
				class="cursor-pointer select-none"
				on:click={shell.toggleVisialMode}>🌙</span
			>
		{/if}
	</div>

	<nav class="h-8 mt-2">
		<ul class="flex items-center justify-between text-cyan-50">
			<!-- Generate the links -->
			{#each $shell.routes as route}
				<!-- If it's the home link then we check for strict equality -->
				{#if route.path === "/"}
					<li class="px-4" class:font-bold={$page.url.pathname === route.path}>
						<a sveltekit:prefetch href={route.path}>{route.name}</a>
					</li>
				{:else}
					<li class="px-2" class:font-bold={$page.url.pathname.includes(route.path)}>
						<a sveltekit:prefetch href={route.path}>{route.name}</a>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>

	<div class="px-[40px]" />
</header>
