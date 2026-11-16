# GLOSSARY

项目统一术语表。新增术语在落地过程中持续增补。

## 内容分类

| 术语 | 定义 | 备注 |
|---|---|---|
| **电机** | 与电机本体、驱动器、用户手册不一致、参数整定、烧录调试相关的疑难杂症 | 侧边栏第 1 组 |
| **通信协议** | CAN、RS485、UART、SPI、I2C、以太网、Modbus 等物理层/链路层/应用层问题 | 侧边栏第 2 组 |
| **控制算法** | PID、FOC、滤波器、状态观测器、轨迹规划等算法实现与调参坑 | 侧边栏第 3 组 |
| **石山代码**（shit mountain） | 因历史遗留、芯片 errata、编译器行为、RTOS 时序等引发的"玄学" bug，通常需要 workaround 而非修复 | 侧边栏第 4 组 |

## Front Matter 字段

| 术语 | 定义 | 类型 |
|---|---|---|
| **slug** | 文件在 URL 中的路径片段，由文件路径自动推导，不在 front matter 里写 | 派生 |
| **outdated** | 标记内容已过期但仍有参考价值，CI 警告不阻断，页面顶部红色横幅 | boolean |
| **maintainers** | 负责回答该文档 Issue 的 GitHub 用户名数组，读者据此 @ 人 | string[] |

## 站点机制

| 术语 | 定义 |
|---|---|
| **editUrl** | Starlight 生成的"在 GitHub 编辑此页"链接，指向仓库 `edit/main/src/content/docs/...`，支撑浏览器零门槛贡献路径 |
| **Pagefind** | Starlight 默认搜索后端，构建时对 `dist/` 静态 HTML 建索引，无需服务端 |
| **autogenerate** | Starlight 侧边栏机制，按 `src/content/docs/` 目录结构自动推导分组与顺序，无需手写 SUMMARY |
