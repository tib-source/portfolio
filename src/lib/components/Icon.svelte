<script lang="ts">
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";
	import { fly } from "svelte/transition";

    let { src, name, bounce} : { src: string, name: string, bounce?: boolean} = $props();

    let clicked = $state(false)
    let isBouncing = $state(false);
    let toolTipVisible = $state(true);
    onMount(() => {
        setTimeout(() => {
            if(bounce){ isBouncing = true;}
        }, 3000); // 3-second delay before the animation starts
    });
    let coords = spring({ x: 50, y: 100 });

    const handleHover = () => { 
        isBouncing = false;
        toolTipVisible = true;
    }
    const handleBounce = () => {
        coords.set({ x: 0, y: 0})
        coords.set({ x: 0, y: 100})
        coords.set({ x: 0, y: 100})
    }
    
</script>

<div class="icon">
    <img onmouseover={handleHover} onfocus={handleHover} onmouseleave={()=> toolTipVisible=false} class={isBouncing ? "bouncing" : ""} src={src} alt="{name} icon" >
    {#if toolTipVisible}
        <p in:fly={{y:10, duration:100}} class="tooltip">{name}</p>
    {/if}
</div>

<style>

    :root{ 
        --tooltip: var(--secondary);
        --color: black;
    }
    .icon{
        position: relative;
        width: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    img{
        background-color: var(--secondary);
        padding: 0.5rem;
        border-radius: 1rem;
        object-fit: cover;
        width: 50px;
        transition: 300ms;
        cursor: pointer;
    }

    img:hover{ 
        background-color: rgba(255, 255, 255, 0.519);
    }
    p{
        position: absolute;
        top: -4.5rem;
        background-color:  var(--tooltip);
        border-radius: 1rem;
        padding: .5rem;
        font-size: 1rem;
        font-weight: 100;
        letter-spacing: .05rem;
        color: var(--color);
        opacity: 50%;
    }

    p::after {
        content: " ";
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--tooltip) transparent transparent transparent;
    }

    @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }

    .bouncing {
        animation: bounce 2s ease infinite;
    }

</style>