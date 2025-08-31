# an-cli CI/CD 配置指南

## 🚀 概述

本项目已配置完整的 CI/CD 流程，支持：
- ✅ 自动化测试（多个 Node.js 版本）
- ✅ 自动构建和验证
- ✅ 智能版本管理
- ✅ 自动发布到 npm
- ✅ 自动生成 GitHub Release
- ✅ 自动更新 CHANGELOG

## 🔧 配置要求

### 1. GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

```
NPM_TOKEN=your_npm_publish_token
```

#### 获取 NPM Token：
1. 登录 npm 官网
2. 进入 Access Tokens 页面
3. 创建新的 Automation token
4. 复制 token 并添加到 GitHub Secrets

### 2. GitHub 权限配置

确保 GitHub Actions 有写入权限：
- Settings > Actions > General
- Workflow permissions: 选择 "Read and write permissions"
- 勾选 "Allow GitHub Actions to create and approve pull requests"

## 📦 版本管理策略

### 自动版本识别

CI/CD 会根据提交信息自动判断版本类型：

| 提交信息关键词 | 版本类型 | 示例 |
|---------------|----------|------|
| `BREAKING CHANGE`, `major` | Major (1.0.0 → 2.0.0) | `feat: add new API BREAKING CHANGE` |
| `feat`, `feature` | Minor (1.0.0 → 1.1.0) | `feat: add React 19 support` |
| 其他 | Patch (1.0.0 → 1.0.1) | `fix: resolve template issue` |

### 手动版本管理

也可以使用预设的 npm 脚本：

```bash
# Patch版本（Bug修复）
npm run release:patch

# Minor版本（新功能）
npm run release:minor

# Major版本（破坏性更改）
npm run release:major
```

## 🔄 工作流程

### 1. 开发流程
```bash
# 1. 开发功能
git checkout -b feature/new-feature
# ... 开发代码 ...

# 2. 提交代码（使用语义化提交信息）
git commit -m "feat: add Vue 3.4 support"
git push origin feature/new-feature

# 3. 创建 Pull Request
# 4. 合并到 main 分支
```

### 2. 自动发布流程

当代码推送到 `main` 或 `master` 分支时：

1. **测试阶段**
   - 在 Node.js 16.x, 18.x, 20.x 上运行测试
   - 运行 TypeScript 构建
   - 运行 CLI 功能测试

2. **发布阶段**（仅在有实际代码更改时）
   - 自动判断版本类型
   - 更新 package.json 版本号
   - 更新 CHANGELOG.md
   - 构建项目
   - 创建 Git 标签
   - 发布到 npm
   - 创建 GitHub Release

## 📝 提交信息规范

推荐使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 常用类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例：
```bash
git commit -m "feat: add TypeScript 5.0 support"
git commit -m "fix: resolve generator template issue"
git commit -m "docs: update README with new examples"
git commit -m "feat: add qiankun micro-frontend support

BREAKING CHANGE: qiankun integration requires new configuration"
```

## 🛠 本地测试

在提交前，建议本地运行以下命令：

```bash
# 运行所有测试
npm test

# 构建项目
npm run build

# 测试 CLI 功能
npm run test:cli

# 清理临时文件
npm run clean
```

## 🔍 故障排除

### 1. NPM 发布失败
- 检查 NPM_TOKEN 是否正确设置
- 确认包名是否可用
- 检查 package.json 中的版本号

### 2. GitHub Actions 权限错误
- 确认仓库的 Actions 权限设置
- 检查 GITHUB_TOKEN 权限

### 3. 版本冲突
- 手动处理版本冲突后重新推送
- 检查 git 标签是否冲突

## 📊 监控和维护

### 1. 查看发布状态
- GitHub Actions 页面
- npm 包页面
- GitHub Releases 页面

### 2. 版本历史
- 查看 CHANGELOG.md
- 查看 Git 标签
- 查看 npm 版本历史

## 🚀 手动发布（备用方案）

如果自动发布失败，可以使用手动发布脚本：

```bash
# 发布补丁版本
./scripts/release.sh patch

# 发布次版本
./scripts/release.sh minor

# 发布主版本
./scripts/release.sh major
```

## 📋 检查清单

发布前确认：
- [ ] 所有测试通过
- [ ] 代码已构建成功
- [ ] 版本号符合语义化版本规范
- [ ] CHANGELOG 已更新
- [ ] 文档已更新
- [ ] NPM_TOKEN 已配置
- [ ] GitHub 权限已设置

---

通过以上配置，an-cli 项目已具备完整的 CI/CD 能力，可以实现从代码提交到自动发布的全流程自动化。