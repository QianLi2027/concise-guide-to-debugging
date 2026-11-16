# 电控调试简明指南

本项目收录电控调试时所遇见的疑难杂症——包括但不限于电机用户文档与实际情况不一致、各种通信问题、编写代码时踩的坑——以避免重复问题的出现，提高调试人员的效率。

站点基于 Astro Starlight 构建，Rust Book 式网页浏览体验。

## 编写规则

1. 文档采用 Markdown/MDX 编写，按分类放入 `src/content/docs/` 下对应目录：
   - `电机/` —— 电机本体、驱动器、用户手册不一致、参数整定、烧录调试
   - `通信协议/` —— CAN、RS485、UART、SPI、I2C、以太网、Modbus 等
   - `控制算法/` —— PID、FOC、滤波器、状态观测器、轨迹规划等
   - `石山代码/` —— 历史遗留、芯片 errata、编译器行为、RTOS 时序玄学 bug
2. 文件名用 kebab-case（如 `rs485-收发时序冲突.md`），图片放 `src/assets/images/<分类>/`，单张不超过 2 MB。
3. 每篇文档必须带 YAML front matter，必需字段：

   ```yaml
   ---
   title: 页面标题
   description: 一句话说清问题
   authors: ['github-用户名']
   maintainers: ['github-用户名']
   lastUpdated: 2025-11-16
   outdated: false
   ---
   ```

   - `outdated: true` 时页面顶部出现红色过期警示横幅。
   - 首页 `index.mdx` 豁免 authors/maintainers 等字段。
   - 可选字段：`tags`、`sidebar.order`。
4. 提交前本地跑 `pnpm validate` 自查；CI 会强制门禁，详见 `scripts/validate.mjs`。

## 常用命令

- `pnpm dev` —— 本地预览（后台用 `pnpm astro dev --background`，配合 `status`/`stop`/`logs`）
- `pnpm build` —— 构建静态站点到 `dist/`
- `pnpm validate` —— front matter / 分类 / 图片门禁
- `pnpm check` —— Astro 类型检查

## 文档写作要点

- 结构建议：现象 → 排查过程 → 根因 → 解决方案 → 验证。
- 警示用 Starlight aside：`:::note` / `:::tip` / `:::caution` / `:::danger`。
- 术语统一参照 `GLOSSARY.md`；架构决策记录见 `docs/adr/`。

## 提交规则

- 提交规范（分支、commit message、front matter、CI 门禁）：[CONTRIBUTING.md](./CONTRIBUTING.md)
- 在线修改规范（浏览器零门槛路径）：[docs/在线修改规范.md](./docs/在线修改规范.md)

## Agent skills

### Issue tracker

issue 与 spec 以 markdown 文件存放在本仓库 `.scratch/` 下。详见 `docs/agents/issue-tracker.md`。

### Triage labels

沿用默认五角色标签：`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`。详见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文（single-context）：根目录 `GLOSSARY.md` + `docs/adr/`。详见 `docs/agents/domain.md`。
