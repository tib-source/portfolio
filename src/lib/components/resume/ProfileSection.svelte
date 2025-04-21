<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import github from '$lib/assets/icons/github.svg';
	import external_link from '$lib/assets/icons/external_link.svg';
	import code from '$lib/assets/icons/code.svg';
	import resumeDocument from '$lib/assets/document/resume.pdf';
	export let profile: {
		name: string;
		title: string;
		location: string;
		email: string;
		phone: string;
		avatar: string;
	};
</script>

<div class="border-b border-[#e8d5c4]/10 p-8 md:p-10">
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div
			class="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-[#e8d5c4]/20"
		>
			<img src={profile.avatar} alt={profile.name} class="object-cover" />
		</div>

		<div class="text-center md:text-left">
			<h1 class="mb-2 text-3xl font-bold md:text-4xl">{profile.name}</h1>
			<h2 class="mb-4 text-xl text-[#e8d5c4]/80">{profile.title}</h2>

			<div class="mb-4 flex flex-wrap justify-center gap-4 md:justify-start">
				<div class="flex items-center text-[#e8d5c4]/70">
					<span>{profile.location}</span>
				</div>
				<div class="flex items-center text-[#e8d5c4]/70">
					<span>{profile.email}</span>
				</div>
				<div class="flex items-center text-[#e8d5c4]/70">
					<span>{profile.phone}</span>
				</div>
			</div>

			<div class="flex justify-center gap-3 md:justify-start">
				<Button
					variant="ghost"
					size="icon"
					class="rounded-full bg-[#e8d5c4]/10 hover:bg-[#e8d5c4]/20"
				>
					<img src={github} alt="GitHub" class="h-5 w-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="rounded-full bg-[#e8d5c4]/10 hover:bg-[#e8d5c4]/20"
				>
					<img src={external_link} alt="External Link" class="h-5 w-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="rounded-full bg-[#e8d5c4]/10 hover:bg-[#e8d5c4]/20"
				>
					<img src={code} alt="Code" class="h-5 w-5" />
				</Button>
			</div>
		</div>

		<div class="ml-auto hidden md:block">
			<a href={resumeDocument} download>
				<Button class="bg-[#e8d5c4] text-[#5a1e33] hover:bg-[#e8d5c4]/90">Download Resume</Button>
			</a>
		</div>
	</div>
</div>
