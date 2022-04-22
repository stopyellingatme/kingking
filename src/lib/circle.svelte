<script>
	import shell from "$lib/store/shell.store";

	export let r = "100px";
	export let color = $shell.visual_mode === "dark" ? "white" : "black";
	export let styles = null; // string of styles

	$: w = r;
	$: h = r;
</script>

<div
	style="width: {w}; height: {h}; background-color: transparent; border-color: {color}; {styles}"
	class="rounded-full border-[1px]"
/>
