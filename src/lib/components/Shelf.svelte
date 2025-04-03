<script lang="ts" >
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import homeIcon from '$lib/assets/icons/home.svg';
	import resumeIcon from '$lib/assets/icons/profile.svg';
	import experienceIcon from '$lib/assets/icons/folder.svg';
	import github from '$lib/assets/icons/github.svg';
	import linkedin from '$lib/assets/icons/profile.svg';
	import { projectsVisible, contactVisible, resumeVisible, experienceVisible} from '$lib/store';
    interface Context {
        contactVisible: boolean;
        resumeVisible: boolean;
        experienceVisible: boolean;
        projectsVisible: boolean;
        toggle: Function;
    }

</script>

<section class="container" in:fly={{ y: 100, duration: 1000 }}>
	<div class="shelf">
		<Icon
			src={homeIcon}
			name="Projects"
			bounce={true}
			visibility={projectsVisible}
		/>
		<Icon
			src={experienceIcon}
			name="Experience"
			visibility={experienceVisible}
		/>
		<Icon
			src={resumeIcon}
			name="Resume"
            visibility={resumeVisible}
		/>
		<hr />
		<Icon
		src={github}
		name="GitHub"
		link="https://github.com/tib-source"
		/>
		<Icon
			src={linkedin}
			name="LinkedIn"
			link="https://www.linkedin.com/in/tibebe-d-41b421216/"
		/>
	</div>
</section>

<style>
	.container {
		position: absolute;
		bottom: 1rem;
	}
	.shelf {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		width: 20rem;
		padding: .3rem;
		border: 1px solid color-mix(in srgb, var(--secondary) 30%, transparent);
		border-radius: 3rem;
		background-color: color-mix(in srgb, var(--secondary) 20%, transparent);
			backdrop-filter: blur(1rem);

	}
</style>
