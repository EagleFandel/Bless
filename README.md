# FormuLess - 理科笔记编辑器

极简的数学/物理/化学公式笔记工具

## 特性

- 📱 **手机端编辑** - Markdown + LaTeX 实时渲染
- ⌚ **Apple Watch 阅读** - 自动同步显示
- 💾 **自动保存** - 无需手动操作
- 🎯 **极致简洁** - 专注内容本身

## 快速开始

```bash
# 安装依赖
npm install

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 数据库管理

```bash
# 查看数据库内容（可视化界面）
npm run db:studio
```

## 使用方法

### 手机端
直接输入 Markdown 和 LaTeX 公式，自动保存

### Apple Watch
打开相同网址，自动进入阅读模式

### 公式语法

行内公式：`$E = mc^2$`

独立公式：
```
$$
U = \frac{U_m}{\sqrt{2}}
$$
```

## 技术栈

- Next.js 14
- React 18
- KaTeX (公式渲染)
- Tailwind CSS
- TypeScript

## 部署

```bash
npm run build
npm start
```

推荐部署到 Vercel，支持自动 HTTPS 和全球 CDN。
