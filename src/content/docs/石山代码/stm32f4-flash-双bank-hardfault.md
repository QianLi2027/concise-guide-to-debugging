---
title: STM32F4 Flash 双 bank 切换后 HardFault
description: 使用 STM32F429 双 bank Flash 在线升级，切换 bank 后执行代码立即 HardFault
authors: ['cmz488']
maintainers: ['cmz488']
lastUpdated: 2025-11-16
outdated: true
tags: ['stm32', 'flash', 'bootloader', 'workaround']
sidebar:
  order: 1
---

:::caution[本文档已过期]
本文档基于 STM32CubeF4 V1.26 库撰写。V1.28 后 ST 已提供官方双 bank 切换例程，请参考 `STM32Cube_FW_F4/Projects/STM32F429I-Discovery/Examples/FLASH/FLASH_DualBank`。
:::

## 现象

STM32F429ZI，2 MB Flash 分为 Bank1（0x08000000）和 Bank2（0x08100000）。Bootloader 位于 Bank1，APP 编译在 Bank2 运行。调用 `HAL_FLASH_OB_Launch()` 切换 `BFB2` 选项字节后，MCU 复位立即进入 HardFault。

## 排查过程

1. 调试器连接后复位，PC 指针落在 `0x08100000` 区域，取指即 HardFault。
2. 检查 `BFB2` 选项字节已置位，VTOR 寄存器被 Bootloader 重映射到 Bank2，但 **SCB->VTOR 未在切换后更新**。
3. 查阅勘误手册 ES0190 Rev 12：双 bank 切换后，**必须重新初始化 SCB->VTOR 并执行 `__DSB(); __ISB();`**，否则取指仍走旧映射。

## 根因

切换 `BFB2` 后，地址重映射由硬件完成，但 Cortex-M4 的向量表偏移寄存器（VTOR）保持旧值，复位后从中断向量表取指时访问了未映射区域。

## Workaround

在切换 `BFB2` 前，先执行：

```c
SCB->VTOR = FLASH_BANK2_BASE;  // 0x08100000
__DSB();
__ISB();
HAL_FLASH_OB_Launch();
```

## 验证

加入 VTOR 重映射后，Bank2 APP 正常启动，连续复位 100 次无 HardFault。
