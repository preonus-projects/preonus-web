# Preonus

An Astro site configured for static output and deployment to GitHub Pages.

## Development

```sh
pnpm install
pnpm dev
```

Create a production build with:

```sh
pnpm build
```

The GitHub Pages workflow deploys `dist/` when changes are pushed to `main`. Enable GitHub Pages with GitHub Actions in the repository settings.

## Content

Blog posts are MDX files in `src/content/blog/`. Store post images in that collection's `_images/` directory, preferably as optimized WebP files around 800–1600 pixels wide.

Pages and API endpoints that required server rendering have been excluded for static hosting. The theme and integration catalogs are not available in this static build.
