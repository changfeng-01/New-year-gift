# Tasks
- [x] Task 1: 盘点现有前端栈与落地目录
  - [x] 1.1: 确认是否已有 Next/Vite/纯静态入口
  - [x] 1.2: 确定页面落地路径与资源组织方式（css/asset/images）

- [x] Task 2: 搭建礼物页骨架与导航
  - [x] 2.1: 移动端单页布局（section：欢迎/信件/合照/惊喜）
  - [x] 2.2: 顶部信息区与底部导航（锚点/平滑滚动/选中态）

- [x] Task 3: 实现插画氛围背景（纯 CSS 分层）
  - [x] 3.1: 日间主视觉：天空渐变、太阳、分层山体、树影/地形层
  - [x] 3.2: 夜间氛围：深色渐变、星点、月亮、分层山体、暗角
  - [x] 3.3: 主题切换或分区过渡的视觉策略（最小可用）

- [x] Task 4: 实现“信件”模块（可替换内容）
  - [x] 4.1: 信件排版（标题/落款/段落/引用）
  - [x] 4.2: 展开/收起或沉浸阅读模式（最小交互）
  - [x] 4.3: 文案替换机制（单文件替换，不改结构）

- [x] Task 5: 实现“合照”画廊（本地图片 + 预览）
  - [x] 5.1: 缩略图网格与占位骨架
  - [x] 5.2: 点击预览（lightbox）与关闭返回
  - [x] 5.3: 图片加载策略（懒加载/适配不同尺寸）

- [x] Task 6: 实现“惊喜”分区（至少 2 个互动）
  - [x] 6.1: 记忆时间线卡片（可配置条目）
  - [x] 6.2: 抽卡/随机一句（可配置文案数组）
  - [x] 6.3: 可选加分项：刮刮卡揭晓（如果不影响主交付）

- [x] Task 7: 动效与可访问性收口
  - [x] 7.1: 分层淡入与过渡动效（尊重减少动态偏好）
  - [x] 7.2: 可点击区域、键盘可用性、文本对比度
  - [x] 7.3: 离线可用性检查（尽量不依赖外部资源）

- [x] Task 8: Vercel 部署与验收交付（Trae 一键部署）
  - [x] 8.1: 静态站点部署约定（根路径 /，相对路径资源，刷新不 404）
  - [x] 8.2: 线上部署验证（Vercel Preview/Production）
  - [x] 8.3: 主流视口验证（320px 至桌面）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 2
- Task 6 depends on Task 2
- Task 7 depends on Task 3
- Task 7 depends on Task 4
- Task 7 depends on Task 5
- Task 7 depends on Task 6
- Task 8 depends on Task 7
