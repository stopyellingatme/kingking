<script>
	export let with_swatch = false;
	// Take a title
	export let title = "CUSTOM";
	// Take an initial color
	export let color = "#ffffff";
	// Set up an array of colors
	let colors = [
		"#f20019",
		"#33137a",
		"#161415",
		"#222423",
		"#0333b4",
		"#015ad5",
		"#00a6f1",
		"#97d7e9",
		"#f9f5f2",
		"#f9f5f2",
		"#fbbd00",
		"#f76d02",
		"#f20019",
		"#770e7d",
		"#222423",
		"#161415",
		"#1c2121",
		"#0333b4",
		"#015ad5",
		"#00a6f1"
	];
	// Convert the array of colors to a string
	let color_string = colors.join(", ");
	// Make the color string an observable
	$: _colors = color_string.split(", ");

	function addColor() {
		colors.push(color);
		// Re-make the color string because things aren't responsive, otherwise
		color_string = colors.join(", ");
	}

	function removeColor(color) {
		colors.splice(colors.indexOf(color), 1);
		color_string = colors.join(", ");
	}

	function changeColor(ev, color) {
		colors[colors.indexOf(color)] = ev.target.value;
		color_string = colors.join(", ");
	}
</script>

<div>
	<span class="text-xl">{title}</span>
	{#if with_swatch}
		<div>
			<span
				><input
					class="border-2 border-gray-200 rounded dark:border-grey-700 dark:bg-black"
					bind:value={color}
					type="color"
				/>
				<button class="px-2 py-1 m-4 text-white rounded bg-stone-700" on:click={() => addColor()}
					>ADD COLOR</button
				></span
			>
		</div>
		<div class="flex flex-wrap justify-start w-full pb-4">
			{#each _colors as _color}
				<div>
					<div class="flex items-center justify-center">
						<input
							class="border-2 border-gray-200 rounded dark:border-gray-700 dark:bg-black"
              value={_color}
							on:change={(ev) => changeColor(ev, _color)}
							type="color"
						/>
						<span
							class="pl-1 pr-4 text-xl cursor-pointer dark:text-white"
							on:click={() => removeColor(_color)}>X</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div
		style="background-image: linear-gradient(to right, {color_string})"
		class="w-full h-8 my-1 rounded"
	/>
</div>
