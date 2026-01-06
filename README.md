## PromptMatrix · 多风格 AI Prompt 可视生成器

PromptMatrix 是一个 **纯前端、无需后端** 的多风格 Prompt 生成器，专注于为 ChatGPT、Claude、Gemini 以及本地 LLM 生成 **结构化、高可复用** 的 Prompt。  
你可以在界面左侧选择风格与参数，右侧实时预览生成的 Prompt，一键复制或导出为 Markdown。

界面风格现代、极简、细腻，灵感来自 **Vercel / Linear / Notion**，适合分享到 Reddit / Twitter / X。

---

### 在线体验

- 在线 Demo（占位）：[`https://dark-waterfall-eaba.mrhazeblue.workers.dev/`](https://dark-waterfall-eaba.mrhazeblue.workers.dev/)
- 你可以将本仓库一键部署到 Cloudflare Pages，获得一个同款链接。

### 功能特性

- **多风格 Prompt 模板**
  - 学术风格（Academic）
  - 营销风格（Marketing）
  - 极简风格（Minimal）
  - 角色扮演风格（Role Play）
  - 分析型风格（Analytic）
  - 创意写作风格（Creative）

- **Prompt 结构生成器**
  - `System prompt`：设定 AI 的角色、能力与边界
  - `User prompt`：描述你的具体任务
  - `Examples`：提供示例输入 / 输出（可选）
  - `Constraints`：限制条件、风格、禁用项
  - `Output format`：期望的输出结构与格式

- **可视化编辑器**
  - 左侧：风格选择 + 参数输入（任务概述 / 语气 / 目标受众 / 高级结构块）
  - 右侧：实时生成结构化 Prompt 预览（使用类 Markdown 结构）
  - 一键复制：复制 Plain Prompt 到剪贴板
  - 导出 Markdown：将完整 Prompt 以 `.md` 文件下载

- **UI 主题切换**
  - 支持 `light / dark / neon / retro` 四种主题
  - 支持根据系统暗色模式自动初始选择
  - 柔和过渡动画、玻璃拟物风格、细腻阴影

- **打赏区块（BTC / ETH / USDT）**
  - 页面底部 `Support the project` 卡片
  - 三种加密货币地址（占位，可自行替换）
  - 每种币种提供二维码占位图（`assets/icons/qr-placeholder.svg`）

---

### 技术栈

- **前端技术**
  - 纯 HTML + CSS + 原生 JavaScript
  - 使用现代 CSS（`flex` / `grid` / CSS 变量 / 渐变 / 玻璃拟物）
  - 使用 Google Fonts `Inter` 字体

- **工程特性**
  - 无构建工具、无打包步骤
  - 无后端，仅静态资源
  - 可直接部署到任何静态文件托管（Cloudflare Pages / GitHub Pages 等）

---

### 项目结构

```text
PromptMatrix/
  ├─ index.html        # 主页面，结构 & 布局
  ├─ style.css         # 全局样式、组件风格、Neon/Retro 主题
  ├─ app.js            # 核心逻辑：风格模板、结构生成、预览、复制、导出
  ├─ themes/
  │   ├─ light.css     # Light 主题变量
  │   └─ dark.css      # Dark 主题变量
  ├─ assets/
  │   ├─ logo.svg      # 项目 Logo（矢量）
  │   ├─ preview.png   # 占位截图，可替换
  │   └─ icons/
  │       └─ qr-placeholder.svg  # 打赏二维码占位图
  └─ README.md         # 当前说明文档
```

---

### 本地运行方式

> 无需构建工具，直接打开即可使用。

1. 克隆仓库或直接下载代码：

   ```bash
   git clone https://github.com/HazeBlue/promptmatrix.git
   cd promptmatrix
   ```

2. 直接在浏览器打开：

   - 方法一：双击 / 右键打开 `index.html`

3. 你应该能看到一个双栏布局的页面：左侧风格设置，右侧 Prompt 预览。

---

### 部署到 Cloudflare Pages

PromptMatrix 完全由静态文件构成，非常适合部署到 **Cloudflare Pages**。

#### 1. 连接仓库

- 将本项目推送到你的 GitHub / GitLab 仓库；
- 进入 Cloudflare Dashboard → Pages → `Create a project`；
- 选择 `Connect to Git`，授权后选择对应仓库。

#### 2. 构建配置

- **Framework preset**：`None` / `Static`  
- **Build command**：留空（不需要构建）  
- **Build output directory**：根目录（`.`）或 `PromptMatrix` 子目录，取决于你仓库的结构：

  - 如果仓库根目录就是本项目内容：使用 `.`
  - 如果该项目在仓库的 `PromptMatrix/` 子目录中：

    ```text
    Build output directory: PromptMatrix
    ```

#### 3. 部署 & 预览

- 保存设置后，Cloudflare 会自动构建并部署；
- 首次部署成功后，你会获得一个形如：
  - `https://promptmatrix-yourname.pages.dev`
- 将这个链接填回 README 的 “在线体验链接” 即可。

---

### 打赏 / Support the project

如果 PromptMatrix 对你有帮助，欢迎通过以下任意方式支持项目的持续维护与设计打磨：

- **BTC（比特币）**
  - 地址（占位）：`bc1qk0wxq3dhy5rfyjzqqa6l4k26p4cggrr2cdcrtr`
  - 地址（占位）：`bc1qymcs27w4ah6h37rczzczm9c9meppd30tke6lc3`

- **ETH（以太坊）**
  - 地址（占位）：`0x3ea65897e87747Bea409aBcAe74F4c929083B91B`

- **USDT（ERC20）**
  - 地址（占位）：`0x3ea65897e87747Bea409aBcAe74F4c929083B91B`

---

### Star 请求语

如果你觉得这个项目：

- 帮你快速搭了一个 **高颜值 Prompt 工厂**  
- 节省了你为各种 LLM 手写长 Prompt 的时间  
- 或者你单纯觉得 UI 很漂亮、适合收藏

欢迎在 GitHub 上点一个 **Star ⭐**：

> 你的 Star 是我继续维护、优化交互与视觉细节的重要动力 🙌

---

### License

本项目采用 **MIT License** 开源。  
你可以自由地使用、二次开发、商用，但请在派生项目中保留原始 License。

---

### Roadmap / Ideas

一些未来可以尝试的方向（欢迎 PR）：

- 更多内置风格模板（例如：法律、产品需求、代码审查、面试官等）
- 支持将 Prompt 存为 JSON / 导入导出配置
- 支持多语言 UI 切换（中 / 英）
- 用 localStorage 记住最近一次使用的参数与风格
- 增加「一键分享配置」的 URL（通过 Hash 参数）


