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
<Window {width} {height} {top} {left} {visibility} background={"/src/lib/assets/swirls.png"} >

<div class="container">
    <h1>Projects</h1>
    <hr>
    <div class="project_list">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>
    <div class="buffer"></div>

</div>


</Window>


<style>
    .container{ 
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 3rem;
        gap: 1rem;
        background-repeat:repeat;
    }

    .project_list{
        width: 550px;
        aspect-ratio: 4/4;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: center;
        align-content: center;
        gap: 2rem;
    }
    h1{ 
        letter-spacing: 1px;
        font-weight: 100;
    }
    hr{ 
        width: 100%;
        margin-bottom: 1rem;
    }

    .item{
        width: 100%;
        aspect-ratio: 1;
        margin: auto;
		background: color-mix(in srgb, var(--primary) 20%, transparent);
		backdrop-filter: blur(20px);
		box-shadow: 0 0 .1rem var(--secondary);
        transition: 300ms;
    }

    .item:hover{ 
        transform: scale(1.02);


    }


</style>