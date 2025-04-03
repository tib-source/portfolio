<script lang="ts">
	import type { Writable } from "svelte/store";
	import Window from "../components/Window.svelte";
    import github from "$lib/assets/icons/github.svg"
    import linkedin from "$lib/assets/icons/profile.svg"
    import email from "$lib/assets/icons/home.svg"
	let {
		width,
		height ,
		top ,
		left ,
        visibility,
	}: { width: Number; height: Number; top?: Number; left?: Number; visibility: Writable<boolean>} = $props();
</script>

<Window {width} {height} {top} {left} {visibility} >
    <div class="contact">
        
        <img src="{github}" alt="Github Icon">
        <img src="{linkedin}" alt="Linkedin Icon">
        <img src="{email}" alt="Email Icon">

    </div>
</Window>

<style>

    .contact{
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    img{
        width: 55px;
        height: 55px;
        object-fit: contain;
        box-shadow: 0 0 .2rem var(--secondary);
        border-radius: 1rem;
    }

</style>