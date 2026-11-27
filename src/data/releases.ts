export interface ReleaseItem {
	slug: string;
	version: string;
	date: string;
	title: string;
	description: string;
	highlights: string[];
	content: string;
}

export const releasesData: ReleaseItem[] = [];
