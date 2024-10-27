<script>
    import profilePic from "$lib/assets/me.jpeg";
    import background from "$lib/assets/background.jpeg";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

    let visible = $state(false)

    onMount(() =>
        setTimeout(() => visible = true, 10)
    )
</script>
<main>
    {#if visible}
    <!-- svelte-ignore a11y_missing_attribute -->
    <img src={background} class="background">

    <div class="intro">
        <div in:fly={{ x: -100, duration: 1000 }} class="text">
            <h1  >HELL</h1>
            <p>I'm <span>Tibebe</span>, A Software Dev based in London</p>
        </div>
        <img transition:fade class="me prevent-select" src={profilePic} alt="Me basking in the sun">
    </div>

    {/if}
</main>
<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

    :global(*){ 
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Londrina Solid", sans-serif;

        --primary: #280D1E;
        --secondary: #a1fff9;
    }

    :global(body){
        width:100vw;
        height: 100vh;
        background-color: var(--primary);

    }

    .prevent-select{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    main{ 
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;

        .background{
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit:cover;
            opacity: 0.3;
            z-index: -9999;
        }

        .intro{
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            color: white;
            .me{ 
                width: 300px;
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                border-bottom: .25rem solid var(--secondary);
            }

            .text{
                position: relative;
                width: 400px;
                h1{ 
                    letter-spacing: 1rem;
                    font-size: 200px;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.435);
                }


                P{
                    width: max-content;
                    position:absolute;
                    top: 12.5rem;
                    left: 4rem;
                    font-size: 1.5rem;
                    font-weight: 200;
                    letter-spacing: 1px;
                    text-shadow: 0 0 10px black;
                }

                span{
                    font-weight: 250;
                    color: var(--secondary);
                }
            }
        }
    }



    
</style>