<script lang="ts">
	import profilePic from '$lib/assets/me.jpeg';
	import background from '$lib/assets/background.jpeg';
	// import background from '$lib/assets/swirls.png';
	// import background from '$lib/assets/bg.jpg';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Shelf from '$lib/components/Shelf.svelte';
	import Window from '$lib/components/Window.svelte';
	import { projectsVisible, contactVisible, resumeVisible, experienceVisible} from '$lib/store';
	import Projects from '$lib/windows/Projects.svelte';

	let visible = $state(false);
    
    
	const toggle: Function = (state: boolean, value: boolean) => {
		state = value;
	};

	onMount(() => setTimeout(() => (visible = true), 10));
</script>

<main style="--bg: url('{background}') ;">
	{#if visible}
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src={background} class="background" />

		<div class="intro">
			<div in:fly={{ x: -100, duration: 1000 }} class="text">
				<h1>HELL</h1>
				<p>I'm <span>Tibebe</span>, A Software Dev based in London</p>
			</div>
			<img transition:fade class="me prevent-select" src={profilePic} alt="Me basking in the sun" />
		</div>
		<Projects width={700} height={500} top={100} left={700} visibility={projectsVisible} />
		<Window width={400} height={300} top={60} left={230} visibility={experienceVisible} />
		<Window width={300} height={100} top={700} left={1000} visibility={resumeVisible} />
		<Window width={500} height={100} top={600} left={400} visibility={contactVisible} />
		<Shelf />
	{/if}
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Londrina Solid', sans-serif;
		color: white;
		--primary: #280d1e;
		--secondary: #fdbfa3;
	}

	:global(body) {
		width: 100vw;
		height: 100vh;
		background-color: var(--primary);

	}
	:global(.buffer){ 
		// This is used by elements using the window class, it gives no space at the bottom
		// so each of them have a div.buffer that takes in this css to give them a 1rem padding
		// TODO: improve this hacky solution.
        padding-top: 1rem;
        width: inherit;    
	}

	.prevent-select {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}

	main {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		// background-color: var(--primary);
        // background-image: var(--bg);
        // background-size: cover;
        // background-position: center;
        // background-repeat: no-repeat;
        // background-blend-mode: overlay;


		.background {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: cover;
			opacity: 0.4;
			z-index: -9999;
		}

		.intro {
			pointer-events: none;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			color: white;
			.me {
				z-index: -100;
				width: 300px;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
				box-shadow:
					0.75rem 0 var(--secondary),
					0rem 0 10rem color-mix(in srgb, var(--secondary) 30%, transparent);
				border: 0.25rem solid white;
			}

			.text {
				position: relative;
				width: 400px;
				h1 {
					letter-spacing: 1rem;
					font-size: 200px;
					text-shadow: 0 0 10px rgba(255, 255, 255, 0.435);
				}

				P {
					width: max-content;
					position: absolute;
					top: 12.5rem;
					left: 4rem;
					font-size: 1.5rem;
					font-weight: 200;
					letter-spacing: 1px;
					text-shadow: 0 0 10px rgba(0, 0, 0, 0.385);
				}

				span {
					font-weight: 250;
					color: var(--secondary);
					text-shadow: 0 0 10px rgba(255, 255, 255, 0.435);
				}
			}
		}
	}
</style>
