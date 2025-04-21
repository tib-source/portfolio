<script lang="ts">
	import { Badge } from './ui/badge';
	import { Button } from './ui/button';
	import { Card, CardContent, CardFooter } from './ui/card';
	import code from '$lib/assets/icons/code.svg';
	import externalLink from '$lib/assets/icons/external_link.svg';
	export let name: string;
	export let description: string;
	export let thumbnail: string;
	export let tech: string[] = [];
	export let source: string;
	export let link: string;
</script>

<Card
	class="group flex h-full flex-col overflow-hidden border-[#e8d5c4]/20 bg-[#e8d5c4]/5 backdrop-blur-md transition-all duration-300 hover:border-[#e8d5c4]/50"
>
	<div class="relative h-48 overflow-hidden">
		<img
			src={thumbnail || '/placeholder.svg'}
			alt={name}
			class="object-contain transition-transform duration-500 group-hover:scale-110"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-[#2e0f1a]/80 to-transparent"></div>
	</div>
	<CardContent class="flex-grow p-4">
		<h3 class="mb-1 text-xl font-bold">{name}</h3>
		<p class="text-sm text-[#e8d5c4]/70">{description}</p>
		<div class="mb-4 mt-2 flex flex-wrap gap-2">
			{#each tech as technology}
				<Badge variant="outline" class="border-[#e8d5c4]/30 text-[#e8d5c4]">
					{technology}
				</Badge>
			{/each}
		</div>
	</CardContent>
	<CardFooter class="flex items-center justify-between p-4 pt-0">
		<Button class="bg-[#e8d5c4]/10 text-[#e8d5c4]/90 hover:bg-[#e8d5c4]/20 hover:text-[#e8d5c4]">
			<a href={link} target="_blank" rel="noopener noreferrer">
				<img src={externalLink} alt="external link icon" class="h-4 w-4" />
			</a>
		</Button>
		<div class="flex space-x-1">
			<Button variant="ghost" size="icon" class="bg-[#e8d5c4]/10 hover:bg-[#e8d5c4]/20">
				<a href={source} target="_blank" rel="noopener noreferrer">
					<img src={code} alt="code icon" class="h-6 w-6" />
				</a>
			</Button>
		</div>
	</CardFooter>
</Card>
