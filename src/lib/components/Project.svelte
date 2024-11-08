<script lang="ts">
    interface ProjectProps { 
        name: string, 
        description: string, 
        thumbnail: string
    }
    const { name, description, thumbnail } : ProjectProps  = $props()

</script>
<div class="project">
    <img src={thumbnail} alt="Thumbnail for Project">
    <div class="info">
        <p class="title">{name}</p>
        <span>{description}</span>
    </div>
</div>

<style lang="scss">
    .project{ 
        height: 300px;
        border-radius: 1rem;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0px 0px .1rem white;
        backdrop-filter: drop-shadow(4px 4px 10px black);
        box-shadow: inset 0 0 1rem rgba(255, 255, 255, 0.088);
        box-shadow:  0 0 1rem rgba(255, 255, 255, 0.06);
    }

    .project:hover{ 
        transform: scale(1.02);
    }

    img{ 
        width: 100%;
        height: 50%;
        object-fit: cover;
        border-bottom: 1px solid var(--secondary);
    }

    .info{ 
        padding: .2rem 1rem;
        font-weight: 100;
        
        .title{ 
            font-size: 2rem;
            color: var(--secondary);
            font-weight: 300;
        }

        span{
            opacity: 0.6;
        }

    }
</style>