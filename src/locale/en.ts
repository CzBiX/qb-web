/* eslint-disable @typescript-eslint/camelcase */
export default {
  lang: 'English',
  auto: 'Auto',

  close: 'Close',
  no: 'No',
  yes: 'Yes',
  cancel: 'Cancel',
  ok: 'OK',

  submit: 'Submit',
  edit: 'Edit',
  delete: 'Delete',
  todo: 'To Do',
  resume: 'Resume',
  pause: 'Pause',
  info: 'Info',
  reset: 'Reset',
  login: 'Login',
  search: 'Search',
  refresh: 'Refresh',
  location: 'Location',
  rename: 'Rename',

  reannounce: 'Reannounce',
  recheck: 'Recheck',

  username: 'Username',
  password: 'Password',

  name: 'Name',
  size: 'Size',
  progress: 'progress',
  status: 'Status',
  seeds: 'Seeds',
  peers: 'Peers',
  dl_speed: 'DL Speed',
  up_speed: 'UP Speed',
  eta: 'ETA',
  ratio: 'Ratio',
  added_on: 'Added On',

  settings: 'Settings',
  logs: 'Logs',

  all: 'All',
  category: 'Category |||| Categories',
  uncategorized: 'Uncategorized',
  others: 'Others',
  sites: 'Sites',
  files: 'Files',
  less: 'Less',
  more: 'More',
  feed: 'Feed',
  date: 'Date',

  title: {
    _: 'Title',
    add_torrents: 'Add Torrents',
    delete_torrents: 'Delete Torrents',
    set_category: 'Set Category',
    edit_tracker: 'Edit Tracker',
    set_location: 'Set Location',
  },

  label: {
    switch_to_old_ui: 'Switch to old UI',
    create_subfolder: 'Create subfolder',
    start_torrent: 'Start torrent',
    skip_hash_check: 'Skip hash check',
    in_sequential_order: 'In sequential order',
    first_and_last_pieces_first: 'First and last pieces first',

    also_delete_files: 'Also delete files',

    auto_tmm: 'Auto TMM',

    adding: 'Adding…',
    reloading: 'Reloading…',
    deleting: 'Deleting…',
    moving: 'Moving…',
    moved: 'Moved',
  },

  msg: {
    item_is_required: '%{item} is required',
  },

  dialog: {
    add_torrents: {
      placeholder: 'Upload torrents by drop them here,\nor click attachment button at right to select.',
      hint: 'One link per line',
    },
    delete_torrents: {
      msg: 'Are you sure to delete selected torrents from transfer list?',
      also_delete_same_name_torrents: 'Also delete one same named torrent |||| Also delete %{smart_count} same named torrents',
    },
    set_category: {
      move: 'Are you sure to move selected torrents to category %{category}?',
      reset: 'Are you sure to reset category of selected torrents?',
      also_move_same_name_torrents: 'Also move one same named torrent |||| Also move %{smart_count} same named torrents',
    },
    switch_locale: {
      msg: 'Are you sure to switch language to %{lang}?\nThis action will reload page.',
    },
    rss: {
      add_feed: 'Add Feed',
      feed_url: 'Feed URL',
      auto_refresh: 'Auto Refresh',
      auto_download: 'Auto Download',
      delete_feeds: 'Are you sure to delete selected feeds?',
      date_format: '%{date} (%{duration} ago)',
    },
    rss_rule: {
      add_rule: 'Add Rule',
      new_rule_name: 'The name of the new rule',
      delete_rule: 'Are you sure to delete selected rule?',
      title: 'RSS Downloader',
      rule_settings: 'Rule Settings',

      use_regex: 'Use Regex',
      must_contain: 'Must Contain',
      must_not_contain: 'Must Not Contain',
      episode_filter: 'Episode Filter',
      smart_episode: 'Use Smart Episode Filter',
      assign_category: 'Assign Category',

      apply_to_feeds: 'Apply Rule to Feeds',
    },
  },

  state: {
    _: 'State',

    downloading: 'Downloading',
    seeding: 'Seeding',
    completed: 'Completed',
    resumed: 'Resumed',
    paused: 'Paused',
    active: 'Active',
    inactive: 'Inactive',
    errored: 'Errored',
  }
}