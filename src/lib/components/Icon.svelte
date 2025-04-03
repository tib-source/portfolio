<script lang="ts">
	import { browser } from '$app/environment';
	import { spring } from 'svelte/motion';
	import type { Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let {
		src,
		name,
		visibility,
		link
	}: { src: string; name: string; visibility?: Writable<boolean>; link?: string } = $props();

	let toolTipVisible = $state(false);

	let coords = spring({ x: 50, y: 100 });

	const handleHover = () => {
		toolTipVisible = true;
	};


	const handleOpenWindow = () => {
		if(visibility){
			if ($visibility) {
				visibility.set(false);
			} else {
				visibility.set(true);
			}
		}else {
			if(browser){
				window.open(link, '_blank');
			}
		}
	};
</script>

<div class="icon" >
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		onmouseover={handleHover}
		onfocus={handleHover}
		onmouseleave={() => (toolTipVisible = false)}
		onclick={handleOpenWindow}
		{src}
		alt="{name} icon"
	/>
</div>

<style>
	:root {
		--tooltip: var(--secondary);
		--color: black;
	}
	.icon {
		height: 50px;
		width: 50px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
		transition: 100ms;

	}

	.icon:hover, .active {
		background-color: color-mix(in srgb,  var(--secondary) 30%, transparent);
		backdrop-filter: blur(1rem);
		opacity: 1;
	}
	.icon img {
		width: 35px;;
		aspect-ratio: 1;
		object-fit: contain;
		padding: .2rem;
		opacity: 0.8;
		transition: 10ms;

	}

	.icon img:hover{
		opacity: 1;
		color: white;
	}


</style>
