# eabi-debug CLI

电控调试指南快速提交命令行工具。

## 安装

```bash
npm install -g @qianli2027/eabi-debug-cli
```

## 前置要求

- Node.js >= 18
- `gh` CLI 已登录（`gh auth login`）

## 命令

### `eabi-debug validate <file.md>`

本地校验文档 front matter 契约，不提交。

```bash
eabi-debug validate ./rs485-时序冲突.md
```

### `eabi-debug submit <file.md>`

校验并提交文档，自动创建分支、commit、push、开 PR。

```bash
eabi-debug submit ./rs485-时序冲突.md
```

选项：

- `--dry-run`: 只校验不提交
- `--category <分类>`: 强制指定分类（覆盖目录检测）
- `--branch <name>`: 自定义分支名

### `eabi-debug login`

检查 GitHub 登录状态。

```bash
eabi-debug login
```

## 文档要求

文档必须位于 `src/content/docs/<分类>/` 或 `src/content/docs/<分类>/<子分类>/` 目录下，且带完整 front matter。

**分类说明**：分类和子分类完全自定义，但建议使用现有分类（硬件/电机/通信协议/控制算法/石山代码）以保持内容组织一致。新分类目录还要在 `astro.config.mjs` 的 `sidebar` 里登记分组，否则不会出现在站点导航。

路径示例：
- `src/content/docs/通信协议/rs485-时序冲突.md`（无子分类）
- `src/content/docs/通信协议/CAN/can-fd-波特率.md`（有子分类）
- `src/content/docs/新分类/新文档.md`（自定义分类，CI 会警告但不阻断）

front matter 示例：

```yaml
---
title: 文档标题
description: 一句话说清问题
authors: ['github-username']
maintainers: ['github-username']
lastUpdated: YYYY-MM-DD
outdated: false
---
```

现有分类（建议使用）：`硬件/`、`电机/`、`通信协议/`、`控制算法/`、`石山代码/`（可自定义新分类）

## 示例

```bash
# 校验
eabi-debug validate ./新文档.md

# 预览提交（不实际创建 PR）
eabi-debug submit ./新文档.md --dry-run

# 实际提交
eabi-debug submit ./新文档.md
```
