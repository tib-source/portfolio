<script lang="ts">
	import profilePic from '$lib/assets/me.jpeg';
	import background from '$lib/assets/background.jpeg';
	// import background from '$lib/assets/swirls.png';
	// import background from '$lib/assets/bg.jpg';
	import { fade, fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';

	let visible = $state(false);

	const toggle: Function = (state: boolean, value: boolean) => {
		state = value;
	};
</script>

<svelte:head>
	<link rel="preload" as="image" href={background} />
	<link rel="preload" as="image" href={profilePic} />
</svelte:head>

<main>
	<div class="intro">
		<div in:fly={{ x: -100, duration: 1000 }} class="text prevent-select">
			<h1>HELL</h1>
			<p>I'm <span>Tibebe</span>, welcome to my portfolio</p>
		</div>
		<img transition:fade class="me prevent-select" src={profilePic} alt="Me basking in the sun" />
	</div>
	<!-- <div class="buttons" in:fade={{ delay: 100 }}>
		<Button class="bg-[#e8d5c4] text-[#5a1e33] hover:bg-[#e8d5c4]/90 w-full sm:w-auto">My Projects</Button>
		<Button class="bg-[#e8d5c4] text-[#5a1e33] hover:bg-[#e8d5c4]/90 w-full sm:w-auto">About me</Button>
	</div> -->
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

	// .buttons{
	// 	font-family: sans-serif;
	// 	position: relative;
	// 	left: -2rem;
	// 	top:-1rem;
	// }
	.prevent-select {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}

	main {
		font-family: 'Londrina Solid', sans-serif;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;

		.intro {
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
					top: 14.75rem;
					left: 5rem;
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
