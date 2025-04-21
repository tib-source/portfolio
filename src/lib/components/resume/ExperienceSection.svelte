<script lang="ts">
	import { fade } from 'svelte/transition';
	import code from '$lib/assets/icons/code.svg';
	import { Badge } from '$lib/components/ui/badge';
	import Title from './Title.svelte';

	export let experience: Array<{
		position: string;
		company: string;
		period: string;
		achievements: string[];
		skills: string[];
	}>;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade={{ delay: 100 }}>
	<Title title="Work Experience"/>


	{#each experience as job, i}
		<div class="mb-8 {i === experience.length - 1 ? '' : 'mb-8'}" in:fade={{ delay: 150 + i * 50 }}>
			<div class="mb-2 flex flex-col justify-between md:flex-row md:items-center">
				<h4 class="text-lg font-semibold">{job.position}</h4>
				<div class="flex items-center text-sm text-[#e8d5c4]/70">
					<img src={code} alt="Calendar" class="mr-1 h-3 w-3" />
					<span>{job.period}</span>
				</div>
			</div>
			<h5 class="mb-2 text-[#e8d5c4]/80">{job.company}</h5>
			<ul class="ml-1 list-inside list-disc space-y-1 text-[#e8d5c4]/70">
				{#each job.achievements as achievement}
					<li>{achievement}</li>
				{/each}
			</ul>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each job.skills as skill}
					<Badge variant="outline" class="border-[#e8d5c4]/20 text-[#e8d5c4]/70">
						{skill}
					</Badge>
				{/each}
			</div>
		</div>
	{/each}
</div>
