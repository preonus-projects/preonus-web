import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import authors from './data/authors/authors.json';
import { IntegrationCategories } from './data/integration-categories.js';

const seoSchema = z.object({
	title: z.string().min(5).max(120),
	description: z.string().min(15).max(160),
	image: z
		.object({
			src: z.string().default('/og/social.jpg'),
			alt: z.string().default('Build the web you want'),
		})
		.prefault({}),
	pageType: z.enum(['website', 'article']).default('website'),
	robots: z
		.object({
			index: z.boolean().default(true),
			follow: z.boolean().default(true),
		})
		.prefault({}),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema(),
	}),
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema(),
	}),
	authors: defineCollection({
		loader: file('src/data/authors/authors.json'),
		schema: ({ image }) =>
			z.strictObject({
				image: image().optional(),
				name: z.string(),
				twitter: z.url().optional(),
				mastodon: z.url().optional(),
				bluesky: z.url().optional(),
				github: z.url().optional(),
			}),
	}),
	blog: defineCollection({
		loader: glob({ base: './src/content/blog', pattern: '*.mdx' }),
		schema: z.object({
			title: z.string().describe('The blog post title.'),
			description: z
				.string()
				.describe(
					'Summary of this blog post. Appears on the blog index as well as in metadata displayed on social media.',
				),
			homepageLink: z
				.object({
					title: z.string().max(32).describe('Very short call-out, e.g. `Astro 4.14` or `New!`.'),
					subtitle: z
						.string()
						.max(50)
						.optional()
						.describe(
							'Short tagline attracting attention to the post, e.g. `New experimental Content Layer API` or `Announcing Astro DB`. Avoid punctuation and keep things punchy.',
						),
				})
				.optional()
				.describe('Configure the homepage banner link for this post if it’s the most recent post.'),
			publishDate: z.coerce
				.date()
				.describe(
					'A date string or YAML date that is compatible with JavaScript’s `new Date()` constructor.',
				),
			authors: z
				.enum(Object.keys(authors) as [keyof typeof authors, ...(keyof typeof authors)[]])
				.array()
				.describe('A list of authors of this blog post, e.g. `["erika", "matt"]`'),
			socialImage: z
				.string()
				.optional()
				.describe(
					'Path to the open graph image for this blog post to display in social media previews, e.g. `/src/content/blog/_images/my-post/og-image.webp`.\n\n' +
						'This should be pre-optimized as a WebP to ensure good performance.',
				),
			coverImage: z
				.string()
				.optional()
				.describe(
					'Path to the cover image displayed at the top of the blog post and on the blog index, e.g. `/src/content/blog/_images/my-post/cover-image.webp`.\n\n' +
						'This should be pre-optimized as a WebP to ensure good performance.',
				),
			lang: z.enum(['en']).default('en').describe('The language of this blog post (optional)'),
			headerImage: z.string().optional(),
			coverGradientFrom: z.string().optional(),
			coverGradientTo: z.string().optional(),
			related: z.array(z.string()).default([]),
		}),
	}),
	integrations: defineCollection({
		loader: file('./src/content/integrations.json'),
		schema: z.object({
			id: z.string().describe('Name of the package as it is published to NPM'),
			description: z.string().optional(),
			image: z.string().optional(),
			categories: z.array(
				z.enum(Array.from(IntegrationCategories.keys()) as [string, ...string[]]),
			),
			repoUrl: z.url().optional(),
			npmUrl: z.url(),
			homepageUrl: z.url().optional(),
			official: z.boolean().default(false),
			toolbar: z.number().min(1).optional(),
			downloads: z.number().min(0).default(0),
			downloadFactor: z.number().min(0).default(1),
			badge: z.string().optional(),
			created: z.string(),
		}),
	}),
	pages: defineCollection({
		loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
		schema: ({ image }) =>
			z.discriminatedUnion('pageLayout', [
				z.object({
					seo: seoSchema,
					locale: z.enum(['en']).default('en'),
					pageLayout: z.literal('blog'),
					image: image(),
				}),
				z.object({
					seo: seoSchema,
					locale: z.enum(['en']).default('en'),
					pageLayout: z.literal('legal').optional(),
					updated_date: z.date().describe('The date this content was last updated.'),
				}),
			]),
	}),
	partials: defineCollection({
		loader: glob({ base: './src/content/partials', pattern: '*.md' }),
		schema: z.object({}),
	}),
};
