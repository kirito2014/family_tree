# Robinson Family Tree (罗宾逊家族树)

这是一个现代化的、交互式的家族树管理平台。项目基于 Next.js 构建，使用 SQLite 作为数据库，Prisma 作为 ORM (对象关系映射)，并支持 Tailwind CSS 进行样式设计。

## ✨ 功能特性

*   **交互式家族树视图**：支持拖拽、缩放、点击查看详情。
*   **多语言支持**：内置英文 (EN) 和中文 (CN) 切换。
*   **通讯录视图**：网格化展示所有家庭成员。
*   **时间轴回顾**：通过时间轴筛选特定年代的家庭成员。
*   **数据管理**：支持添加、编辑、删除成员及成员之间的关系连线。
*   **本地数据库**：使用 SQLite 存储数据，无需配置复杂的数据库服务。
*   **数据导出**：支持导出 SQL 格式的数据备份。

## 🛠 技术栈

*   **框架**: [Next.js 16](https://nextjs.org/) (React 19)
*   **语言**: TypeScript
*   **数据库**: SQLite
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **样式**: Tailwind CSS (通过 CDN 引入，便于快速原型开发)

---

## 🚀 本地部署指南

### 1. 环境准备

在开始之前，请确保您的电脑上已经安装了以下软件：

*   [Node.js](https://nodejs.org/) (建议版本 v18.17.0 或更高)
*   npm (通常随 Node.js 一起安装) 或 yarn/pnpm
*   Git

### 2. 克隆项目与安装依赖

```bash
# 1. 克隆项目 (如果您有 Git 仓库)
git clone <your-repo-url>
cd robinson-family-tree

# 2. 安装项目依赖
npm install
```

### 3. 配置数据库 (Prisma & SQLite)

本项目使用 SQLite 本地文件作为数据库。

1.  **创建环境变量文件**：
    复制 `.env.example` 为 `.env`：

    ```bash
    cp .env.example .env
    ```
    *(或者手动创建一个 `.env` 文件，内容参考下方的 `.env.example`)*

2.  **生成 Prisma Client**：
    这将根据 schema 定义生成 TypeScript 类型定义。

    ```bash
    npx prisma generate
    ```

3.  **同步数据库结构**：
    这将创建 `dev.db` SQLite 文件并应用表结构。

    ```bash
    npx prisma db push
    ```

### 4. 启动开发服务器

```bash
npm run dev
```

启动成功后，在浏览器中访问： [http://localhost:3000](http://localhost:3000)

---

## 📂 项目结构说明

*   `app/`: Next.js 应用路由及 Server Actions (`actions.ts` 处理后端逻辑)。
*   `components/`: UI 组件 (导航栏、侧边栏、模态框等)。
*   `views/`: 主要视图组件 (树状图、通讯录、设置)。
*   `services/`: 数据服务层 (`dbService.ts` 为前端与 Server Actions 的桥梁)。
*   `prisma/`: 数据库 Schema 定义及 SQLite 数据库文件。
*   `types.ts`: TypeScript 类型定义。

## ⚠️ 常见问题排查

**Q: 启动时报错 `PrismaClientInitializationError`?**
A: 请确保您已经运行了 `npx prisma db push`，并且项目根目录下生成了 `prisma/dev.db` 文件。

**Q: 页面显示空白或报错 `localStorage is not defined`?**
A: 本项目已针对 SSR (服务端渲染) 进行了优化，数据操作已迁移至 Server Actions。如果遇到此问题，请尝试清除浏览器缓存或重启开发服务器。

**Q: 如何修改数据库结构？**
A: 修改 `prisma/schema.prisma` 文件，然后再次运行 `npx prisma db push` 更新数据库。

## 📄 许可证

MIT License
