# 项目说明

本项目收录电控调试时所遇见的疑难杂症--包括但不限于电机用户文档与实际情况不一致、各种通信问题、编写代码时踩的坑--以避免一些重复问题的出现，提供调试人员的效率


# 编写规则

1. 本项目采用markdown文档方式编写
2. 采用电机，通信协议，控制算法，石山代码分类，如果有新分类后续添加
3. md采用yaml头提交元信息，元信息包括：分类，编写以及维护人员，最后修改时间，是否过期，如果后续有新的元信息，再添加


# 提交规则

详见[CONTRIBUTING.md](./CONTRIBUTING.md)

## Agent skills

### Issue tracker

issue 与 spec 以 markdown 文件存放在本仓库 `.scratch/` 下。详见 `docs/agents/issue-tracker.md`。

### Triage labels

沿用默认五角色标签：`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`。详见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文（single-context）：根目录 `GLOSSARY.md` + `docs/adr/`。详见 `docs/agents/domain.md`。

