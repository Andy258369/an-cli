# Changelog

## [1.0.4] - 2024-08-31

### 修复
- 🐛 **修复 Sass 兼容性问题**
  - 升级 sass 版本到 ^1.69.0，解决 legacy JS API 警告
  - 配置 sass-loader 使用 modern-compiler API
  - 消除 "Deprecation The legacy JS API is deprecated" 警告
- 🐛 **修复 React TypeScript 编译问题**
  - 改进 ts-loader 配置，添加 transpileOnly 和 compilerOptions
  - 修复 tsconfig.json 条件模板导致的空文件问题
  - 确保 TypeScript 和非 TypeScript 项目都能正常编译
- 🔧 **优化 webpack 配置**
  - 统一 sass-loader 配置格式，提高稳定性
  - 改进 TypeScript 编译性能
  - 修复条件模板问题

### 改进
- 📦 更新关键依赖版本以提高兼容性
- ✅ 全面测试验证所有配置正确生成

### 解决的问题
- Vue2 项目的 sass deprecation 警告
- React TypeScript 项目 ts-loader 编译失败
- 空 tsconfig.json 导致的构建问题

## [1.0.3] - 2024-08-31

### 修复
- 🐛 修复文件扩展名生成逻辑
- 🐛 修复布尔值条件处理问题  
- 🐛 修复模板文件嵌套条件语句
- 🔧 改进文件路径处理

## [1.0.2] - 2024-08-31

### 修复
- 修复了 Vue 模板生成的问题
- 修复了 GitHub Actions 权限配置问题
- 清理了项目中的测试文件
- 优化了模板文件扩展名处理逻辑

## [1.0.1] - 2024-08-31

### 修复
- 修复了 Vue 模板生成的问题
- 修复了 GitHub Actions 权限配置问题
- 清理了项目中的测试文件
- 优化了模板文件扩展名处理逻辑

## [1.0.0] - 2024-08-31

### 新增
- 初始版本发布
- 支持 React 和 Vue 项目模板生成
- 支持 TypeScript 和微前端 qiankun 集成
- 完整的 CLI 工具功能
