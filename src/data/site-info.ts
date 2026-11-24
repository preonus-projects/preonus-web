export type SocialLink = {
	/** Longer descriptive label, e.g. `"Go to Preonus' GitHub repo"` */
	text: string;
	/** Short label with the name of the platform, e.g. `"GitHub"` */
	label: string;
	/** Icon name for use with `astro-icon`, e.g. `"social/github"`. */
	icon: string;
	/** URL for our profile on the external platform. */
	href: string;
	/** Platform ID, e.g. `"github"`. */
	platform: string;
	/** Whether this platform should be linked in the site header */
	showInHeader?: boolean;
};

type SiteInfo = {
	name: string;
	title: string;
	description: string;
	image: {
		src: string;
		alt: string;
	};
	socialLinks: SocialLink[];
};

const siteInfo: SiteInfo = {
	name: 'Preonus',
	title: 'The Build-Time DI Framework',
	description:
		'Preonus is the build-time dependency injection framework for instant-startup Java applications and GraalVM native images.',
	image: {
		src: '/og/social.jpg',
		alt: 'Preonus - Build-time Dependency Injection Framework',
	},
	socialLinks: [
		{
			platform: 'github',
			icon: 'social/github',
			label: 'GitHub',
			text: "Go to Preonus' GitHub repo",
			href: 'https://github.com/preonus-projects/preonus-web',
			showInHeader: true,
		},
		{
			platform: 'linkedin',
			icon: 'social/linkedin',
			label: 'LinkedIn',
			text: 'Follow Preonus on LinkedIn',
			href: 'https://www.linkedin.com/company/preonus',
			showInHeader: true,
		},
	],
};

export default siteInfo;
