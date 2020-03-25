export default {
  lang: '中文',

  close: '关闭',
  no: '否',
  yes: '是',
  cancel: '取消',
  ok: '确定',

  submit: '提交',
  edit: '编辑',
  delete: '删除',
  todo: '待办',
  resume: '恢复',
  pause: '暂停',
  info: '信息',
  reset: '重置',
  login: '登录',

  reannounce: '重新通告',
  recheck: '重新检查',

  username: '用户名',
  password: '密码',

  name: '名称',
  size: '大小',
  progress: '进度',
  status: '状态',
  seeds: '做种',
  peers: '用户',
  dl_speed: '下载速度',
  up_speed: '上传速度',
  eta: '剩余时间',
  ratio: '比率',
  added_on: '添加时间',

  settings: '设置',
  logs: '日志',

  all: '全部',
  category: '分类',
  uncategorized: '未分类',
  others: '其他',
  sites: '站点',
  files: '文件',
  less: '更少',
  more: '更多',

  title: {
    add_torrents: '添加种子',
    delete_torrents: '删除种子',
    set_category: '设置分类',
    edit_tracker: '编辑 Tracker',
  },

  label: {
    switch_to_old_ui: '切换到原版 UI',
    create_subfolder: '创建子文件夹',
    start_torrent: '开始种子',
    skip_hash_check: '跳过哈希校验',
    in_sequential_order: '按顺序下载',
    first_and_last_pieces_first: '先下载首尾文件块',

    also_delete_files: '同时删除文件',
  },

  msg: {
    'item_is_required': '%{item}不能为空',
  },

  dialog: {
    add_torrents: {
      placeholder: '将种子拖到这里上传，\n或者点击右边的附件图标来选择。',
      hint: '每行一个链接',
    },
    delete_torrents: {
      msg: '你确定要删除选中的种子吗？',
      also_delete_same_name_torrents: '同时删除 %{smart_count} 个同名的种子',
    },
    set_category: {
      move: '你确定要移动选中的种子到分类 %{category} 吗？',
      reset: '你确定重置选中的种子的分类吗？',
      also_move_same_name_torrents: '同时移动 %{smart_count} 个同名的种子',
    }
  },

  state: {
    _: '状态',

    downloading: '下载',
    seeding: '做种',
    completed: '完成',
    resumed: '恢复',
    paused: '暂停',
    active: '活动',
    inactive: '空闲',
    errored: '错误',
  }
}