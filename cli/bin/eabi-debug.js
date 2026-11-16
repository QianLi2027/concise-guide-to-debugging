#!/usr/bin/env node
/**
 * eabi-debug: 电控调试指南快速提交 CLI
 * 零依赖（仅用 Node 内置模块 + gh CLI）
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';



const KNOWN_CATEGORIES = ['电机', '通信协议', '控制算法', '石山代码'];
const REPO = 'QianLi2027/concise-guide-to-debugging';

const USAGE = `eabi-debug - 电控调试指南快速提交 CLI

用法:
  eabi-debug submit <file.md>   校验并提交文档到指南（创建 PR）
  eabi-debug validate <file.md> 仅本地校验，不提交
  eabi-debug login              检查 GitHub 登录状态
  eabi-debug help               显示本帮助

选项:
  --dry-run                     只校验不提交（submit 时可用）
  --category <分类>             强制指定分类（覆盖目录检测）
  --branch <分支名>             自定义分支名（默认 submit/<slug>-<timestamp>）

文档路径要求:
  文件必须位于 src/content/docs/<分类>/ 或 src/content/docs/<分类>/<子分类>/ 目录下。
  分类和子分类完全自定义，但建议使用现有分类（电机/通信协议/控制算法/石山代码）。

示例:
  eabi-debug submit src/content/docs/通信协议/RS485/时序冲突.md
  eabi-debug validate src/content/docs/新分类/新文档.md
  eabi-debug login
`;

function log(msg) {
  console.log(`[eabi-debug] ${msg}`);
}

function error(msg) {
  console.error(`[eabi-debug] ❌ ${msg}`);
  process.exit(1);
}

function checkGh() {
  const r = spawnSync('gh', ['auth', 'status'], { stdio: 'pipe' });
  if (r.status !== 0) {
    error('未登录 GitHub。请先运行: gh auth login');
  }
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) {
    error(`命令失败: ${cmd} ${args.join(' ')}`);
  }
  return r;
}

function parseFrontMatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: raw };

  const yaml = match[1];
  const data = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      } else if (val === 'true' || val === 'false') {
        val = val === 'true';
      } else {
        val = val.replace(/^['"]|['"]$/g, '');
      }
      data[m[1]] = val;
    }
  }
  return { data, content: raw.slice(match[0].length) };
}

function validateDoc(file) {
  const { data } = parseFrontMatter(file);
  const errors = [];
  const warnings = [];

  const required = ['title', 'description', 'authors', 'maintainers', 'lastUpdated', 'outdated'];
  for (const field of required) {
    if (!(field in data) || data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`缺少必需字段: ${field}`);
    }
  }

  if (data.authors && !Array.isArray(data.authors)) {
    errors.push('authors 必须是数组');
  }
  if (data.maintainers && !Array.isArray(data.maintainers)) {
    errors.push('maintainers 必须是数组');
  }

  if (data.lastUpdated && !/^\d{4}-\d{2}-\d{2}$/.test(data.lastUpdated)) {
    errors.push('lastUpdated 必须是 YYYY-MM-DD 格式');
  }

  if (data.outdated === true) {
    warnings.push('本文档已标记过期 (outdated: true)');
  }

  const relPath = path.relative(process.cwd(), file);
  const parts = relPath.split(path.sep);
  const docsIndex = parts.indexOf('docs');
  
  let category = null;
  if (docsIndex !== -1 && docsIndex + 1 < parts.length) {
    category = parts[docsIndex + 1];
  }

  if (!category) {
    errors.push('文件必须位于 src/content/docs/<分类>/ 目录下');
  } else if (!KNOWN_CATEGORIES.includes(category)) {
    warnings.push(`分类 "${category}" 不在现有四大分类中，将创建新分类目录`);
  }

  return { errors, warnings, data };
}

function cmdValidate(file) {
  if (!fs.existsSync(file)) error(`文件不存在: ${file}`);
  const { errors, warnings } = validateDoc(file);
  for (const w of warnings) log(`⚠️  ${w}`);
  for (const e of errors) log(`❌ ${e}`);
  if (errors.length > 0) {
    error(`校验失败: ${errors.length} 个错误`);
  }
  log('✅ 校验通过');
}

function cmdSubmit(file, opts) {
  if (!fs.existsSync(file)) error(`文件不存在: ${file}`);
  checkGh();

  const { errors, warnings, data } = validateDoc(file);
  for (const w of warnings) log(`⚠️  ${w}`);
  if (errors.length > 0) {
    for (const e of errors) log(`❌ ${e}`);
    error(`校验失败: ${errors.length} 个错误`);
  }

  const relPath = path.relative(process.cwd(), file);
  const parts = relPath.split(path.sep);
  const docsIndex = parts.indexOf('docs');
  
  let category = opts.category;
  let subcategory = null;
  if (!category && docsIndex !== -1 && docsIndex + 1 < parts.length) {
    category = parts[docsIndex + 1];
    if (docsIndex + 2 < parts.length && parts[docsIndex + 2] !== path.basename(file)) {
      subcategory = parts[docsIndex + 2];
    }
  }
  
  const slug = path.basename(file, '.md');
  const branch = opts.branch || `submit/${slug}-${Date.now()}`;

  if (opts.dryRun) {
    log('🔍 dry-run 模式，不执行提交');
    log(`   分类: ${category}`);
    if (subcategory) log(`   子分类: ${subcategory}`);
    log(`   分支: ${branch}`);
    log(`   标题: ${data.title}`);
    return;
  }

  log('开始提交...');
  log(`   分类: ${category}`);
  if (subcategory) log(`   子分类: ${subcategory}`);
  run('git', ['checkout', '-b', branch]);
  run('git', ['add', file]);
  run('git', ['commit', '-m', `feat(${category}): ${data.title}`]);
  run('git', ['push', '-u', 'origin', branch]);

  const prTitle = `[提交] ${data.title}`;
  const prBody = `由 eabi-debug CLI 提交\n\n分类: ${category}\n作者: ${data.authors.join(', ')}`;
  run('gh', ['pr', 'create', '--title', prTitle, '--body', prBody, '--repo', REPO]);

  log('✅ 提交完成，PR 已创建');
}

function cmdLogin() {
  const r = spawnSync('gh', ['auth', 'status'], { stdio: 'inherit' });
  if (r.status === 0) {
    log('✅ GitHub 已登录');
  } else {
    error('未登录。请运行: gh auth login');
  }
}

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  console.log(USAGE);
  process.exit(0);
}

if (cmd === 'login') {
  cmdLogin();
} else if (cmd === 'validate') {
  if (!args[1]) error('缺少文件参数');
  cmdValidate(args[1]);
} else if (cmd === 'submit') {
  if (!args[1]) error('缺少文件参数');
  const opts = {
    dryRun: args.includes('--dry-run'),
    category: args.includes('--category') ? args[args.indexOf('--category') + 1] : null,
    branch: args.includes('--branch') ? args[args.indexOf('--branch') + 1] : null,
  };
  cmdSubmit(args[1], opts);
} else {
  error(`未知命令: ${cmd}`);
}
