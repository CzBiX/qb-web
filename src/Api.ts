/* eslint-disable @typescript-eslint/camelcase */
import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RssNode, RssRule } from '@/types';

class Api {
  private axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: '/api/v2',
    });

    this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  public getAppVersion() {
    return this.axios.get('/app/version');
  }

  public getApiVersion() {
    return this.axios.get('/app/webapiVersion');
  }

  public login(params: any) {
    const data = new URLSearchParams(params);
    return this.axios.post('/auth/login', data, {
      validateStatus(status) {
        return status === 200 || status === 403;
      },
    }).then(Api.handleResponse);
  }

  public getGlobalTransferInfo() {
    return this.axios.get('/transfer/info');
  }

  public getAppPreferences() {
    return this.axios.get('/app/preferences');
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
    const params = {
      hash,
      origUrl,
      newUrl,
    };

    return this.axios.get('/torrents/editTracker', {
      params,
    }).then(Api.handleResponse);
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

  public getRssRules(): Promise<{[key: string]: RssRule}> {
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

export default new Api();
