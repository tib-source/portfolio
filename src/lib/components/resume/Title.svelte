<script lang="ts">
    const {
        title
    }: { title : string} = $props();
</script>

<h3 class="mb-6 flex items-center text-xl font-bold text-[#e8d5c4]">
    <span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8d5c4]"></span>
    {title}
</h3>