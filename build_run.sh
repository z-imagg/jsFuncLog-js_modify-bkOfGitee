#!/bin/bash

#[描述] ts_nodejs项目 编译、运行 脚本

#'-e': 任一语句异常将导致此脚本终止; '-u': 使用未声明变量将导致异常;  
set -e -u  

PrjDir=/app2/js_modify/

[[ ! -d $PrjDir/.node_env_v22.1.0 ]] && bash /app/bash-simplify/nodejs_script/new_PrjNodejsEnv_by_nodeenv.sh $PrjDir 22.1.0

source PrjNodeJsEnvActivate.sh #激活项目nodejs环境
pnpm install #安装nodejs项目依赖
pnpm install -g tsc #全局安装tsc

pnpm install typescript
npx tsc #编译

#   对 WebCola/**.ts文件开头 插入 import语句
node build/main/insert_import.js  
#   对 WebCola/**.ts 匿名函数开头 插入 函数进入语句文本
node build/main/NoNameFunc_Insert_funcEnterStmt.js  

# F=/app2/js_func_log/build/cjs/_func_log.cjs.js
# F=/app2/js_func_log/build/esm/_func_log.esm.js
# F=/app2/js_func_log/build/iife/_func_log.iife.js
F=/app2/js_func_log/build/umd/_func_log.umd.js
cp -v $F /app2/WebCola/WebCola/src/