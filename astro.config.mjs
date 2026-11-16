// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://qianli2027.github.io',
	base: '/concise-guide-to-debugging',
	integrations: [
		starlight({
			title: '电控调试简明指南',
			description: '电控调试疑难杂症速查手册：硬件、电机、通信协议、控制算法、石山代码',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/QianLi2027/concise-guide-to-debugging' }],
			editLink: {
				baseUrl: 'https://github.com/QianLi2027/concise-guide-to-debugging/edit/main/',
			},
			components: {
				// 覆写默认正文容器以注入过期红色横幅（outdated: true 时渲染）
				MarkdownContent: './src/components/OutdatedBanner.astro',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: '硬件',
					items: [{ autogenerate: { directory: '硬件', collapsed: false } }],
				},
				{
					label: '电机',
					items: [{ autogenerate: { directory: '电机', collapsed: false } }],
				},
				{
					label: '通信协议',
					items: [{ autogenerate: { directory: '通信协议', collapsed: false } }],
				},
				{
					label: '控制算法',
					items: [{ autogenerate: { directory: '控制算法', collapsed: false } }],
				},
				{
					label: '石山代码',
					items: [{ autogenerate: { directory: '石山代码', collapsed: false } }],
				},
			],
		}),
	],
});
