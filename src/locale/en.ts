export default {
  lang: 'English',

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

  title: {
    add_torrents: 'Add Torrents',
    delete_torrents: 'Delete Torrents',
    set_category: 'Set category',
    edit_tracker: 'Edit tracker',
  },

  label: {
    switch_to_old_ui: 'Switch to old UI',
    create_subfolder: 'Create subfolder',
    start_torrent: 'Start torrent',
    skip_hash_check: 'Skip hash check',
    in_sequential_order: 'In sequential order',
    first_and_last_pieces_first: 'First and last pieces first',

    also_delete_files: 'Also delete files',
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
    }
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