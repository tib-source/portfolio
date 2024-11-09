<script lang="ts">
	import type { Writable } from "svelte/store";
    import background from "$lib/assets/swirls.png"
	import Window from "../components/Window.svelte";
	import Project from "$lib/components/Project.svelte";
	import lumin from "$lib/assets/projects/lumin.png";
	import grim from "$lib/assets/projects/grim_repoer.png";
	import ergon from "$lib/assets/projects/ergon.png";
	import portfolio from "$lib/assets/background.jpeg";
	let {
		width,
		height ,
		top ,
		left ,
        visibility,
	}: { width: Number; height: Number; top?: Number; left?: Number; visibility: Writable<boolean>} = $props();
</script>
<Window {width} {height} {top} {left} {visibility} {background} >

<div class="container">
    <h1>Projects</h1>
    <hr>
    <div class="project_list">
        <Project name="Grim Repoer" description="An amazing project" thumbnail={grim} />
        <Project name="Ergon" description="An amazing project" thumbnail={ergon} />
        <Project name="${"{this}"}" description="An amazing project" thumbnail={portfolio} />
        <Project name="Lumin" description="An amazing project" thumbnail={lumin} />
        <Project name="${"{this}"}" description="An amazing project" thumbnail={portfolio} />
        <Project name="${"{this}"}" description="An amazing project" thumbnail={portfolio} />

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


</style>