// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import astroExpressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import houston from './houston.theme.json';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://preonus.netlify.app',
    output: 'static',
    prefetch: true,
    integrations: [
        tailwind({ applyBaseStyles: false }),
        astroExpressiveCode({
            themes: [houston],
            shiki: { engine: 'javascript' },
            styleOverrides: {
                borderRadius: '0.375rem',
                borderColor: 'rgb(84 88 100)',
            },
            defaultProps: {
                overridesByLang: {
                    'bash,sh,shell': {
                        frame: 'none',
                    },
                },
            },
        }),
        icon({
            svgoOptions: {
                plugins: [
                    { name: 'preset-default' },
                    {
                        name: 'prefixIds',
                        // Ensure IDs used in SVGs are unique to avoid clashes between inline SVGs.
                        params: { prefix: () => Math.round(Math.random() * 1_000_000_000).toString(36) },
                    },
                ],
            },
        }),
        mdx({ optimize: true }),
        sitemap(),
        starlight({
            title: 'Preonus',
            description: 'Build-time dependency injection framework for instant-startup Java & Kotlin applications and GraalVM native images.',
            logo: {
                dark: './src/assets/preonus-white-full.svg',
                light: './src/assets/preonus-black-full.svg',
                replacesTitle: true,
            },
            customCss: ['./src/styles/fonts.css', './src/styles/starlight.css'],
            components: {
                Header: './src/components/starlight/Header.astro',
                ThemeSelect: './src/components/starlight/ThemeSelect.astro',
                ThemeProvider: './src/components/starlight/ThemeProvider.astro',
            },
            tableOfContents: {
                minHeadingLevel: 2,
                maxHeadingLevel: 3,
            },
            editLink: {
                baseUrl: 'https://github.com/preonus-projects/preonus-web/edit/main/',
            },
            lastUpdated: true,
            sidebar: [
                {
                    label: 'Overview',
                    items: [
                        { label: 'Welcome to Preonus', slug: 'docs' },
                    ],
                },
            ],
            disable404Route: true,
        }),
    ],
    image: {
        domains: ['v1.screenshot.11ty.dev', 'storage.googleapis.com', 'avatars.githubusercontent.com'],
    },
    vite: {
        ssr: {
            noExternal: ['smartypants'],
        },
        optimizeDeps: {
            include: [
                '@preact/signals-core',
                'astro-icon > @iconify/utils > debug',
                'astro-expressive-code/components',
                'astro-expressive-code>hast-util-select',
                'astro-expressive-code>rehype',
                'astro-expressive-code>unist-util-visit',
                'astro-expressive-code>rehype-format',
                'astro-expressive-code>hastscript',
                'astro-expressive-code>hast-util-from-html',
                'astro-expressive-code>hast-util-to-string',
                'astro-expressive-code>@expressive-code/core>postcss',
                'astro-expressive-code>@expressive-code/core>postcss-nested',
            ],
        },
    },
    experimental: {
        contentIntellisense: true,
    },
});