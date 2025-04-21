<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import Project from '../Project.svelte';
	import type { project } from '$lib/projects';
	import Title from './Title.svelte';

	export let projects: Array<project>;
</script>

<div class="p-8" in:fade={{ delay: 950 }}>
	<Title title={"Featured Projects"}/>


	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each projects as project, i}
			<Project
				name={project.name}
				description={project.description}
				thumbnail={project.image}
				source={project.source}
				link={project.link}
			/>
		{/each}
	</div>

	<div class="mt-8 text-center">
		<Button class="bg-[#e8d5c4] text-[#5a1e33] hover:bg-[#e8d5c4]/90">
			<a href="/projects"> View All Projects </a>
		</Button>
	</div>
</div>
