#!/bin/bash

# 手动发布脚本
# 用法: ./scripts/release.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 开始发布流程..."

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 工作目录不干净，请先提交所有更改"
  exit 1
fi

# 运行测试
echo "🧪 运行测试..."
npm test

# 构建项目
echo "🔨 构建项目..."
npm run build

# 更新版本
echo "📦 更新版本 ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
echo "新版本: v$NEW_VERSION"

# 提交更改
echo "📝 提交更改..."
git add package.json package-lock.json lib/
git commit -m "chore: release v$NEW_VERSION"

# 创建标签
echo "🏷️  创建标签..."
git tag "v$NEW_VERSION"

# 推送到远程
echo "⬆️  推送到远程..."
git push origin main
git push origin "v$NEW_VERSION"

# 发布到 npm
echo "📦 发布到 npm..."
npm publish

echo "🎉 发布完成！版本: v$NEW_VERSION"