/* eslint-disable @typescript-eslint/camelcase */
export default {
  lang: '中文',
  auto: '自动',

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
  force_start: '强制继续',
  info: '信息',
  reset: '重置',
  login: '登录',
  search: '搜索',
  refresh: '刷新',
  location: '位置',
  rename: '重命名',

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
  feed: '订阅',
  date: '日期',

  title: {
    _: '标题',
    add_torrents: '添加种子',
    delete_torrents: '删除种子',
    set_category: '设置分类',
    edit_tracker: '编辑 Tracker',
    set_location: '修改文件位置',
  },

  label: {
    switch_to_old_ui: '切换到原版 UI',
    create_subfolder: '创建子文件夹',
    start_torrent: '开始种子',
    skip_hash_check: '跳过哈希校验',
    in_sequential_order: '按顺序下载',
    first_and_last_pieces_first: '先下载首尾文件块',

    also_delete_files: '同时删除文件',

    auto_tmm: '自动种子管理',

    adding: '添加…',
    reloading: '刷新中…',
    deleting: '删除中…',
    moving: '移动中…',
    moved: '已移动',
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
      msg: '确定要删除选中的种子吗？',
      also_delete_same_name_torrents: '同时删除 %{smart_count} 个同名的种子',
    },
    set_category: {
      move: '确定要移动选中的种子到分类 %{category} 吗？',
      reset: '确定重置选中的种子的分类吗？',
      also_move_same_name_torrents: '同时移动 %{smart_count} 个同名的种子',
    },
    switch_locale: {
      msg: '确定要切换语言为 %{lang} 吗？\n这将会刷新页面。',
    },
    rss: {
      add_feed: '添加订阅',
      feed_url: '订阅 URL',
      auto_refresh: '自动刷新',
      auto_download: '自动下载',
      delete_feeds: '确定要删除选中的订阅吗？',
      date_format: '%{date}（%{duration} 之前）',
    },
    rss_rule: {
      add_rule: '添加规则',
      new_rule_name: '新规则的名称',
      delete_rule: '确定要删除选中的规则吗？',
      title: 'RSS 自动下载',
      rule_settings: '规则设置',

      use_regex: '使用正则',
      must_contain: '必须包含',
      must_not_contain: '必须排除',
      episode_filter: '剧集过滤',
      smart_episode: '使用智能剧集过滤',
      assign_category: '分配分类',

      apply_to_feeds: '应用到订阅',
    },
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
