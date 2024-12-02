#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 修改为你的 GitHub 用户名和仓库名
git push -f git@github.com:luchangpeng1/canting.git main:gh-pages

cd - 