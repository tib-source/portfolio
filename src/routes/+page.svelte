<script lang="ts">
	import profilePic from '$lib/assets/me.jpeg';
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
			<h1 in:fly={{ x: -100, duration: 500, delay: 100 }}>HELL</h1>
			<p in:fly={{ x: -100, duration: 500, delay: 0 }}>
				I'm <span>Tibebe</span>, welcome to my portfolio
			</p>
		</div>

		{#if imageLoaded}
			<img
				class="me prevent-select"
				src={profilePic}
				alt="Me basking in the sun"
				width="300"
				height="300"
				loading="lazy"
				decoding="async"
				in:fade={{ duration: 300 }}
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
		width: 100%;
		font-family: 'Londrina Solid', sans-serif;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;
		contain: content;

		.intro {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			color: white;
			will-change: transform;

			.me,
			.me-placeholder {
				z-index: -100;
				width: 300px;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
				box-shadow:
					0.75rem 0 var(--secondary),
					0rem 0 10rem color-mix(in srgb, var(--secondary) 30%, transparent);
				border: 0.25rem solid white;
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
				display: flex;

				.me,
				.me-placeholder {
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
