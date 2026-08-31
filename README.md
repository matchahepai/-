# 王博晨个人作品集

产品设计、用户体验与 AI 辅助设计作品集。网站包含动态封面、个人介绍、连续横向项目目录，以及七个支持左右滑动与进度定位的高清项目详情页。

## 本地预览

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

Windows PowerShell 如果不支持项目中的 Bash 脚本，可直接运行：

```powershell
npx vite
```

默认访问地址为 `http://localhost:5173`。

## 构建

macOS / Linux：

```bash
npm run build
```

Windows PowerShell：

```powershell
npx vinext build
```

## 内容位置

- `app/page.tsx`：首页与项目目录
- `app/work/[slug]/`：项目详情页与横向浏览组件
- `app/project-data.ts`：项目名称、年份、分类与图片配置
- `public/project-visuals/`：项目封面图
- `public/portfolio/`：作品集高清横向页面

## 自行发布

项目基于 Vinext / Vite，可部署到支持 Cloudflare Workers 的托管环境，也可重新导入 Codex Sites。

如果要在 Codex Sites 中创建一个全新网站，请先删除或替换 `.openai/hosting.json` 里的 `project_id`，避免覆盖当前线上项目。部署到其他平台时，这个文件可以忽略。

所有图片均随源码一同打包，不依赖外部图床。
