<script lang="ts">
	import type { Writable } from "svelte/store";
	import document from "$lib/assets/document/placeholder_pdf.pdf"
	import Window from "../components/Window.svelte";
	let {
		width,
		height ,
		top ,
		left ,
        visibility,
	}: { width: Number; height: Number; top?: Number; left?: Number; visibility: Writable<boolean>} = $props();
</script>

<Window {width} {height} {top} {left} {visibility} >
    <embed src="{document}" width={`${width}`} height={`${height}`} />
</Window>

<style>
    embed{
        padding: .1rem;
        vertical-align:bottom;
        width: 100%;
        height: 100%;
    }
</style>