<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	let {
		width = 400,
		height = 300,
		top = 0,
		left = 0,
		visibility,
		background,
		children,
	}: {
		width: Number;
		height: Number;
		top?: Number;
		left?: Number;
		background? : string;
		children?: Snippet;
		visibility: Writable<boolean>;
	} = $props();
	let radius = $state(0.5);
	let mouseDown = $state(false);
	let mouseCoords = { x: 0, y: 0 };
	let initialOffset = { x: 0, y: 0 };
	let offset = $state({ x: 0, y: 0 });
	let draggableArea: HTMLElement;

	onMount(() => {
		window.addEventListener('mousedown', (e) => {
			if (e.target == draggableArea) {
				window.addEventListener('mousemove', handleMouseMove);
				toggleMouseDown(e, true);
			}
		});

		window.addEventListener('mouseup', (e) => {
			toggleMouseDown(e, false);
		});
	});

	const toggleMouseDown = (e: MouseEvent, value: boolean) => {
		mouseDown = value;
		if (mouseDown) {
			mouseCoords = {
				x: e.clientX,
				y: e.clientY
			};

			initialOffset = { ...offset };
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (mouseDown) {
			offset = {
				x: initialOffset.x + (e.clientX - mouseCoords.x),
				y: initialOffset.y + (e.clientY - mouseCoords.y)
			};
		}
	};

	const handleClose = () => {
		visibility.set(false);
	};
</script>

<div
	class="window_container"
	style="
		display: {$visibility ? 'block' : 'none'};
		--background-window: url({background});
		--width:{width}px;
		--height:{height}px;
		--top:{top}px;
		--left:{left}px;
		--radius:{radius}rem;
		--xOffset: {offset.x}px;
		--yOffset: {offset.y}px;
		"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div onmouseup={(e) => toggleMouseDown(e, false)} bind:this={draggableArea} class="helmet">
		<div class="close" onclick={handleClose}></div>
	</div>
	<div class="window">
		{#if children}
			{@render children()}
		{/if}
	</div>

</div>

<style>
	.window_container {
		width: var(--width);
		height: var(--height);
		top: var(--top);
		left: var(--left);
		transform: translate(var(--xOffset), var(--yOffset));
		background: var(--primary);
		position: absolute;
		backdrop-filter: blur(20px);
		margin: 0.25rem;
		border-radius: 0 0 var(--radius) var(--radius);
		border: 1px solid rgba(255, 255, 255, 0.216);
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.193);
		background-image: var(--background-window);
	}
	.window {
		overflow-y: auto;
		width: 100%;
		height: 100%;
		scrollbar-color: var(--secondary) transparent;
		scrollbar-width: thin;
	}

	.helmet {
		width: 100%;
		background-color: white;
		height: 20px;
		border-radius: var(--radius) var(--radius) 0 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		top: -20px;
	}

	.close {
		width: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 0.5rem;
		aspect-ratio: 1;
		background-color: red;
		border-radius: 50%;
	}

	.close:hover {
		cursor: pointer;
	}

	.helmet:active {
		cursor: grab;
	}
</style>
