import ergon from '$lib/assets/projects/ergon.png';
import grim from '$lib/assets/projects/grim_repoer.png';
import protfolio from '$lib/assets/background.webp';
import flamingo from '$lib/assets/projects/flamingo.png';
import tinat from '$lib/assets/projects/tinat.png';
import chaze from '$lib/assets/projects/chaze.png';

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
		name: 'Tinat',
		description:
			'A gamified bible learning app for Ethiopian Orthodox members. Has a fully functional calendar system that has all the fasts and feats that we celebrate.',
		tech: ['React Native', 'TypeScript', 'Tailwind', 'Expo'],
		link: 'https://bible.tibebe.co.uk',
		source: 'https://github.com/tib-source/Tinat',
		image: tinat
	},
	{
		name: 'Chaze',
		description:
			'A top-down chess shooter. Made this to practice A* pathfinding, intelligent HFSM agents, and procedural map generation',
		tech: ['LittleJS', 'TypeScript', 'Svelte', 'Expo'],
		link: 'https://tibebe.co.uk/chaze',
		source: 'https://github.com/tib-source/portfolio/tree/main/src/lib/chaze',
		image: chaze
	},
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
		link: 'https://tib-source.github.io/GrimRepoer/',
		source: 'https://github.com/tib-source/GrimRepoer',
		image: grim
	},
	{
		name: '${this}',
		description: 'My personal portfolio website.',
		tech: ['Svelte', 'TypeScript', 'Tailwind CSS'],
		link: 'https://tibebe.co.uk/',
		source: 'https://github.com/tib-source/portfolio',
		image: protfolio
	},
	{
		name: 'Flamingo Restaurant',
		description:
			'A website for a local restaurant. It includes a menu, contact form, and a gallery.',
		tech: ['NextJs', 'Netlify CMS'],
		link: 'http://flamingo-restaurant.netlify.app/',
		source: 'https://github.com/tib-source/flamingo',
		image: flamingo
	}
];

export default projects;
