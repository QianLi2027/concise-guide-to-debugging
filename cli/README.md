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

文档必须位于四个分类目录之一，且带完整 front matter：

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

分类目录：`电机/`、`通信协议/`、`控制算法/`、`石山代码/`

## 示例

```bash
# 校验
eabi-debug validate ./新文档.md

# 预览提交（不实际创建 PR）
eabi-debug submit ./新文档.md --dry-run

# 实际提交
eabi-debug submit ./新文档.md
```
