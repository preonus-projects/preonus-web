export interface ReleaseItem {
	slug: string;
	version: string;
	date: string;
	title: string;
	description: string;
	highlights: string[];
	content: string;
}

export const releasesData: ReleaseItem[] = [
	{
		slug: 'v1-0-0-rc-1',
		version: 'v1.0.0-rc.1',
		date: 'November 2026',
		title: 'Preonus 1.0 Release Candidate',
		description:
			'Initial Release Candidate featuring the core AOT bytecode generator, topological graph resolution, and zero-reflection dependency injection engine.',
		highlights: [
			'Compile-time BeanDefinition bytecode generation',
			'Cycle detection and topological ordering in Korus Core Processor',
			'Full GraalVM Native Image zero-reflection compatibility',
			'Sub-15ms cold start on standard JVMs',
		],
		content: `## Welcome to Preonus 1.0-RC1

Preonus 1.0.0-rc.1 represents the first production-ready Release Candidate of the Preonus framework. It marks the culmination of architectural development focused on removing all reflection, dynamic proxies, and runtime classpath inspection from JVM microservices.

### Key Architectural Milestones

- **Compile-Time Bytecode Generation**: Moves all bean instantiation, dependency resolution, and lifecycle hooks into synthesized class files generated directly during compilation.
- **Topological Graph Resolution**: Pre-computes component dependency order ahead-of-time. Unsatisfied dependencies or circular references fail fast during compilation rather than in production pods.
- **GraalVM Native Image Synergy**: Generates zero-reflection invocation paths, enabling instant GraalVM Native compilation without the need for manual reflection registration files.
- **Microsecond Cold Starts**: Startup benchmarks consistently demonstrate readiness times under 15 milliseconds on OpenJDK 21+ and sub-millisecond on native binaries.

### Getting Started with RC1

Add the dependency to your build file:

\`\`\`kotlin
dependencies {
    implementation("io.preonus:preonus-core:1.0.0-rc.1")
    annotationProcessor("io.preonus:preonus-core-processor:1.0.0-rc.1")
}
\`\`\`
`,
	},
	{
		slug: 'v0-9-0',
		version: 'v0.9.0',
		date: 'October 2026',
		title: 'Core Engine & Conversion Service',
		description:
			'Milestone release finalizing the core conversion subsystem, Micronaut-aligned interfaces, and robust dependency exception hierarchies.',
		highlights: [
			'High-performance record-based property resolvers',
			'FormattingConversionService and default type converters',
			'Type-safe @ConfigurationProperties and @Requires conditions',
			'Benchmark verification for 5,000+ bean topologies',
		],
		content: `## Preonus v0.9.0 Milestone

Preonus v0.9.0 introduced the foundational core utilities and conversion services that power the dependency injection container.

### Highlights

- **Conversion Subsystem**: Added \`ConversionService\`, \`TypeConverter\`, \`FormattingConversionService\`, and default type converters for primitives, collections, and dates.
- **Configuration & Environment**: Refactored property resolution using high-performance Java records and modern data structures for minimal memory overhead.
- **Exception Hierarchy**: Implemented strict, descriptive container exceptions including \`DependencyInjectionException\`, \`BeanCreationException\`, \`NoSuchBeanException\`, and \`CircularDependencyException\`.
- **Large-Scale Topological Benchmarking**: Validated processor performance on synthetic models with up to 5,000 beans, confirming linear-time scanning and graph resolution.
`,
	},
];
