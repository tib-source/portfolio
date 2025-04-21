<script lang="ts">
	import { spring } from 'svelte/motion';
	import type { Writable } from 'svelte/store';

	let {
		src,
		name,
		link,
		active = false,
		external = false
	}: { src: string; name: string; active?: boolean; link: string; external?: boolean } = $props();

	let toolTipVisible = $state(false);

	let coords = spring({ x: 50, y: 100 });

	const handleHover = () => {
		toolTipVisible = true;
	};
</script>

<div class={`icon ${active && 'active'}`}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<a href={external ? link : `/${link}`} target={external ? '_blank' : '_self'}>
		<img
			onmouseover={handleHover}
			onfocus={handleHover}
			onmouseleave={() => (toolTipVisible = true)}
			{src}
			alt="{name} icon"
		/>
	</a>
</div>

<style>
	:root {
		--tooltip: var(--secondary);
		--color: black;
	}
	.icon {
		height: 40px;
		width: 40px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
		transition: 100ms;
	}

	.icon:hover,
	.active {
		background-color: color-mix(in srgb, var(--secondary) 30%, transparent);
		backdrop-filter: blur(1rem);
		opacity: 1;
	}
	.icon a {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		aspect-ratio: 1;
		object-fit: contain;
		padding: 0.2rem;
		opacity: 0.8;
		transition: 10ms;
	}

	.icon a:hover {
		opacity: 1;
		color: white;
	}
</style>
