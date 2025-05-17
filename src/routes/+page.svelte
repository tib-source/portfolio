<script lang="ts">
	import profilePic from '$lib/assets/me.webp';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let imageLoaded = false;

	onMount(() => {
		// Preload the profile image
		if (document.readyState === 'complete') {
			imageLoaded = true;
		} else {
			window.addEventListener('load', () => {
				imageLoaded = true;
			});
		}
	});
</script>

<main>
	<div class="intro">
		<div class="text prevent-select">
			<div class="hello">
				<h1 in:fly={{ x: -100, duration: 500, delay: 50 }}>H</h1>
				<h1 in:fly={{ x: -100, duration: 500, delay: 100 }}>E</h1>
				<h1 in:fly={{ x: -100, duration: 500, delay: 150 }}>L</h1>
				<h1 in:fly={{ x: -100, duration: 500, delay: 200 }}>L</h1>
			</div>
			<p in:fly={{ x: -100, duration: 500, delay: 0 }}>
				I'm <span>Tibebe</span>, A Software Engineer based in London
			</p>
		</div>

		{#if imageLoaded}
			<img
				class="me prevent-select"
				src={profilePic}
				alt="Me basking in the sun"
				loading="lazy"
				decoding="async"
				in:fly={{ x: -100, duration: 500, delay: 250 }}
			/>
		{:else}
			<div class="me-placeholder prevent-select"></div>
		{/if}
	</div>
</main>

<style lang="scss">
	.prevent-select {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	main {
		font-family: 'Londrina Solid', sans-serif;
		display: flex;
		flex-direction: column;
		margin: auto;
		justify-content: center;
		align-items: center;
		height: 80vh;
		contain: content;

		.intro {
			padding: 4rem;
			display: flex;
			justify-content: center;
			align-items: center;
			align-items: center;
			color: white;
			will-change: transform;

			.hello{ 
				display: flex;
			}

			.me,
			.me-placeholder {
				z-index: -100;
				width: 190px;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
				box-shadow:
					0.75rem 0 var(--secondary),
					0rem 0 10rem color-mix(in srgb, var(--secondary) 30%, transparent);
				border: .25rem solid white;
			}

			.me-placeholder {
				background-color: var(--primary);
				opacity: 0.6;
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
					top: 15rem;
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
				gap: 2rem;
				position: relative;
				.me{
					width: 90px;
					margin-bottom: -1rem;
				}
				.text {					
					width: 150px;
					justify-content: center;
					h1 {
						font-size: 6rem;
						letter-spacing: 0.15rem;
						text-shadow: 0 0 10px rgba(255, 255, 255, 0.435);
						margin-bottom: -1.5rem;
					}
					P {
						top: 7rem;
						left: 0rem;
						font-size: .85rem;
					}
				}
			}
		}
	}
</style>
