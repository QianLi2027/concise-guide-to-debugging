# 电控调试简明指南

收录电控调试中遇到的疑难杂症——电机、通信协议、控制算法、石山代码——避免重复踩坑，提升调试效率。

## 站点

基于 [Astro Starlight](https://starlight.astro.build) 构建，Rust Book 式网页浏览体验。

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地预览（热重载），默认 http://localhost:4321 |
| `pnpm build` | 构建静态站点到 `dist/` |
| `pnpm validate` | CI 门禁：校验 front matter、分类目录、图片引用与大小 |
| `pnpm check` | Astro 类型检查 |

## 贡献指南

### 最快方式（无需任何环境）

打开任意文档页面，点击右上角 **"在 GitHub 编辑此页"**，直接在浏览器里改 Markdown，提交 Pull Request。

### 本地写作

```bash
git clone https://github.com/QianLi2027/concise-guide-to-debugging.git
cd concise-guide-to-debugging
pnpm install
pnpm dev        # 边写边预览
pnpm validate   # 提交前自查（CI 会再跑一遍）
```

### 文档放哪里

按分类放进对应目录，文件名用 kebab-case：

```text
src/content/docs/
├── 硬件/
├── 电机/
├── 通信协议/
├── 控制算法/
└── 石山代码/
```

图片放在 `src/assets/images/<分类>/`，单张不超过 **2 MB**，正文用相对路径引用。

### Front matter 契约

每篇文档必须带以下 YAML 头：

```yaml
---
title: RS485 半双工收发时序冲突
description: 一句话说清问题
authors: ['cmz488']          # GitHub 用户名
maintainers: ['cmz488']      # 负责答疑的人
lastUpdated: 2025-11-16      # YYYY-MM-DD
outdated: false              # 内容过期标 true，页面顶部出现红色警示横幅
tags: ['rs485', '时序']       # 可选
---
```

> `src/content/docs/index.mdx`（首页）豁免 authors/maintainers 等字段。

### CI 门禁规则

| 检查项 | 级别 |
| --- | --- |
| 缺必需 front matter 字段 / 类型错误 | ❌ 阻断 |
| 文件不在 `src/content/docs/<分类>/` 之下 | ❌ 阻断 |
| 引用的图片/附件不存在 | ❌ 阻断 |
| 单张图片 > 2 MB | ❌ 阻断 |
| `outdated: true` | ⚠️ 警告不阻断 |
| `lastUpdated` 超过 180 天且未标过期 | ⚠️ 警告 |

push 到 `main` 后，GitHub Actions 自动跑门禁并部署到 Pages。

## 快速提交

### 方式 1: 网页提交（零安装）

点击站点首页"提交文档"按钮，或访问 [Issue 表单](https://github.com/QianLi2027/concise-guide-to-debugging/issues/new?template=submit-doc.yml)。

### 方式 2: CLI 提交（本地快速）

```bash
npm install -g @qianli2027/eabi-debug-cli
eabi-debug validate ./新文档.md
eabi-debug submit ./新文档.md
```

详见 [CLI 文档](./cli/README.md)。

## 规范文档

- **提交规范**：[CONTRIBUTING.md](./CONTRIBUTING.md) —— 分支策略、commit message 格式、front matter 契约、CI 门禁
- **在线修改规范**：[docs/在线修改规范.md](./docs/在线修改规范.md) —— 浏览器零门槛贡献路径
