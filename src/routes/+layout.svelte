<script lang="ts">
	import '../app.css';
	import background from '$lib/assets/background.webp';
	import { onMount } from 'svelte';
	import Shelf from '$lib/components/Shelf.svelte';
	import { browser } from '$app/environment';

	let visible = $state(false);
	let bgLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			visible = true;
		}, 100);
	});

	if (browser) {
		const img = new Image();
		img.src = background;
		img.onload = () => {
			bgLoaded = true;
		};
	}

	let { children } = $props();
</script>

<svelte:head>
	<!-- Preload only critical CSS first -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<!-- <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'"> -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
	/>

	<!-- Add metadata for better SEO and page load metrics -->
	<meta name="description" content="Tibebe Demissie's Portfolio - Software Engineer" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<main>
	{#if visible}
		{#if bgLoaded}
			<img src={background} class="background" alt="" fetchpriority="low" />
		{:else}
			<div class="background-placeholder"></div>
		{/if}

		{@render children()}
		<Shelf />
	{/if}
</main>

<style lang="scss">
	/* Load critical fonts first */
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

	/* Other fonts can be loaded lazily */
	:global(*) {
		color: white;
		--primary: #280d1e;
		--secondary: #fdbfa3;
		--secondary-light: #f7e1d7;
	}
	:global(html) {
		margin-left: calc(100vw - 100%);
		margin-right: 0;
		scrollbar-color: #fdbfa3 #39102a;
		scrollbar-width: thin;
	}
	:global(body) {
		background-color: var(--primary);
		font-family: 'Poppins', sans-serif;
	}
	:global(.buffer) {
		padding-top: 1rem;
		width: inherit;
	}

	.background,
	.background-placeholder {
		position: fixed;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		opacity: 0.4;
		z-index: -9999;
	}

	.background-placeholder {
		background-color: var(--primary);
	}

	.background {
		will-change: transform; /* Optimize for GPU acceleration */
	}

	main {
		position: relative;
		display: flex;
		justify-content: center;
	}
</style>
