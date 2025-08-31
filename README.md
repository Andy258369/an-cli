# an-frame-cli

一个自定义的前端构建框架CLI，支持快速创建 React 和 Vue 项目，内置 Webpack 5 配置，支持 TypeScript 和 qiankun 微前端。

## 特性

- 🚀 **快速创建项目**: 支持 React 和 Vue 项目快速创建
- ⚡ **内置 Webpack 5**: 开箱即用的现代化构建配置
- 🎯 **TypeScript 支持**: 可选择启用 TypeScript
- 🌐 **qiankun 微前端**: 集成 qiankun 微前端解决方案
- 📦 **多版本支持**: 支持 React 16/17/18 和 Vue 2/3
- 🔧 **路由集成**: 可选择集成对应框架的路由库
- 🛠️ **开发工具**: 内置 ESLint、Jest 等开发工具

## 安装

```bash
npm install -g an-frame-cli
```

## 使用方法

### 创建新项目

```bash
an create my-project
```

### 在当前目录初始化项目

```bash
an init
```

### 命令选项

- `-f, --force`: 强制覆盖已存在的目录或文件

## 项目配置选项

在创建项目时，CLI 会询问以下配置选项：

1. **框架选择**: React 或 Vue
2. **版本选择**: 
   - React: 16.x, 17.x, 18.x
   - Vue: 2.x, 3.x
3. **TypeScript**: 是否启用 TypeScript 支持
4. **路由**: 是否添加路由库 (React Router / Vue Router)
5. **qiankun 微前端**: 是否集成 qiankun
   - 主应用 (Main App): 用于承载微应用的主应用
   - 微应用 (Micro App): 可以被主应用加载的微应用

## 项目结构

### React 项目结构

```
my-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── webpack.config.js
├── package.json
├── tsconfig.json (如果启用 TypeScript)
└── .eslintrc.json
```

### Vue 项目结构

```
my-vue-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── styles/
│   ├── utils/
│   ├── App.vue
│   └── main.ts
├── webpack.config.js
├── package.json
├── tsconfig.json (如果启用 TypeScript)
└── .eslintrc.json
```

## 开发命令

创建项目后，可以使用以下命令：

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint

# 修复代码风格问题
npm run lint:fix
```

## qiankun 微前端配置

### 主应用配置

如果选择创建 qiankun 主应用，项目会自动配置微应用注册：

```javascript
import { registerMicroApps, start } from 'qiankun';

// 注册微应用
registerMicroApps([
  {
    name: 'micro-app-react',
    entry: '//localhost:3001',
    container: '#micro-container',
    activeRule: '/micro-react',
  },
  {
    name: 'micro-app-vue',
    entry: '//localhost:3002', 
    container: '#micro-container',
    activeRule: '/micro-vue',
  },
]);

// 启动 qiankun
start();
```

### 微应用配置

微应用会自动配置生命周期函数，支持独立运行和被主应用加载：

```javascript
// 导出生命周期函数
export async function bootstrap() {
  console.log('微应用 bootstrap');
}

export async function mount(props) {
  console.log('微应用 mount', props);
  render(props);
}

export async function unmount(props) {
  console.log('微应用 unmount', props);
  // 清理逻辑
}
```

## 技术栈

- **构建工具**: Webpack 5
- **开发语言**: JavaScript / TypeScript
- **样式**: CSS / SCSS
- **代码检查**: ESLint
- **测试框架**: Jest
- **微前端**: qiankun

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0

- 🎉 首个版本发布
- ✨ 支持 React 和 Vue 项目创建
- ✨ 集成 qiankun 微前端
- ✨ 支持 TypeScript
- ✨ 内置 Webpack 5 配置
- ✨ 支持多版本框架选择
