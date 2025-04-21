<script lang="ts">
	import { fade } from 'svelte/transition';
	import Title from './Title.svelte';

	export let summary: string;
</script>

<div class="border-b border-[#e8d5c4]/10 p-8" in:fade>
	<Title title={"About Me"}/>

	<p class="leading-relaxed">
		{summary}
	</p>
</div>
