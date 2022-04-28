<script lang="ts">
	import { onMount, tick } from "svelte";
	import Concentric from "$lib/concentric.svelte";

	let radiuses = [];
	let rs = radiuses.join(", ");
	$: _rs = rs.split(", ");

	onMount(() => {
		tick();
		for (let i = 1; 150 >= i; ++i) {
			radiuses.push(`${i * 4}px`);
		}
		rs = radiuses.join(", ");

		// setInterval(() => {
		// 		hanldeDir();
		// 	}, 2000);
	});

	let dir = 0;
	let pos = 0;

	function hanldeDir() {
		if (dir === 0) {
			pos += 1;
			if (pos >= 6) {
				dir = 1;
			}
		} else {
			pos -= 1;
			if (pos <= 0) {
				dir = 0;
			}
		}
	}

	let circles = [
		{
			color: "magenta",
			styles: "position: absolute; animation: MtoC 5s ease infinite alternate;"
		},
		{
			color: "yellow",
			styles:
				"position: absolute; margin: -90px 60px 0 0; animation: YtoM 7s ease infinite alternate;"
		},
		{
			color: "cyan",
			styles:
				"position: absolute; margin: 40px 0 0 74px; animation: CtoY 12s ease infinite alternate;"
		}
	];

	let other_circles = [
		{
			color: "yellow",
			styles: "position: absolute; animation: YtoM 10s ease infinite alternate;"
		},
		{
			color: "cyan",
			styles:
				"position: absolute; margin: -9px 93px 0 0px; animation: CtoY 14s ease infinite alternate;"
		},
		{
			color: "magenta",
			styles:
				"position: absolute; margin: 57px 0 0 -74px; animation: MtoC 25s ease infinite alternate;"
		}
	];
</script>

<div class="flex flex-col h-full">
	<div class="relative mt-[375px] h-[375px]">
		{#each other_circles as { color, styles }}
			<div class="flex justify-center items-center">
				<Concentric {color} {styles} />
			</div>
		{/each}
	</div>
	<div class="relative pt-[275px] h-[600px]">
		{#each circles as { color, styles }}
			<div class="flex justify-center items-center">
				<Concentric {color} {styles} />
			</div>
		{/each}
	</div>
</div>