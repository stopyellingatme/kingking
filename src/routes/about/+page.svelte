<script context="module">
	import { browser, dev } from "$app/environment";

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<div
	class="flex items-center justify-center flex-col h-screen flex-wrap w-full whitespace-pre-line"
>
	<h1>T.KING</h1>

	<pre class="w-3/4 whitespace-pre-line text-center">
		Hello, this is my personal website. And I will do with it as I please! Art projects for whatever!
	</pre>
</div>
