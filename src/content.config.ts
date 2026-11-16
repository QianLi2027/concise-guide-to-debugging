import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// 电控调试指南 front matter 契约
// Starlight 原生字段（title/description/lastUpdated/draft 等）由 docsSchema 校验
// authors/maintainers 在分类页面为必需，但首页/索引页允许缺省，故此处设为 optional
// 分类页面的强制校验由 scripts/validate.mjs 在 CI 中执行
const guideSchema = docsSchema({
	extend: z.object({
		authors: z.array(z.string()).min(1).optional(),
		maintainers: z.array(z.string()).min(1).optional(),
		outdated: z.boolean().default(false),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: guideSchema }),
};
