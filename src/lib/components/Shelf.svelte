<script lang="ts" >
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import projectIcon from '$lib/assets/icons/project.png';
	import resumeIcon from '$lib/assets/icons/cv.png';
	import experienceIcon from '$lib/assets/icons/experience.png';
	import github from '$lib/assets/icons/github.svg';
	import linkedin from '$lib/assets/icons/linkedin.svg';
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
			src={projectIcon}
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
		height: 4.5rem;
		background-color: var(--primary);
		box-shadow:
			0 0 0.15rem rgba(255, 255, 255, 0.354),
			0 0 1rem rgba(255, 255, 255, 0.134);
		border-radius: 0.7rem;
		background-color: color-mix(in srgb, var(--primary) 80%, transparent);
	}
</style>
