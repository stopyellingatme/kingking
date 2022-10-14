<script lang="ts">
	import { onMount, tick } from "svelte";
	import Concentric from "$lib/concentric.svelte";

	let circles = [
		{
			color: "magenta",
			styles: "position: absolute; animation: MtoC 10s ease infinite alternate;"
		},
		{
			color: "yellow",
			styles:
				"position: absolute; margin: -90px 60px 0 0; animation: YtoM 14s ease infinite alternate;"
		},
		{
			color: "cyan",
			styles:
				"position: absolute; margin: 40px 0 0 74px; animation: CtoY 25s ease infinite alternate;"
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

<div class="flex flex-col">
	<div class="flex p-5">
		<label for="circle_num"># of Circles</label>
		<input name="circle_num" type="number">
	</div>
	<div class="relative mt-[375px] h-[375px]">
		{#each other_circles as { color, styles }}
			<div class="flex justify-center items-center">
				<Concentric {color} {styles} />
			</div>
		{/each}
	</div>
	<!-- <div class="relative pt-[275px] h-[600px]">
		{#each circles as { color, styles }}
			<div class="flex justify-center items-center">
				<Concentric {color} {styles} />
			</div>
		{/each}
	</div> -->
</div>