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
	summary: `Creative developer with 8+ years of experience in web development, game design, and interactive media.
          Passionate about creating immersive digital experiences that blend creativity with technical precision.
          Proven track record of delivering high-quality projects for startups, agencies, and established companies.
          Skilled in front-end development, UI/UX design, and game development with a focus on user experience and
          performance.`,
	experience: [
		{
			position: 'Software Engineer Placement - DevX',
			company: 'Matillion, Manchester',
			period: 'July 2024 - Present',
			achievements: [
				'Lead developer for 5+ web applications and 2 game projects',
				'Implemented responsive design systems that improved mobile user engagement by 40%',
				'Mentored junior developers and conducted code reviews to ensure quality standards',
				'Optimized application performance, reducing load times by 35%'
			],
			skills: ['React', 'Next.js', 'TypeScript', 'Unity']
		},
		{
			position: 'IT Support Engineer',
			company: 'The Dream Corporation(Otherworld VR), London',
			period: '2017 - 2020',
			achievements: [
				'Designed and developed user interfaces for 10+ client websites and applications',
				'Created interactive prototypes that improved client approval rates by 60%',
				'Collaborated with UX researchers to implement data-driven design improvements',
				'Developed component libraries that reduced development time by 25%'
			],
			skills: ['JavaScript', 'React', 'Figma', 'CSS/SASS']
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
