# Tasks

- [x] Task 1: 实现对象池系统
  - [x] SubTask 1.1: 创建 ObjectPool 通用类，支持对象的获取、归还、预分配，包含完整的对象重置机制
  - [x] SubTask 1.2: 创建 ParticlePool 粒子对象池，用于复用圆形粒子，确保粒子状态完全重置
  - [x] SubTask 1.3: 创建 TextPool 文本对象池，用于复用伤害数字，确保文本样式正确重置
  - [x] SubTask 1.4: 创建 EffectPool 特效对象池，用于复用攻击/受伤特效
  - [x] SubTask 1.5: 为所有对象池添加降级方案，池空时创建新对象而非报错
  - [x] SubTask 1.6: 测试对象池的正确性，确保不会出现状态污染

- [x] Task 2: 优化 Entity 特效系统
  - [x] SubTask 2.1: 重构 Entity.showDamageEffect 使用对象池，保持原有视觉效果
  - [x] SubTask 2.2: 重构 Entity.showAttackEffect 使用对象池，保持原有视觉效果
  - [x] SubTask 2.3: 重构 Entity.createDeathEffect 使用对象池并限制粒子数量（≤15），保持原有视觉效果
  - [x] SubTask 2.4: 优化 Entity.addIdleAnimation，减少 Tween 创建，保持动画流畅性
  - [x] SubTask 2.5: 验证所有特效的颜色、透明度、大小与优化前一致
  - [x] SubTask 2.6: 测试特效在连续触发时的表现，确保无视觉异常

- [x] Task 3: 优化 CombatSystem 碰撞检测
  - [x] SubTask 3.1: 实现空间分区系统（网格或四叉树），确保算法正确性
  - [x] SubTask 3.2: 重构 checkShieldBlock 使用空间分区，保持原有阻挡逻辑
  - [x] SubTask 3.3: 重构 checkWolfImpassable 使用空间分区，保持原有阻挡逻辑
  - [x] SubTask 3.4: 添加距离计算缓存机制，确保缓存更新时机正确
  - [x] SubTask 3.5: 测试碰撞检测的正确性，确保游戏逻辑不受影响
  - [x] SubTask 3.6: 对比优化前后的碰撞检测结果，确保一致性

- [x] Task 4: 优化 Tween 动画管理
  - [x] SubTask 4.1: 创建 TweenManager 统一管理 Tween，确保清理机制完善
  - [x] SubTask 4.2: 实现 Tween 配置复用机制，保持动画效果一致
  - [x] SubTask 4.3: 确保实体销毁时正确清理所有关联 Tween，防止内存泄漏
  - [x] SubTask 4.4: 优化频繁动画（如受伤闪烁）的 Tween 创建，保持视觉效果
  - [x] SubTask 4.5: 测试动画的流畅性和完整性，确保无卡顿或跳帧
  - [x] SubTask 4.6: 验证动画参数（持续时间、缓动函数等）与优化前一致

- [x] Task 5: 实现实体数量控制和批量渲染
  - [x] SubTask 5.1: 在 BattleScene 添加最大实体数量限制，确保不影响游戏体验
  - [x] SubTask 5.2: 实现实体死亡后的及时清理机制，防止内存泄漏
  - [x] SubTask 5.3: 优化精灵渲染批次（如使用 Sprite Sheet），保持视觉效果
  - [x] SubTask 5.4: 实现视口裁剪，只更新可见实体，确保边界处理正确
  - [x] SubTask 5.5: 测试实体数量限制对游戏平衡性的影响
  - [x] SubTask 5.6: 验证批量渲染后的精灵显示效果与优化前一致

- [x] Task 6: 添加性能监控工具
  - [x] SubTask 6.1: 创建 PerformanceMonitor 类
  - [x] SubTask 6.2: 实现 FPS 监控和日志记录
  - [x] SubTask 6.3: 实现内存使用监控
  - [x] SubTask 6.4: 在开发模式下显示性能面板

- [ ] Task 7: 性能测试和验证
  - [ ] SubTask 7.1: 在复杂战斗场景下测试帧率，确保稳定在 30fps+
  - [ ] SubTask 7.2: 验证内存使用是否稳定，检测内存泄漏
  - [ ] SubTask 7.3: 测试操作响应延迟，确保 < 100ms
  - [ ] SubTask 7.4: 对比优化前后的性能数据，生成报告
  - [ ] SubTask 7.5: 验证所有关卡的可玩性，确保游戏逻辑正确
  - [ ] SubTask 7.6: 对比优化前后的视觉效果，录制视频进行对比
  - [ ] SubTask 7.7: 在低端设备上测试，确保可玩性
  - [ ] SubTask 7.8: 进行长时间运行测试（30分钟+），确保稳定性

# Task Dependencies
- [Task 2] 依赖 [Task 1] - Entity 特效优化需要先实现对象池
- [Task 3] 独立 - 碰撞检测优化可独立进行
- [Task 4] 独立 - Tween 优化可独立进行
- [Task 5] 依赖 [Task 2] - 实体控制需要特效系统优化完成
- [Task 6] 独立 - 性能监控可独立实现
- [Task 7] 依赖 [Task 1-6] - 测试验证需要所有优化完成
