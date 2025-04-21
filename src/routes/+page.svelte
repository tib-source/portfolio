<script lang="ts">
	import profilePic from '$lib/assets/me.jpeg';
	import { fade, fly } from 'svelte/transition';
</script>

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
					font-size: 13rem;
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

	@media (max-width: 768px) {
		main {
			.intro {
				display: flex;

				.me {
					position: relative;
					width: 150px;
					top: -2rem;
					left: 3rem;
					aspect-ratio: 1 / 1;
				}
				.text {
					width: 80px;
					h1 {
						font-size: 5rem;
						letter-spacing: 0.5rem;
						text-shadow: 0 0 10px rgba(255, 255, 255, 0.435);
					}
					P {
						top: 6rem;
						left: 1rem;
						font-size: 1rem;
					}
				}
			}
		}
	}
</style>
