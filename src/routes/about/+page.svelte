<script>
	import { Button } from '$lib/components/ui/button';
	import { resumeData } from '$lib/resume';
	import { fly } from 'svelte/transition';
	import code from '$lib/assets/icons/code.svg';

	// Import resume section components
	import ProfileSection from '$lib/components/resume/ProfileSection.svelte';
	import SummarySection from '$lib/components/resume/SummarySection.svelte';
	import ExperienceSection from '$lib/components/resume/ExperienceSection.svelte';
	import EducationSection from '$lib/components/resume/EducationSection.svelte';
	import SkillsSection from '$lib/components/resume/SkillsSection.svelte';
	import CertificationsSection from '$lib/components/resume/CertificationsSection.svelte';
	import ProjectsSection from '$lib/components/resume/ProjectsSection.svelte';
</script>

<div class="container mx-auto max-w-4xl px-4 py-24">
	<div
		class="overflow-hidden rounded-xl border border-[#e8d5c4]/30 bg-[#e8d5c4]/10 backdrop-blur-md"
		in:fly={{ y: -5, duration: 200 }}
	>
		<!-- Profile Section -->
		<ProfileSection profile={resumeData.profile} />

		<!-- Summary Section -->
		<SummarySection summary={resumeData.summary} />

		<!-- Experience Section -->
		<ExperienceSection experience={resumeData.experience} />

		<!-- Education Section -->
		<EducationSection education={resumeData.education} />

		<!-- Skills Section -->
		<SkillsSection skills={resumeData.skills} />

		<!-- Certifications Section -->
		<CertificationsSection certifications={resumeData.certifications} />

		<!-- Projects Section -->
		<ProjectsSection projects={resumeData.featuredProjects} />
	</div>

	<div class="mt-8 flex justify-center md:hidden">
		<Button class="bg-[#e8d5c4] text-[#5a1e33] hover:bg-[#e8d5c4]/90">
			<img src={code} alt="download" class="mr-2 h-4 w-4" />
			Download Resume
		</Button>
	</div>
</div>
