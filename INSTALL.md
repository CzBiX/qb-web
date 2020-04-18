Download release from: https://github.com/CzBiX/qb-web/releases/latest

Setup:

1. Extrace all files.
2. Open Web UI Options dialog, Set "Files location" of "alternative Web UI" to this folder(without `public` suffix).

RECOVERY:
If something was going wrong, you can append `/api/v2/app/setPreferences?json=%7B%22alternative_webui_enabled%22:false%7D` after URL to disable alternative Web UI.

========

安装说明：

1. 解压所有文件。
2. 打开 Web 用户界面的设置，将 “使用备用 Web UI” 的 “文件路径” 设置为本目录（不包含 `public` 后缀）。

恢复:
如果因为配置错误导致无法访问 Web 界面，可以手动在 URL 地址后面加上 `/api/v2/app/setPreferences?json=%7B%22alternative_webui_enabled%22:false%7D` 来禁用备用 UI 功能。
