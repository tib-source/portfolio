<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import Project from '../Project.svelte';
	import type { project } from '$lib/projects';

	export let projects: Array<project>;
</script>

<div class="p-8" in:fade={{ delay: 950 }}>
	<h3 class="mb-6 flex items-center text-xl font-bold">
		<span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8d5c4]"></span>
		Featured Projects
	</h3>

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
