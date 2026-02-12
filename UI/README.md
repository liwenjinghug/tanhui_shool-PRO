# UI 开发目录（独立于后端）

说明：
- 前端所有页面与源代码应集中放在 `UI/` 目录下，不再把静态页面放入后端 `src/main/resources/static` 下（你已要求："不要后端静态页面").
- `UI/` 目录包含两种可用的开发方式：
  1. 轻量单页（基于 Vue CDN，无需构建）: `login-vue.html`
  2. 组件化 SPA（Vue + Vite）: 源码在 `src/`，使用 `npm run dev` 开发，使用 `npm run build` 打包。

快速运行

1) 直接用 Vue CDN（无需构建）
```powershell
cd D:\惠普低碳\demo\UI
# 直接用浏览器打开 login-vue.html，或运行一个本地静态服务器
python -m http.server 8000
# 然后访问 http://localhost:8000/login-vue.html
```

2) 使用 Vue + Vite（模块化开发，支持热重载）
```powershell
cd D:\惠普低碳\demo\UI
npm install
npm run dev
# 默认会在配置的端口（vite.config.js 中的 server.port）启动，访问例如 http://localhost:8080
```

联调后端（建议）
- 方案 A（开发时保留后端在 8080）：把 Vite 运行在另一个端口（例如 5173），并在 `vite.config.js` 中配置 proxy 将 `/api` 转发到后端（http://localhost:8080），这样前端请求 `/api/...` 时会代理到后端。
- 方案 B（如果你希望前端在 8080 且后端也在 8080）：需先把后端移到其他端口再启动前端占用 8080（不推荐同时占用相同端口）。

发布流程（建议）
- 推荐使用 `npm run build` 在 `UI` 生成 `dist/`，然后把产物部署到独立静态服务器（Nginx）或云存储；不要把工程源码直接复制到后端静态目录。

备注
- 当前仓库 `UI/` 已包含示例文件 `login-vue.html`（无构建）和 Vue+Vite 的开发文件。前端开发应集中在 `UI/`，后端仅提供 API 服务。

需要我帮你做什么？
- 我可以：
  - 把 Vite 的 proxy 配置好并启动 dev server（你只需保持后端在 8080）
  - 或把 `UI` 打包产物自动集成到后端构建流程（如果你改变主意）
  - 或改进登录页样式/交互并替换为更完整的 Vue 组件

回复你想要我继续的事项（例如：配置 proxy 并启动 dev；或我现在把 login-vue.html 部署到静态服务器并验收）。
