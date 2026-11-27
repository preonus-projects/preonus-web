const allImages = import.meta.glob(
	'/src/content/blog/_images/**/*.{png,jpg,jpeg,webp,avif,svg}',
);

export async function resolveBlogImage(url) {
	if (!url) return undefined;
	if (typeof url === 'string' && url in allImages) {
		const mod = await allImages[url]();
		return mod?.default ?? mod;
	}
	return undefined;
}

export async function resolveCoverImage(entry) {
	if (!entry?.data?.coverImage) {
		return undefined;
	}
	const path = entry.data.coverImage;
	if (typeof path === 'string' && path in allImages) {
		const mod = await allImages[path]();
		return mod?.default ?? mod;
	}
	return undefined;
}

export async function resolveSocialImage(entry) {
	if (!entry?.data?.socialImage) {
		return undefined;
	}
	const path = entry.data.socialImage;
	if (typeof path === 'string' && path in allImages) {
		const mod = await allImages[path]();
		return mod?.default ?? mod;
	}
	return undefined;
}

export default function resolveImage(src) {
	return src;
}
