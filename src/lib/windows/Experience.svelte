<script lang="ts">
	import type { Writable } from "svelte/store";
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
    <div>
        <h1>This is still a work in progress...</h1>
    </div>   
</Window>

<style>
    div{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: auto;
    }

    h1{
        font-weight: 100;
    }
</style>