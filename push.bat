@echo off
cd /d "C:\Users\xuxiaof\Desktop\文盲助手\Best City for You"

echo 配置Git用户信息...
git config user.name "AlexnRoro"
git config user.email "lexi.xu@yahoo.com"

echo 检查Git状态...
git status

echo 添加所有修改...
git add .

echo 提交更改...
git commit -m "feat: 添加8大用户体验增强功能

- 快速模式(20题) vs 完整模式(45题)
- 推荐理由详细说明
- 城市封面图片(Unsplash API)
- 个性化标签(8种人格类型)
- 雷达图对比(用户 vs 城市)
- PDF报告导出
- 精美分享卡片
- 徽章系统(8种徽章)

其他优化:
- localStorage答题进度保存
- 加载骨架屏
- 答题一致性检查
- 常量提取和代码优化
- Top 10城市展示(性能优化)
- 修复开发/生产环境路径问题"

echo 推送到GitHub...
git push origin main

echo 完成！
pause
