# Todo App 前端工程

基于 **Nuxt 4** 和 **Element Plus** 构建的单页应用 (SPA)。

## 🛠 技术栈
- **核心框架**: Nuxt 4 + Vue 3 (Composition API)
- **UI 组件库**: Element Plus
- **样式重置**: Normalize.css
- **HTTP 请求**: Axios (封装于 `app/utils/request.ts`)
- **语言**: TypeScript

## 📂 目录结构 (Nuxt 4 标准)

本项目启用 `future: { compatibilityVersion: 4 }`，源码目录结构如下：

```
frontend/
├── app/                  # 源码根目录
│   ├── api/              # API 接口定义
│   ├── components/       # UI 组件
│   ├── pages/            # 页面路由
│   ├── utils/            # 工具函数
│   └── app.vue           # 应用入口
├── nuxt.config.ts        # Nuxt 配置文件
└── package.json
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
服务将在 `http://localhost:3001` 启动。
*   默认访问 `/` 会重定向到 `/todo`。
*   API 请求会通过代理转发到后端 `http://localhost:8080`。

### 构建生产版本
```bash
npm run build
```
构建产物将位于 `.output/` 目录。

## 📝 开发规范

1.  **自动导入**: 利用 Nuxt 强大的自动导入功能，组件无需手动 import 即可在模板中使用。
2.  **路径别名**: 使用 `@` 指向 `frontend/app` 目录。
3.  **样式**: 使用 Scoped CSS，避免全局样式污染。