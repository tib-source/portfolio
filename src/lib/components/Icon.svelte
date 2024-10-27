<script lang="ts">
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";

    let { src, name, bounce} : { src: string, name: string, bounce?: boolean} = $props();

    let clicked = $state(false)
    let isBouncing = $state(false);

    onMount(() => {
        setTimeout(() => {
            if(bounce){ isBouncing = true;}
        }, 3000); // 3-second delay before the animation starts
    });
    let coords = spring({ x: 50, y: 100 });

    const handleBounce = () => {
        coords.set({ x: 0, y: 0})
        coords.set({ x: 0, y: 100})
        coords.set({ x: 0, y: 100})
    }
    
</script>

<div class="icon">
    <img class={isBouncing ? "bouncing" : ""} src={src} alt="{name} icon" >
</div>

<style>
    .icon{
        position: relative;
        width: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    img{
        position: absolute;
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
        font-size: 1rem;
        font-weight: 100;
        letter-spacing: .05rem;
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