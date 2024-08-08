#!/bin/bash

#[描述] ts_nodejs项目 编译、运行 脚本

PrjDir=/app2/js_modify/

[[ ! -d $PrjDir/.node_env_v22.1.0 ]] && bash /app/bash-simplify/nodejs_script/new_PrjNodejsEnv_by_nodeenv.sh $PrjDir 22.1.0

source PrjNodeJsEnvActivate.sh #激活项目nodejs环境
pnpm install #安装nodejs项目依赖
pnpm install -g tsc #全局安装tsc

pnpm install typescript
npx tsc #编译

node build/main/insert_import.js #运行
# node build/main/index.js #运行