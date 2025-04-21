<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import homeIcon from '$lib/assets/icons/home.svg';
	import resumeIcon from '$lib/assets/icons/profile.svg';
	import experienceIcon from '$lib/assets/icons/folder.svg';
	import github from '$lib/assets/icons/github.svg';
	import linkedin from '$lib/assets/icons/linkedin.svg';

	import { page } from '$app/stores';
</script>

<!-- <section class="container" in:fly={ animate ? { y: 100, duration: 300 } : {}}> -->
<section class="container">
	<div class="shelf">
		<Icon src={homeIcon} name="Home" link="" active={$page.url.pathname === '/'} />
		<Icon
			src={experienceIcon}
			name="Projects"
			link="projects"
			active={$page.url.pathname === '/projects'}
		/>
		<Icon src={resumeIcon} name="About" link="about" active={$page.url.pathname === '/about'} />
		<hr />
		<Icon src={github} name="GitHub" link="https://github.com/tib-source" external={true} />
		<Icon
			src={linkedin}
			name="LinkedIn"
			link="https://www.linkedin.com/in/tibebe-d-41b421216/"
			external={true}
		/>
	</div>
</section>

<style>
	.container {
		width: 100%;
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 1rem;
	}
	.shelf {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem;
		border-radius: 3rem;
		border: 1px solid color-mix(in srgb, var(--secondary) 30%, transparent);
		background-color: color-mix(in srgb, var(--secondary) 20%, transparent);
		backdrop-filter: blur(5rem);
	}
	hr {
		width: 1px;
		height: 2rem;
		background-color: color-mix(in srgb, var(--secondary) 30%, transparent);
		border: none;
	}
</style>
