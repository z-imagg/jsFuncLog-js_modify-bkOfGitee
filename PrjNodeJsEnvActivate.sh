#!/bin/bash

_PATH_init="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export PNPM_HOME="/app2/js_modify//.pnpm_home"
export PATH=/app2/js_modify//.node_env_v22.1.0/bin:$PNPM_HOME:$_PATH_init
export NODEJS_ORG_MIRROR=https://registry.npmmirror.com/-/binary/node
#export NVM_NODEJS_ORG_MIRROR=https://registry.npmmirror.com/-/binary/node
