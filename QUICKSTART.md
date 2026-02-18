# 快速开始指南

## 1. 初始化项目

```bash
cd "Best City for You"
npm install
```

## 2. 生成城市数据

```bash
python tools/build_city_pack.py
```

这将生成 `public/data/cities.lite.v1.json`，包含 70+ 城市数据。

## 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

## 4. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 5. 部署到 GitHub Pages

### 方法 A：自动部署（推荐）

1. 在 GitHub 创建仓库 `Best-City-for-You`
2. 推送代码：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Best-City-for-You.git
git push -u origin main
```

3. 在 GitHub 仓库设置中：
   - Settings → Pages
   - Source 选择 "GitHub Actions"

4. GitHub Actions 会自动构建并部署

5. 访问 `https://YOUR_USERNAME.github.io/Best-City-for-You/`

### 方法 B：手动部署

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

## 6. 自定义配置

### 修改仓库名

如果你的仓库名不是 `Best-City-for-You`，需要修改 `vite.config.ts`：

```typescript
export default defineConfig({
  base: '/YOUR-REPO-NAME/',
  // ...
})
```

### 添加更多城市

编辑 `tools/build_city_pack.py`，在 `cities_data` 列表中添加：

```python
("CITY-ID", "城市名", "国家", "Region", lat, lon, 
 [Climate, Cost, Safety, Mobility, Career, Culture, Nature, International],
 ["标签1", "标签2"], 
 ["风险1", "风险2"], 
 "Confidence")
```

然后重新运行：
```bash
python tools/build_city_pack.py
```

### 修改题目

编辑 `public/data/questions.v1.json`，添加或修改题目。

## 7. 测试流程

1. 访问首页 → 点击"开始测评"
2. 回答 30 道题目（可以快速点击测试）
3. 查看 Top 5 城市推荐
4. 点击城市卡片查看详细分析
5. 查看你的偏好画像

## 8. 常见问题

### Q: 刷新页面出现 404？
A: 使用 Hash Router，URL 应该是 `#/quiz` 或 `#/results` 格式。

### Q: 数据没有加载？
A: 检查浏览器控制台，确保数据文件路径正确。开发环境使用 `/data/`，生产环境使用 `/Best-City-for-You/data/`。

### Q: 如何更新数据版本？
A: 修改数据文件名（如 `v2.json`），同时更新代码中的引用路径。

## 9. 项目特点

- ✅ 完全静态，无需服务器
- ✅ 数据在浏览器本地计算
- ✅ 可离线使用（首次加载后）
- ✅ 响应式设计，支持移动端
- ✅ 结果可复现

## 10. 下一步

- 添加更多城市数据
- 优化匹配算法
- 添加权重调节功能
- 支持结果导出/分享
- 多语言支持
