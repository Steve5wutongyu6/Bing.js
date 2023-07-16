#!/bin/bash

# 脚本名称
SCRIPT_NAME="bing.js"

# 脚本下载地址
SCRIPT_URL="https://raw.githubusercontent.com/Steve5wutongyu6/DailyWallpaper/main/bing.js"

# 青龙面板路径
QL_PATH="/ql/scripts"

# 安装脚本命令
INSTALL_COMMAND="ql script update $SCRIPT_NAME $SCRIPT_URL"


# 执行安装脚本命令
$INSTALL_COMMAND

# 设置脚本的定时任务为每天凌晨3点（以北京时间为基准）
echo "0 3 * * * node $QL_PATH/$SCRIPT_NAME >> $QL_PATH/$SCRIPT_NAME.log 2>&1" > $QL_PATH/task_before_dawn.cron

echo "脚本安装完成！"
