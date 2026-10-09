<script lang="ts">
	import { page } from '$app/state';

	const routes = [
		{ path: '/', name: '///' },
		{ path: '/fun', name: 'SPACE' },
		{ path: '/about', name: 'ME' }
	];

	function isActive(path: string) {
		const current = page.url.pathname;
		return path === '/' ? current === '/' : current === path || current.startsWith(`${path}/`);
	}

	function toggleTheme() {
		const dark = document.documentElement.classList.toggle('dark');
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			// Private windows can block storage. The theme still changes for this visit.
		}
	}
</script>

<header class="flex h-10 items-center justify-between bg-black px-2">
	<div class="flex w-[115px] items-center justify-between">
		<a href="/" class="text-2xl text-yellow-50">TK&nbsp;&#8592;</a>
		<button
			type="button"
			class="cursor-pointer select-none"
			aria-label="Toggle dark mode"
			title="Toggle dark mode"
			onclick={toggleTheme}
		>
			<span class="dark:hidden">🌙</span>
			<span class="hidden dark:inline">☀️</span>
		</button>
	</div>

	<nav>
		<ul class="flex items-center text-cyan-50">
			{#each routes as route (route.path)}
				<li class={route.path === '/' ? 'px-4' : 'px-2'}>
					<a
						href={route.path}
						class:font-bold={isActive(route.path)}
						aria-current={isActive(route.path) ? 'page' : undefined}>{route.name}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="w-[115px]"></div>
</header>
