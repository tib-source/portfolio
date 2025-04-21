<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Badge } from '$lib/components/ui/badge';
	import Title from './Title.svelte';

	export let skills: Array<{
		category: string;
		items: string[];
	}>;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade={{ delay: 450 }}>
	<Title title={'Skills'} />

	<div class="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
		{#each skills as skillGroup, i}
			<div in:fade={{ delay: 500 + i * 50 }}>
				<h4 class="mb-3 font-medium">{skillGroup.category}</h4>
				<div class="flex flex-wrap gap-2">
					{#each skillGroup.items as skill}
						<Badge class="bg-[#e8d5c4]/20 text-[#e8d5c4] hover:bg-[#e8d5c4]/30">{skill}</Badge>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
