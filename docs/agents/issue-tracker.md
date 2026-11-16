# Issue tracker: 本地 Markdown

本仓库的 issue 与 spec 以 markdown 文件形式存放在 `.scratch/` 下。

## 约定

- 一个特性一个目录：`.scratch/<feature-slug>/`
- 规范（spec）：`.scratch/<feature-slug>/spec.md`
- 实现 issue：一张票一个文件，位于 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，编号从 `01` 起；禁止把所有票合写进一个文件
- 分诊状态记录在每个 issue 文件顶部附近的 `Status:` 行（角色字符串见 `triage-labels.md`）
- 评论与讨论历史追加到文件末尾的 `## Comments` 标题下
- `.scratch/` 是本仓库唯一的 issue 存储，必须提交进 git，不得写入 `.gitignore`

## 当技能说「发布到 issue tracker」

在 `.scratch/<feature-slug>/` 下新建文件（目录不存在则创建）。

## 当技能说「取出相关票据」

读取所指路径的文件。用户通常会直接给出路径或 issue 编号。

## Wayfinding 操作

供 `/wayfinder` 使用。**地图**是一个文件，每张票对应一个子文件。

- **地图**：`.scratch/<effort>/map.md`（承载 Notes / 已定决策 / 未明事项正文）
- **子票**：`.scratch/<effort>/issues/NN-<slug>.md`，编号从 `01` 起，正文写该票要回答的问题。`Type:` 行记录票据类型（`research`/`prototype`/`grilling`/`task`），`Status:` 行记录 `claimed`/`resolved`
- **阻塞**：顶部附近写 `Blocked by: NN, NN`。所列文件全部 `resolved` 时才视为解除阻塞
- **前沿**：扫描 `.scratch/<effort>/issues/`，取未关闭、未阻塞、未认领的文件，编号小的优先
- **认领**：动工前先把 `Status:` 改为 `claimed` 并保存
- **结案**：在 `## Answer` 标题下追加答案，把 `Status:` 改为 `resolved`，再向 `map.md` 的「已定决策」追加一条上下文指针（要点 + 链接）
