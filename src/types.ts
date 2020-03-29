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
  key: string
  name: string
  savePath?: string
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
    server_state: ServerState;
    torrents: Record<string, BaseTorrent>;
}

export interface RssTorrent {
  category?: string
  comment?: string
  date?: string
  description?: string
  id: string
  link: string
  title: string
  torrentURL: string
}

export interface RssItem {
  articles: RssTorrent[]
  hasError: boolean
  isLoading: boolean
  lastBuildDate: string
  title: string
  uid: string
  url: string
}

export interface RssNode {
  [key: string]: RssNode | RssItem
}

export interface RssRule {
  enabled: boolean,
  mustContain: string,
  mustNotContain: string,
  useRegex: boolean,
  episodeFilter: string,
  smartFilter: boolean,
  previouslyMatchedEpisodes: string[],
  affectedFeeds: string[],
  ignoreDays: number,
  lastMatch: string,
  addPaused: boolean,
  assignedCategory: string,
  savepath: string,
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