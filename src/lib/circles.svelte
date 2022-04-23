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
</script>

<div class="flex flex-col">
	<div class="relative mt-[375px] h-[375px]">
		<div class="flex justify-center items-center">
			<Concentric color="magenta" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric styles="position: absolute; margin: -15px 6px 0 0" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric color="cyan" styles="position: absolute; margin: 5px 0 0 17px" />
		</div>
	</div>

	<div class="relative mt-[250px] h-[475px]">
		<div class="flex justify-center items-center">
			<Concentric color="yellow" styles="position: absolute;" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric color="cyan" styles="position: absolute; margin: -5px 0 0 17px" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric color="magenta" styles="position: absolute; margin: 5px 0 0 17px" />
		</div>
	</div>

	<div class="relative h-[375px] mt-[150px]">
		<div class="flex justify-center items-center">
			<Concentric color="cyan" styles="position: absolute;" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric color="magenta" styles="position: absolute; margin: -15px 6px 0 1px" />
		</div>
		<div class="flex justify-center items-center">
			<Concentric color="yellow" styles="position: absolute; margin: 5px 0 0 17px" />
		</div>
	</div>
</div>

<!-- <style>´
	p {
		color: #06b6d4;
		color: #d946ef;
		color: #eab308;

		color: rgb(255, 255, 0, 75%);
		color: rgb(0, 255, 255, 75%);
		color: rgb(255, 0, 255, 75%);
	}
</style> -->
