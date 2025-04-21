<script lang="ts">
	import '../app.css';
	import profilePic from '$lib/assets/me.jpeg';
	import background from '$lib/assets/background.jpeg';
	import { onMount } from 'svelte';
	import Shelf from '$lib/components/Shelf.svelte';

	let visible = $state(false);

	const toggle: Function = (state: boolean, value: boolean) => {
		state = value;
	};

	onMount(() => setTimeout(() => (visible = true), 0));

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="image" href={background} />
	<link rel="preload" as="image" href={profilePic} />
</svelte:head>

<main>
	{#if visible}
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src={background} class="background" />
		{@render children()}
		<Shelf />
	{/if}
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

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
		// This is used by elements using the window class, it gives no space at the bottom
		// so each of them have a div.buffer that takes in this css to give them a 1rem padding
		// TODO: improve this hacky solution.
		padding-top: 1rem;
		width: inherit;
	}

	.background {
		position: absolute;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		opacity: 0.4;
		z-index: -9999;
		position: fixed;
	}

	main {
		position: relative;
		display: flex;
		justify-content: center;
	}
</style>
