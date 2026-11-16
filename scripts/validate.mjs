#!/usr/bin/env node
/**
 * 电控调试指南 CI 校验脚本
 * 唯一强制门禁：front matter 契约、分类目录、图片引用与大小
 * 仅依赖 gray-matter + Node 内置模块
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = path.join(ROOT, 'src/content/docs');
const ASSETS_DIR = path.join(ROOT, 'src/assets');

/** 允许的顶级分类目录（目录即分类） */
const CATEGORIES = ['电机', '通信协议', '控制算法', '石山代码'];

/** front matter 必需字段（首页/索引页豁免，见 isIndexPage） */
const REQUIRED_FIELDS = ['title', 'description', 'authors', 'maintainers', 'lastUpdated', 'outdated'];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 单图 2 MB 门禁
const OUTDATED_HINT_DAYS = 180; // 超过此天数且未标 outdated 则提示

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'];

const errors = [];
const warnings = [];

const isIndexPage = (rel) => /^(index\.(md|mdx))$/.test(path.basename(rel));

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function checkFrontmatter(file, rel) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);
  if (isIndexPage(rel)) return;

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${rel}: 缺少必需 front matter 字段 \"${field}\"`);
    }
  }
  for (const key of ['authors', 'maintainers']) {
    if (data[key] !== undefined && (!Array.isArray(data[key]) || data[key].length === 0)) {
      errors.push(`${rel}: \"${key}\" 必须是非空 GitHub 用户名数组`);
    }
  }
  if (data.lastUpdated !== undefined && !(data.lastUpdated instanceof Date) && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.lastUpdated))) {
    errors.push(`${rel}: "lastUpdated" 必须是 YYYY-MM-DD`);
  }
  if (data.outdated !== undefined && typeof data.outdated !== 'boolean') {
    errors.push(`${rel}: "outdated" 必须是 true/false`);
  }
  if (data.outdated === true) {
    warnings.push(`${rel}: 已标记过期 (outdated)，CI 警告不阻断`);
  }
  const lu = data.lastUpdated instanceof Date ? data.lastUpdated : new Date(String(data.lastUpdated));
  if (!Number.isNaN(lu.getTime()) && data.outdated !== true) {
    const ageDays = (Date.now() - lu.getTime()) / 86400000;
    if (ageDays > OUTDATED_HINT_DAYS) {
      warnings.push(`${rel}: 最后更新于 ${Math.floor(ageDays)} 天前且未标过期，请确认是否需要 outdated: true`);
    }
  }
}

function checkCategory(rel) {
  if (isIndexPage(rel)) return;
  const topDir = rel.split(path.sep)[0];
  if (!CATEGORIES.includes(topDir)) {
    errors.push(`${rel}: 文件必须位于四个分类目录之一 (${CATEGORIES.join('/')})，当前位于 "${topDir}"`);
  }
}

function resolveAssetRef(ref, fileDir) {
  const clean = ref.split('#')[0].split('?')[0].trim();
  if (!clean || /^https?:\/\//.test(clean)) return null;
  if (clean.startsWith('@/') || clean.startsWith('~/')) return path.join(ROOT, 'src', clean.slice(2));
  if (clean.startsWith('/')) return path.join(ROOT, 'public', clean);
  return path.resolve(fileDir, clean);
}

function checkImageRefs(file, rel) {
  const content = matter(fs.readFileSync(file, 'utf8')).content;
  const refs = new Set();
  const mdImg = /!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;
  const htmlImg = /<img[^>]+src=["']([^"']+)["']/g;
  let m;
  while ((m = mdImg.exec(content))) refs.add(m[1]);
  while ((m = htmlImg.exec(content))) refs.add(m[1]);

  for (const ref of refs) {
    const abs = resolveAssetRef(ref, path.dirname(file));
    if (abs === null) continue; // 外部链接不检查
    if (!fs.existsSync(abs)) {
      errors.push(`${rel}: 引用的图片/附件不存在: ${ref} (解析为 ${path.relative(ROOT, abs)})`);
    }
  }
}

function checkImageSize(file) {
  const size = fs.statSync(file).size;
  if (size > MAX_IMAGE_BYTES) {
    errors.push(`${path.relative(ROOT, file)}: 图片大小 ${(size / 1048576).toFixed(2)} MB 超过 2 MB 门禁，请压缩`);
  }
}

// --- 主流程 ---
const docFiles = walk(DOCS_DIR).filter((f) => /\.(md|mdx)$/.test(f));
for (const file of docFiles) {
  const rel = path.relative(DOCS_DIR, file);
  checkFrontmatter(file, rel);
  checkCategory(rel);
  checkImageRefs(file, rel);
}

if (fs.existsSync(ASSETS_DIR)) {
  for (const file of walk(ASSETS_DIR)) {
    if (IMAGE_EXTS.includes(path.extname(file).toLowerCase())) checkImageSize(file);
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
for (const e of errors) console.error(`❌ ${e}`);
console.log(`\n校验完成: ${docFiles.length} 篇文档, ${errors.length} 个错误, ${warnings.length} 个警告`);
process.exit(errors.length > 0 ? 1 : 0);
