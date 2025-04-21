<script lang="ts">
	import { fade } from 'svelte/transition';

	export let summary: string;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade>
	<h3 class="mb-4 flex items-center text-xl font-bold">
		<span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8d5c4]"></span>
		Professional Summary
	</h3>
	<p class="leading-relaxed text-[#e8d5c4]/80">
		{summary}
	</p>
</div>
