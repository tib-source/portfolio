import ergon from '$lib/assets/projects/ergon.png';
import grim from '$lib/assets/projects/grim_repoer.png';
import protfolio from '$lib/assets/background.jpeg';

export interface project {
	name: string;
	description: string;
	tech: string[];
	link: string;
	source: string;
	image: string;
}

const projects: project[] = [
	{
		name: 'Ergon',
		description:
			'An equipment management app for universites. Allows students to book equipment which can be approved and rejected as needed by admins. Use username: test, password: 123 to login.',
		tech: ['React', 'TypeScript', 'Tailwind', 'Spring', 'PostgreSQL', 'Docker'],
		link: 'https://ergon-pyd3.onrender.com/',
		source: 'https://github.com/tib-source/ergon',
		image: ergon
	},
	{
		name: 'Grim Repoer',
		description:
			'A halloween themed project made for easiliy deleting GitHub repositories. It connects to your GitHub using OAuth and allows you to select multiple repositories to delete.',
		tech: ['Svelte', 'TypeScript', 'Tailwind CSS', 'Firebase'],
		link: 'https://tibebe.co.uk/GrimRepoer',
		source: 'https://github.com/tib-source/GrimRepoer',
		image: grim
	},

	{
		name: '${this}',
		description: 'My personal portfolio website.',
		tech: ['Svelte', 'TypeScript', 'Tailwind CSS'],
		link: 'https://tibebe.co.uk/',
		source: 'https://github.com/tib-source/tib-source.github.io',
		image: protfolio
	}
];

export default projects;
