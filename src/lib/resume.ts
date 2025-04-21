import me from '$lib/assets/me.jpeg';
import ergon from '$lib/assets/projects/ergon.png';
import grim_repoer from '$lib/assets/projects/grim_repoer.png';
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
	summary: `Hey 👋, I’m an Ethiopian currently in the UK as an international student and a software engineer who’s constantly tinkering with ideas that blend culture, creativity, and code. Right now, I’m at Matillion, working on everything from repo migrations to internal tooling. Before that, I was keeping VR systems alive (and customers happy) at Otherworld. Outside of work, I love building random projects — currently designing a website that celebrates Ethiopian food and culture, mixing recipes, history, and where to find real ingredients. When I’m not coding, you’ll find me learning Spanish, training Muay Thai, or diving into anime`,
	experience: [
		{
			position: 'Software Engineer Placement - DevX',
			company: 'Matillion, Manchester',
			period: 'July 2024 - Present',
			achievements: [
				"Developed and maintained an internal tool used to migrate over 700 repositories",
				"Designed a Jfrog artifact cleaner to reduce storage costs and sped up ArgoCD deployments",
				"Worked with MIT interns to create an internal copilot trained on documentation for employees",
			],
			skills: ['Kubernetes', 'ArgoCD', 'Python', 'Terraform', 'Docker']
		},
		{
			position: 'IT Support Engineer',
			company: 'The Dream Corporation(Otherworld VR), London',
			period: 'October 2023 - July 2024',
			achievements: [
				"Managed urgent escalations from 1st Line Experience Guides and Floor Team Members",
				"Monitored the uptime and performance of on-premises and cloud systems",
				"Communicated with guests directly via VoIP to provide calm and reassuring technical support"
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
