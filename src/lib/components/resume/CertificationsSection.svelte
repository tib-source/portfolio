<script lang="ts">
	import { fade } from 'svelte/transition';

	export let certifications: Array<{
		title: string;
		organization: string;
	}>;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade={{ delay: 700 }}>
	<h3 class="mb-6 flex items-center text-xl font-bold">
		<span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8d5c4]"></span>
		Certifications & Awards
	</h3>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each certifications as cert, i}
			<div in:fade={{ delay: 750 + i * 50 }}>
				<h4 class="font-medium">{cert.title}</h4>
				<p class="text-sm text-[#e8d5c4]/70">{cert.organization}</p>
			</div>
		{/each}
	</div>
</div>
