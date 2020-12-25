/* eslint-disable @typescript-eslint/camelcase */
import Axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { RssNode, RssRule, SearchPlugin, ApiCategory, SearchTaskResponse, Preferences } from '@/types';

const apiEndpoint = 'api/v2';

class Api {
  private axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: apiEndpoint,
      withCredentials: true,
    });

    this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  private normalizeBaseUrl(baseUrl?: string) {
    if (!baseUrl) {
      return apiEndpoint;
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }

    return baseUrl + apiEndpoint;
  }

  public changeBaseUrl(baseUrl: string) {
    this.axios.defaults.baseURL = this.normalizeBaseUrl(baseUrl);
  }

  public getAppVersion() {
    return this.axios.get('/app/version');
  }

  public getApiVersion() {
    return this.axios.get('/app/webapiVersion');
  }

  public login(params: any, baseUrl?: string) {
    const data = new URLSearchParams(params);
    return this.axios.post('/auth/login', data, {
      validateStatus(status) {
        return status === 200 || status === 403;
      },
      baseURL: this.normalizeBaseUrl(baseUrl),
    }).then(Api.handleResponse);
  }

  public getGlobalTransferInfo() {
    return this.axios.get('/transfer/info');
  }

  public getAppPreferences(): AxiosPromise<Preferences> {
    return this.axios.get('/app/preferences');
  }

  public shutdownApplication() {
    return this.axios.post('/app/shutdown');
  }

  public getMainData(rid?: number) {
    const params = {
      rid,
    };
    return this.axios.get('/sync/maindata', {
      params,
    });
  }

  public addTorrents(params: Record<string, any>, torrents?: any) {
    let data: any;
    if (torrents) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(params)) {
        // eslint-disable-next-line
        formData.append(key, value);
      }

      for (const torrent of torrents) {
        formData.append('torrents', torrent);
      }

      data = formData;
    } else {
      data = new URLSearchParams(params);
    }
    return this.axios.post('/torrents/add', data).then(Api.handleResponse);
  }

  public switchToOldUi() {
    const params = {
      alternative_webui_enabled: false,
    };

    return this.setPreferences(params)
  }

  public setPreferences(params: any) {
    const data = new URLSearchParams({
      json: JSON.stringify(params),
    });

    return this.axios.post('/app/setPreferences', data);
  }

  public setTorrentFilePriority(hash: string, idList: Array<number>, priority: number) {
    const idListStr = idList.join('|');
    const params: any = {
      hash,
      id: idListStr,
      priority,
    }

    const data = new URLSearchParams(params);
    return this.axios.post(`/torrents/filePrio`, data).then(Api.handleResponse);
  }

  public getLogs(lastId?: number) {
    const params = {
      last_known_id: lastId,
    };

    return this.axios.get('/log/main', {
      params,
    }).then(Api.handleResponse);
  }

  public toggleSpeedLimitsMode() {
    return this.axios.post('/transfer/toggleSpeedLimitsMode');
  }

  public deleteTorrents(hashes: string[], deleteFiles: boolean) {
    return this.actionTorrents('delete', hashes, { deleteFiles });
  }

  public pauseTorrents(hashes: string[]) {
    return this.actionTorrents('pause', hashes);
  }

  public resumeTorrents(hashes: string[]) {
    return this.actionTorrents('resume', hashes);
  }

  public setForceStartTorrents(hashes: string[]) {
    return this.actionTorrents('setForceStart', hashes, { value: 'true' });
  }

  public reannounceTorrents(hashes: string[]) {
    return this.actionTorrents('reannounce', hashes);
  }

  public recheckTorrents(hashes: string[]) {
    return this.actionTorrents('recheck', hashes);
  }

  public setTorrentsCategory(hashes: string[], category: string) {
    return this.actionTorrents('setCategory', hashes, { category });
  }

  public getTorrentTracker(hash: string) {
    const params = {
      hash,
    };

    return this.axios.get('/torrents/trackers', {
      params,
    }).then(Api.handleResponse);
  }

  public getTorrentPeers(hash: string, rid?: number) {
    const params = {
      hash,
      rid,
    };

    return this.axios.get('/sync/torrentPeers', {
      params,
    }).then(Api.handleResponse);
  }

  public editTracker(hash: string, origUrl: string, newUrl: string) {
    return this.actionTorrents('editTracker', [hash], { origUrl, newUrl });
  }

  public setTorrentLocation(hashes: string[], location: string) {
    return this.actionTorrents('setLocation', hashes, { location });
  }

  public getTorrentProperties(hash: string) {
    const params = {
      hash,
    };

    return this.axios.get('/torrents/properties', {
      params,
    }).then(Api.handleResponse);
  }

  public getTorrentPieceStates(hash: string) {
    const params = {
      hash,
    };

    return this.axios.get('/torrents/pieceStates', {
      params,
    }).then(Api.handleResponse);
  }

  public getTorrentFiles(hash: string) {
    const params = {
      hash,
    };

    return this.axios.get('/torrents/files', {
      params,
    }).then(Api.handleResponse);
  }

  public getRssItems(): Promise<RssNode> {
    const params = {
      withData: true,
    }

    return this.axios.get('/rss/items', {
      params,
    }).then(Api.handleResponse);
  }

  public addRssFeed(url: string, path = '') {
    const params: any = {
      url,
      path,
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/addFeed', data).then(Api.handleResponse);
  }

  public removeRssFeed(path: string) {
    const params: any = {
      path,
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/removeItem', data).then(Api.handleResponse);
  }

  public refreshRssFeed(path: string) {
    const params: any = {
      itemPath: path,
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/refreshItem', data).then(Api.handleResponse);
  }

  public moveRssFeed(path: string, newPath: string) {
    const params: any = {
      itemPath: path,
      destPath: newPath,
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/moveItem', data).then(Api.handleResponse);
  }

  public getRssRules(): Promise<{ [key: string]: RssRule }> {
    return this.axios.get('/rss/rules').then(Api.handleResponse);
  }

  public setRssRule(name: string, def: any = {}) {
    const params: any = {
      ruleName: name,
      ruleDef: JSON.stringify(def),
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/setRule', data).then(Api.handleResponse);
  }

  public removeRssRule(name: string) {
    const params: any = {
      ruleName: name,
    }

    const data = new URLSearchParams(params)
    return this.axios.post('/rss/removeRule', data).then(Api.handleResponse);
  }

  // Search page

  public updateSearchPlugins(): Promise<SearchPlugin[]> {
    return this.axios.post('/search/updatePlugins').then(Api.handleResponse);
  }

  public getSearchPlugins(): Promise<SearchPlugin[]> {
    return this.axios.get('/search/plugins').then(Api.handleResponse);
  }

  /**
   * @see getSearchCategories
   * When there are no categories available/set
   * @returns a Promise<{}> instead of Promise<[]>.
   */
  public getSearchCategories(): Promise<ApiCategory> {
    return this.axios.get('/torrents/categories').then(Api.handleResponse);
  }

  public startSearch(pattern: string | null, pluginName: string | null, categoryName: string | null): Promise<{ id: number }> {
    const body = new URLSearchParams(
      {
        pattern: pattern || '',
        category: categoryName || 'all',
        plugins: pluginName || 'all',
      });
    return this.axios.post('/search/start', body).then(Api.handleResponse);
  }

  public stopSearch(id: number) {
    const body = new URLSearchParams({ id: id.toString() });
    return this.axios.post('/search/stop', body).then(Api.handleResponse)
  }

  public getSearchResults(id: number): Promise<SearchTaskResponse> {

    return this.axios.get(`/search/results?id=${id}`).then(Api.handleResponse);
  }

  public enablePlugin(plugin: SearchPlugin, enable: boolean) {
    const body = new URLSearchParams({
      names: plugin.name,
      enable: JSON.stringify(enable),
    });

    return this.axios.post('/search/enablePlugin', body).then(Api.handleResponse);
  }

  private actionTorrents(action: string, hashes: string[], extra?: any) {
    const params: any = {
      hashes: hashes.join('|'),
      ...extra,
    };
    const data = new URLSearchParams(params);
    return this.axios.post(`/torrents/${action}`, data).then(Api.handleResponse);
  }

  private static handleResponse(resp: AxiosResponse) {
    return resp.data;
  }
}

const api = new Api();
export default api;
