<script lang="ts">
    let { src, name } : { src: string, name: string} = $props();
</script>

<div class="icon">
    <img src={src} alt="{name} icon" >
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
        background-color: white;
        padding: 0.5rem;
        border-radius: 1rem;
        object-fit: cover;
        width: 50px;
    
    }

    p{
        font-size: 1rem;
        font-weight: 100;
        letter-spacing: .05rem;
    }


</style>