# 使用 Astro Starlight 构建电控调试指南静态站

团队需要一个可多人协作、Rust Book 式网页浏览的调试指南。选择 Astro Starlight 作为静态站点生成器，配合 GitHub（组织 QianLi2027 公开仓库）的 PR 流程做协作，GitHub Pages 做托管。

选择 Starlight 而非 mdBook 的核心原因：Starlight 原生支持 i18n、Pagefind 全文搜索、组件覆写（用于实现自定义过期警示横幅）、以及每页"在 GitHub 编辑"链接——后者让没有 Node 环境的嵌入式队友也能通过浏览器直接贡献，这是"方便多人提交"这一硬性需求的关键。mdBook 虽更贴近 Rust Book 外观，但组件扩展与在线编辑能力较弱，且要求贡献者本地安装 Rust 工具链。

**Consequences**: 站点依赖 Node/pnpm 工具链，贡献者本地预览需安装 Node；但浏览器在线编辑路径不受此限。front matter 契约（authors/maintainers/lastUpdated/outdated）通过 Starlight 的 docsSchema extend 机制做构建期校验，CI 用 scripts/validate.mjs 做唯一强制门禁。
