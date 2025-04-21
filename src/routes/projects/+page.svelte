<script lang="ts">
	import Project from '$lib/components/Project.svelte';
	import lumin from '$lib/assets/projects/lumin.png';
	import grim from '$lib/assets/projects/grim_repoer.png';
	import ergon from '$lib/assets/projects/ergon.png';
	import portfolio from '$lib/assets/background.jpeg';

	import projects from '$lib/projects';
</script>

<div class="container flex flex-col bg-[var(--primary-dark)] p-8 py-16 md:py-24">
	<div class="container mx-auto">
		<h1 class="font-regular mb-7 text-center text-[var(--secondary-light)] md:text-7xl">
			Projects
		</h1>
	</div>
	<div class="project_list">
		{#each projects as project}
			<Project
				name={project.name}
				description={project.description}
				tech={project.tech}
				thumbnail={project.image}
				link={project.link}
				source={project.source}
			/>
		{/each}
	</div>
	<div class="buffer"></div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.project_list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		width: 100%;
		max-width: 1100px;
		justify-content: center;
		align-content: center;
	}
</style>
