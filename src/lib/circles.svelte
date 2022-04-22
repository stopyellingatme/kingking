<script lang="ts">
	import { onMount, tick } from "svelte";
	import Circle from "$lib/circle.svelte";

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
</script>

<div class="flex flex-col">
	<div class="relative mt-[375px] h-[375px]">
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="magenta" styles="position: absolute;" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="yellow" styles="position: absolute; margin: -15px 6px 0 0" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="cyan" styles="position: absolute; margin: 5px 0 0 17px" />
			{/each}
		</div>
	</div>

	<div class="relative mt-[250px] h-[475px]">
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="yellow" styles="position: absolute;" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="cyan" styles="position: absolute; margin: -15px 6px 0 0" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="magenta" styles="position: absolute; margin: 5px 0 0 17px" />
			{/each}
		</div>
	</div>

	<div class="relative h-[375px] mt-[150px]">
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="cyan" styles="position: absolute;" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="magenta" styles="position: absolute; margin: -15px 6px 0 0" />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			{#each _rs as radi}
				<Circle r={radi} color="yellow" styles="position: absolute; margin: 5px 0 0 17px" />
			{/each}
		</div>
	</div>
</div>

<style>
	p {
		color: #06b6d4;
		color: #d946ef;
		color: #eab308;

		color: rgb(255, 255, 0, 75%);
		color: rgb(0, 255, 255, 75%);
		color: rgb(255, 0, 255, 75%);
	}
</style>
