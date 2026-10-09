<script lang="ts">
	interface Props {
		// Changes the hue before it is drawn. Example: (hue) => hue / 3
		modifier?: (hue: number) => number;
		rotate?: boolean;
	}

	let { modifier, rotate = false }: Props = $props();

	let hue = $state(0);
	let step = 1;

	$effect(() => {
		if (!rotate && !modifier) return;

		// Move the hue from 0 to 360 and back again.
		const timer = setInterval(() => {
			if (hue >= 360) step = -1;
			else if (hue <= 0) step = 1;
			hue += step;
		}, 100);

		return () => clearInterval(timer);
	});

	const shown = $derived(modifier ? Math.round(modifier(hue)) : hue);
</script>

<div style="filter: hue-rotate({shown}deg)" class="opti-gradient-01 my-1 h-8 w-full rounded"></div>
