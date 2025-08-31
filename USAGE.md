# An CLI 使用指南

## 安装

1. 全局安装：
```bash
npm install -g an-cli
```

2. 或者本地安装后链接：
```bash
# 在项目根目录
npm install
npm run build
npm link
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

## 交互式选项

运行创建命令后，CLI 会询问以下选项：

1. **框架选择**: React 或 Vue
2. **版本选择**: 
   - React: 16.x, 17.x, 18.x
   - Vue: 2.x, 3.x
3. **TypeScript**: 是否使用 TypeScript
4. **路由**: 是否添加路由库
5. **qiankun 微前端**: 
   - 不使用
   - 主应用
   - 微应用

## 项目特性

- ✅ 内置 Webpack 5 配置
- ✅ 支持 TypeScript 和 JavaScript
- ✅ 集成 ESLint 代码检查
- ✅ 配置 Jest 测试框架
- ✅ SCSS 样式支持
- ✅ 热重载开发服务器
- ✅ qiankun 微前端支持

## 开发命令

创建项目后可以使用：

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint

# 修复代码格式
npm run lint:fix
```

## 示例项目结构

```
my-project/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/ (React) 或 views/ (Vue)
│   ├── styles/
│   ├── utils/
│   ├── App.tsx/vue
│   └── index.tsx 或 main.ts
├── webpack.config.js
├── package.json
├── tsconfig.json (如果使用 TypeScript)
└── .eslintrc.json
```

## 故障排除

1. **权限问题**: 如果安装时遇到权限问题，可以使用 `sudo npm install -g an-cli`
2. **依赖安装失败**: 可以在项目创建后手动运行 `npm install`
3. **TypeScript 错误**: 确保已正确安装 TypeScript 相关依赖

## 支持

如有问题，请查看项目 README 或提交 Issue。