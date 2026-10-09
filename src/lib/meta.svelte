<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();

	const url = $derived(new URL(page.url.pathname, 'https://kingking.io').href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="kingking.io" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta name="twitter:card" content="summary" />
</svelte:head>
