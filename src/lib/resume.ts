import me from '$lib/assets/me.webp';
import projects from './projects';

export const resumeData = {
	profile: {
		name: 'Tibebe Demissie',
		title: 'Software Engineer Placement - DevX',
		location: 'London, United Kingdom',
		email: 'hello@tibebe.co.uk',
		phone: '',
		avatar: me
	},
	summary: `Hey 👋, I’m an international student from Ethiopia. Right now, I’m doing my placement at Matillion, working on everything from repo migrations, incident management to internal tooling. Before that, I was keeping VR systems alive (and customers happy) at Otherworld. Outside of work, I love building random projects — currently designing a bible reading app for the Ethiopian Orthodox version. When I’m not coding, you’ll find me learning Spanish, kicking pads at Muay Thai, or watching an obscure anime`,
	experience: [
		{
			position: 'Software Engineer Placement - DevX',
			company: 'Matillion, Manchester',
			period: 'July 2024 - Present',
			achievements: [
				'Migrated 700+ repos from Bitbucket to GitHub with a Python tool, cutting manual effort by 90%.',
				'Built "Maker" CLI to automate local Kubernetes & ArgoCD development environments.',
				'Developed an Artifactory cleanup utility, reclaiming over 400GB of storage and preventing stale artifacts.',
				'Rotated as DevX support, resolving Terraform, PagerDuty, GitHub, CircleCI, and Maker issues via Slack.',
				'Wrote documentation and led workshops for Maker to boost internal adoption.'
			],
			skills: ['Kubernetes', 'ArgoCD', 'Python', 'Terraform', 'Docker']
		},
		{
			position: 'IT Support Engineer',
			company: 'The Dream Corporation(Otherworld VR), London',
			period: 'October 2023 - July 2024',
			achievements: [
				'Managed urgent escalations from 1st Line Experience Guides and Floor Team Members',
				'Monitored the uptime and performance of on-premises and cloud systems',
				'Communicated with guests directly via VoIP to provide calm and reassuring technical support'
			],
			skills: ['Ansible', 'Python', 'Networking', 'Windows']
		}
	],
	education: [
		{
			degree: 'Bachelor of Computer Science',
			institution: 'University of Westminster',
			period: '2022 - 2026',
			description: 'Specialized in internet of things and AI technologies'
		}
	],
	skills: [
		{
			category: 'Development',
			items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'HTML/CSS', 'Tailwind CSS']
		},
		{
			category: 'Other',
			items: ['Git/Version Control', 'Docker', 'Kubernetes', 'ArgoCD', 'CircleCI', 'Terraform']
		}
	],
	certifications: [
		{
			title: 'AWS Certified Developer',
			organization: 'Amazon Web Services, 2022'
		},
		{
			title: 'Google UX Design Professional Certificate',
			organization: 'Google, 2021'
		},
		{
			title: 'Unity Certified Developer',
			organization: 'Unity Technologies, 2020'
		},
		{
			title: 'Best Game Design Award',
			organization: 'Indie Game Festival, 2019'
		}
	],
	featuredProjects: [projects[0], projects[1]]
};
