import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { releasesData } from '~/data/releases.js';

interface SearchEntry {
	title: string;
	section?: string;
	url: string;
	category: 'Docs' | 'Guide' | 'Blog' | 'Release' | 'Page';
	excerpt: string;
	body: string;
}

function slugifyHeading(text: string): string {
	return text
		.toLowerCase()
		.replace(/[`*_~()[\]{}!?:;.,'"/\\]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

function stripMarkdown(raw: string): string {
	return raw
		.replace(/^import\s+.*$/gm, '')
		.replace(/^export\s+.*$/gm, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[#*_~>|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractSections(
	rawBody: string | undefined,
	baseUrl: string,
	pageTitle: string,
	category: SearchEntry['category'],
): SearchEntry[] {
	if (!rawBody) return [];
	const lines = rawBody.split(/\r?\n/);
	const entries: SearchEntry[] = [];
	let currentHeading = '';
	let currentAnchor = '';
	let buffer: string[] = [];

	const flush = () => {
		const text = stripMarkdown(buffer.join(' '));
		if (!text && !currentHeading) return;
		entries.push({
			title: currentHeading ? `${pageTitle} — ${currentHeading}` : pageTitle,
			section: currentHeading || undefined,
			url: currentAnchor ? `${baseUrl}#${currentAnchor}` : baseUrl,
			category,
			excerpt: text.slice(0, 150) + (text.length > 150 ? '…' : ''),
			body: `${currentHeading} ${text}`.trim(),
		});
		buffer = [];
	};

	for (const line of lines) {
		const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
		if (headingMatch) {
			flush();
			currentHeading = stripMarkdown(headingMatch[2]);
			currentAnchor = slugifyHeading(currentHeading);
		} else {
			buffer.push(line);
		}
	}
	flush();

	return entries;
}

export const GET: APIRoute = async () => {
	const entries: SearchEntry[] = [
		{
			title: 'Preonus Home',
			url: '/',
			category: 'Page',
			excerpt:
				'Hypothetical subatomic JVM framework. Build-time dependency injection for instant-startup Java applications and GraalVM native images.',
			body: 'Preonus build-time dependency injection framework Java Kotlin GraalVM native image instant cold starts 8 ms 70 ms 160 ms compile-time first native-ready modular by design',
		},
		{
			title: 'Preonus Guide',
			url: '/guide/',
			category: 'Guide',
			excerpt: 'Architecture and implementation guides for Preonus.',
			body: 'Preonus guide architecture dependency injection AOT native image',
		},
		{
			title: 'Preonus Blog',
			url: '/blog/',
			category: 'Blog',
			excerpt: 'Articles, engineering deep dives, and announcements from the Preonus team.',
			body: 'Preonus blog announcements brand physics engineering stories',
		},
		{
			title: 'Preonus Releases',
			url: '/releases/',
			category: 'Release',
			excerpt: 'Release notes, changelogs, and milestones for the Preonus framework.',
			body: 'Preonus releases changelog milestones versions v1.0.0-rc.1 v0.9.0',
		},
	];

	const docs = await getCollection('docs');
	for (const doc of docs) {
		const cleanSlug = doc.id.replace(/\/index$/, '').replace(/^index$/, '');
		const url = cleanSlug ? `/${cleanSlug}/` : '/docs/';
		const category: SearchEntry['category'] = url.includes('/guides/') ? 'Guide' : 'Docs';
		const title = doc.data.title;
		const description = doc.data.description ?? '';

		entries.push({
			title,
			url,
			category,
			excerpt: description,
			body: `${title} ${description} ${stripMarkdown(doc.body ?? '')}`,
		});

		entries.push(...extractSections(doc.body, url, title, category));
	}

	const posts = await getCollection('blog');
	for (const post of posts) {
		const url = `/blog/${post.id}/`;
		const title = post.data.title;
		const description = post.data.description;

		entries.push({
			title,
			url,
			category: 'Blog',
			excerpt: description,
			body: `${title} ${description} ${stripMarkdown(post.body ?? '')}`,
		});

		entries.push(...extractSections(post.body, url, title, 'Blog'));
	}

	for (const release of releasesData) {
		const url = `/releases/${release.slug}/`;
		const highlightsText = release.highlights.join(' · ');
		entries.push({
			title: `${release.version} — ${release.title}`,
			url,
			category: 'Release',
			excerpt: release.description,
			body: `${release.version} ${release.title} ${release.date} ${release.description} ${highlightsText} ${stripMarkdown(release.content)}`,
		});

		entries.push(...extractSections(release.content, url, release.version, 'Release'));
	}

	return new Response(JSON.stringify(entries), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
};
