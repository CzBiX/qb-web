Setup:

1. Extrace all files.
2. Open Web UI Options dialog, Set "Files location" of "alternative Web UI" to this folder(without `public` suffix).

========

安装说明：

1. 解压所有文件。
2. 打开 Web 用户界面的设置，将 “使用备用 Web UI” 的 “文件路径” 设置为本目录（没有 `public` 后缀）。

=======

RECOVERY:
If something was going wrong, you can visit `/api/v2/app/setPreferences?json=%7B%22alternative_webui_enabled%22:false%7D` to disable alternative Web UI.