# Triage 标签

各技能使用五个标准分诊角色。本表把这些角色映射到本仓库 issue tracker 实际使用的标签字符串。

| 标准角色              | 本仓库使用的标签    | 含义                                |
| --------------------- | ------------------- | ----------------------------------- |
| `needs-triage`        | `needs-triage`      | 需维护者评估该 issue                |
| `needs-info`          | `needs-info`        | 等待提交者补充信息                  |
| `ready-for-agent`     | `ready-for-agent`   | 已充分描述，可交给 agent 独立完成   |
| `ready-for-human`     | `ready-for-human`   | 需人工实现                          |
| `wontfix`             | `wontfix`           | 不予处理                            |

技能提到某个角色时（例如「打上 AFK-ready 分诊标签」），使用上表对应的标签字符串。

本地 markdown tracker 没有真正的标签系统，因此把标签字符串写进 issue 文件的 `Status:` 行。
