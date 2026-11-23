#!/usr/bin/env node
/**
 * 构建后校验：每个有文档的顶层分类必须有索引页，且索引页包含全部文档入口。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = path.join(ROOT, 'src/content/docs');
const DIST_DIR = path.join(ROOT, 'dist');

const normalizeId = (file) =>
	path.relative(DOCS_DIR, file).split(path.sep).join('/').replace(/\.(md|mdx)$/, '');

function walk(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const name of fs.readdirSync(dir)) {
		const full = path.join(dir, name);
		if (fs.statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

const categories = new Map();
for (const file of walk(DOCS_DIR).filter((file) => /\.(md|mdx)$/.test(file))) {
	const id = normalizeId(file);
	const [category, ...rest] = id.split('/');
	if (!category || rest.length === 0 || id === `${category}/index`) continue;
	if (!categories.has(category)) categories.set(category, []);
	categories.get(category).push(id);
}

const errors = [];
for (const [category, docs] of [...categories].sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))) {
	const indexFile = path.join(DIST_DIR, category, 'index.html');
	if (!fs.existsSync(indexFile)) {
		errors.push(`${category}: 缺少分类索引页 ${path.relative(ROOT, indexFile)}`);
		continue;
	}

	const html = fs.readFileSync(indexFile, 'utf8');
	for (const id of docs) {
		if (!html.includes(`/${id}/`)) {
			errors.push(`${category}: 索引页缺少文档入口 ${id}`);
		}
	}
}

for (const error of errors) console.error(`❌ ${error}`);
console.log(
	`\n索引校验完成: ${categories.size} 个分类, ${[...categories.values()].flat().length} 篇文档, ${errors.length} 个错误`
);
process.exit(errors.length > 0 ? 1 : 0);