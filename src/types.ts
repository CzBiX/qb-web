/* eslint-disable camelcase */
export interface BaseTorrent {
  added_on: number;
  amount_left: number;
  auto_tmm: boolean;
  availability: number;
  category: string;
  completed: number;
  completion_on: number;
  dl_limit: number;
  dlspeed: number;
  downloaded: number;
  downloaded_session: number;
  eta: number;
  f_l_piece_prio: boolean;
  force_start: boolean;
  last_activity: number;
  magnet_uri: string;
  max_ratio: number;
  max_seeding_time: number;
  name: string;
  num_complete: number;
  num_incomplete: number;
  num_leechs: number;
  num_seeds: number;
  priority: number;
  progress: number;
  ratio: number;
  ratio_limit: number;
  save_path: string;
  seeding_time_limit: number;
  seen_complete: number;
  seq_dl: boolean;
  size: number;
  state: string;
  super_seeding: boolean;
  tags: string;
  time_active: number;
  total_size: number;
  tracker: string;
  up_limit: number;
  uploaded: number;
  uploaded_session: number;
  upspeed: number;
}

export interface Torrent extends BaseTorrent {
  hash: string;
}

export interface Category {
  key: string;
  name: string;
  savePath?: string;
}

export interface ApiCategory {
  [key: string]: {
    name: string;
    savePath?: string;
  };
}

export interface SimpleCategory {
  name: string | null;
  savePath?: string;
}

export interface Tag {
  key: string;
  name: string;
}

export interface ServerState {
  alltime_dl: number;
  alltime_ul: number;
  average_time_queue: number;
  connection_status: string;
  dht_nodes: number;
  dl_info_data: number;
  dl_info_speed: number;
  dl_rate_limit: number;
  free_space_on_disk: number;
  global_ratio: string;
  queued_io_jobs: number;
  queueing: boolean;
  read_cache_hits: string;
  read_cache_overload: string;
  refresh_interval: number;
  total_buffers_size: number;
  total_peer_connections: number;
  total_queued_size: number;
  total_wasted_session: number;
  up_info_data: number;
  up_info_speed: number;
  up_rate_limit: number;
  use_alt_speed_limits: boolean;
  write_cache_overload: string;
}

export interface MainData {
  categories: Record<string, Category>;
  tags: [string];
  server_state: ServerState;
  torrents: Record<string, BaseTorrent>;
}

export interface RssTorrent {
  category?: string;
  comment?: string;
  date?: string;
  description?: string;
  id: string;
  link: string;
  title: string;
  torrentURL: string;
}

export interface RssItem {
  articles: RssTorrent[];
  hasError: boolean;
  isLoading: boolean;
  lastBuildDate: string;
  title: string;
  uid: string;
  url: string;
}

export interface RssNode {
  [key: string]: RssNode | RssItem;
}

export interface RssRule {
  enabled: boolean;
  mustContain: string;
  mustNotContain: string;
  useRegex: boolean;
  episodeFilter: string;
  smartFilter: boolean;
  previouslyMatchedEpisodes: string[];
  affectedFeeds: string[];
  createSubfolder: boolean | null;
  ignoreDays: number;
  lastMatch: string;
  addPaused: boolean | null;
  assignedCategory: string;
  savepath: string;
}

export interface TorrentProperties {
  addition_date: number;
  comment: string;
  completion_date: number;
  created_by: string;
  creation_date: number;
  dl_limit: number;
  dl_speed: number;
  dl_speed_avg: number;
  eta: number;
  last_seen: number;
  nb_connections: number;
  nb_connections_limit: number;
  peers: number;
  peers_total: number;
  piece_size: number;
  pieces_have: number;
  pieces_num: number;
  reannounce: number;
  save_path: string;
  seeding_time: number;
  seeds: number;
  seeds_total: number;
  share_ratio: number;
  time_elapsed: number;
  total_downloaded: number;
  total_downloaded_session: number;
  total_size: number;
  total_uploaded: number;
  total_uploaded_session: number;
  total_wasted: number;
  up_limit: number;
  up_speed: number;
  up_speed_avg: number;
}

export interface Preferences {
  add_trackers: string;
  add_trackers_enabled: boolean;
  alt_dl_limit: number;
  alt_up_limit: number;
  alternative_webui_enabled: boolean;
  alternative_webui_path: string;
  anonymous_mode: boolean;
  auto_delete_mode: number;
  auto_tmm_enabled: boolean;
  autorun_enabled: boolean;
  autorun_program: string;
  banned_IPs: string;
  bittorrent_protocol: number;
  bypass_auth_subnet_whitelist: string;
  bypass_auth_subnet_whitelist_enabled: boolean;
  bypass_local_auth: boolean;
  category_changed_tmm_enabled: boolean;
  create_subfolder_enabled: boolean;
  dht: boolean;
  dl_limit: number;
  dont_count_slow_torrents: boolean;
  dyndns_domain: string;
  dyndns_enabled: boolean;
  dyndns_password: string;
  dyndns_service: number;
  dyndns_username: string;
  encryption: number;
  export_dir: string;
  export_dir_fin: string;
  force_proxy: boolean;
  incomplete_files_ext: boolean;
  ip_filter_enabled: boolean;
  ip_filter_path: string;
  ip_filter_trackers: boolean;
  limit_lan_peers: boolean;
  limit_tcp_overhead: boolean;
  limit_utp_rate: boolean;
  listen_port: number;
  locale: string;
  lsd: boolean;
  mail_notification_auth_enabled: boolean;
  mail_notification_email: string;
  mail_notification_enabled: boolean;
  mail_notification_password: string;
  mail_notification_sender: string;
  mail_notification_smtp: string;
  mail_notification_ssl_enabled: boolean;
  mail_notification_username: string;
  max_active_downloads: number;
  max_active_torrents: number;
  max_active_uploads: number;
  max_connec: number;
  max_connec_per_torrent: number;
  max_ratio: number;
  max_ratio_act: number;
  max_ratio_enabled: boolean;
  max_seeding_time: number;
  max_seeding_time_enabled: boolean;
  max_uploads: number;
  max_uploads_per_torrent: number;
  pex: boolean;
  preallocate_all: boolean;
  proxy_auth_enabled: boolean;
  proxy_ip: string;
  proxy_password: string;
  proxy_peer_connections: boolean;
  proxy_port: number;
  proxy_torrents_only: boolean;
  proxy_type: number;
  proxy_username: string;
  queueing_enabled: boolean;
  random_port: boolean;
  rss_auto_downloading_enabled: boolean;
  rss_max_articles_per_feed: number;
  rss_processing_enabled: boolean;
  rss_refresh_interval: number;
  save_path: string;
  save_path_changed_tmm_enabled: boolean;
  scan_dirs: { [key: string]: string | number };
  schedule_from_hour: number;
  schedule_from_min: number;
  schedule_to_hour: number;
  schedule_to_min: number;
  scheduler_days: number;
  scheduler_enabled: boolean;
  slow_torrent_dl_rate_threshold: number;
  slow_torrent_inactive_timer: number;
  slow_torrent_ul_rate_threshold: number;
  ssl_cert: string;
  ssl_key: string;
  start_paused_enabled: boolean;
  temp_path: string;
  temp_path_enabled: boolean;
  torrent_changed_tmm_enabled: boolean;
  up_limit: number;
  upnp: boolean;
  use_https: boolean;
  web_ui_address: string;
  web_ui_clickjacking_protection_enabled: boolean;
  web_ui_csrf_protection_enabled: boolean;
  web_ui_domain_list: string;
  web_ui_host_header_validation_enabled: boolean;
  web_ui_password: string;
  web_ui_port: number;
  web_ui_upnp: boolean;
  web_ui_username: string;
  web_ui_max_auth_fail_count: number;
  web_ui_ban_duration: number;
  web_ui_session_timeout: number;
}

export interface SearchPlugin {
  enabled: boolean;
  fullName: string;
  name: string;
  supportedCategories: string[];
  url: string;
  version: string;
}

export interface SearchTaskTorrent {
  descrLink: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  nbLeechers: number;
  nbSeeders: number;
  siteUrl: string;
}

export interface SearchTaskResponse {
  results: SearchTaskTorrent[];
  status: 'Running' | 'Stopped';
  total: number;
}
