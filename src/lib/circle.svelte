<script lang="ts">
	interface Props {
		r?: string;
		color?: string;
		styles?: string;
	}

	let { r = '100px', color = 'currentColor', styles = '' }: Props = $props();
</script>

<div
	style="width: {r}; height: {r}; border-color: {color}; {styles}"
	class="rounded-full border"
></div>
