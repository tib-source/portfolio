<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import type { Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let {
		src,
		name,
		bounce,
		visibility,
		link
	}: { src: string; name: string; bounce?: boolean; visibility?: Writable<boolean>; link?: string } = $props();

	let isBouncing = $state(false);
	let toolTipVisible = $state(false);
	onMount(() => {
		setTimeout(() => {
			if (bounce) {
				isBouncing = true;
			}
		}, 3000); // 3-second delay before the animation starts
	});
	let coords = spring({ x: 50, y: 100 });

	const handleHover = () => {
		isBouncing = false;
		toolTipVisible = true;
	};
	const handleBounce = () => {
		coords.set({ x: 0, y: 0 });
		coords.set({ x: 0, y: 100 });
		coords.set({ x: 0, y: 100 });
	};

	const handleOpenWindow = () => {
		if(visibility){
				isBouncing = false
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

<div class="icon {isBouncing ? 'bouncing' : ''}" >
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
	{#if toolTipVisible}
		<p in:fly={{ y: 10, duration: 100 }} class="tooltip">{name}</p>
	{/if}
</div>

<style>
	:root {
		--tooltip: var(--secondary);
		--color: black;
	}
	.icon {
		height: fit-content;
		width: fit-content;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 1rem;
	}

	img {
		width: 50px;
		box-shadow: 0 0 .2rem var(--secondary);
		background-color: white;
		padding: 0.4rem;
		object-fit: contain;
		transition: 300ms;
		cursor: pointer;
		border-radius: 1rem;

	}

	img:hover {
		background-color: rgba(255, 255, 255, 0.519);
	}
	.tooltip {
		position: absolute;
		top: -2.5rem;
		background-color: var(--tooltip);
		border-radius: 1rem;
		padding: 0.5rem;
		font-size: 1rem;
		font-weight: 100;
		letter-spacing: 0.05rem;
		color: var(--color);
		opacity: 7 5%;
	}

	.tooltip::after {
		content: ' ';
		position: absolute;
		top: 100%; /* At the bottom of the tooltip */
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: var(--tooltip) transparent transparent transparent;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-20px);
		}
		60% {
			transform: translateY(-10px);
		}
	}

	.bouncing {
		animation: bounce 2s ease infinite;
	}
</style>
