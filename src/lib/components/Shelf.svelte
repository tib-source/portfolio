<script>

	import { fly } from "svelte/transition";
	import Icon from "./Icon.svelte";
    import projectIcon from "$lib/assets/icons/project.png"
    import resumeIcon from "$lib/assets/icons/cv.png"
    import experienceIcon from "$lib/assets/icons/experience.png"
    import contactIcon from "$lib/assets/icons/contact.png"


</script>
<section class="container" in:fly={{y:100, duration:1000}}>
    <div class="shelf">
        <Icon src={projectIcon} name="Project" bounce={true} />
        <Icon src={experienceIcon} name="Contact" />
        <Icon src={contactIcon} name="meow" />

        <hr>
        <Icon src={resumeIcon} name="Resume" />

    </div>
</section>

<style>
    .container{
        position: absolute;
        bottom: 1rem;
    }
    .shelf{
        padding: 2.3rem 1rem;
        display: flex;
        justify-content: space-between;
        width: 18rem;
        height: 4rem;
        background-color: var(--primary);
        box-shadow: 0 0 .15rem rgba(255, 255, 255, 0.354),  0 0 1rem rgba(255, 255, 255, 0.134);
        border-radius: .7rem;
        background-color: color-mix(in srgb, var(--primary) 80%, transparent);
    }
</style>