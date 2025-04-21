<script lang="ts">
	import { fade } from 'svelte/transition';
	import Title from './Title.svelte';

	export let certifications: Array<{
		title: string;
		organization: string;
	}>;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade={{ delay: 700 }}>
	<Title title={'Certificate Awards'} />

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each certifications as cert, i}
			<div in:fade={{ delay: 750 + i * 50 }}>
				<h4 class="font-medium">{cert.title}</h4>
				<p class="text-sm text-[#e8d5c4]/70">{cert.organization}</p>
			</div>
		{/each}
	</div>
</div>
