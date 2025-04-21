<script lang="ts">
	import { fade } from 'svelte/transition';
	import code from '$lib/assets/icons/code.svg';

	export let education: Array<{
		degree: string;
		institution: string;
		period: string;
		description: string;
	}>;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade={{ delay: 300 }}>
	<h3 class="mb-6 flex items-center text-xl font-bold">
		<span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8d5c4]"></span>
		Education
	</h3>

	{#each education as edu, i}
		<div class="mb-6 {i === education.length - 1 ? '' : 'mb-6'}" in:fade={{ delay: 350 + i * 50 }}>
			<div class="mb-2 flex flex-col justify-between md:flex-row md:items-center">
				<h4 class="text-lg font-semibold">{edu.degree}</h4>
				<div class="flex items-center text-sm text-[#e8d5c4]/70">
					<img src={code} alt="Calendar" class="mr-1 h-3 w-3" />
					<span>{edu.period}</span>
				</div>
			</div>
			<h5 class="text-[#e8d5c4]/80">{edu.institution}</h5>
			<p class="mt-1 text-[#e8d5c4]/70">{edu.description}</p>
		</div>
	{/each}
</div>
