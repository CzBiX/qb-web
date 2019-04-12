import 'axios';
import Axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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
    }).then(this.handleResponse);
  }

  public getGlobalTransferInfo() {
    return this.axios.get('/transfer/info');
  }

  public getAppPreferences() {
    return this.axios.get('/app/preferences');
  }

  public getMainData(rid?: number) {
    return this.axios.get('/sync/maindata', {
      params: {
        rid,
      },
    });
  }

  public addTorrents(params: any) {
    const data = new URLSearchParams(params);
    return this.axios.post('/torrents/add', data);
  }

  public switchToOldUi() {
    const params = {
      alternative_webui_enabled: false,
    };

    const data = new URLSearchParams({
      json: JSON.stringify(params),
    });

    return this.axios.post('/app/setPreferences', data);
  }

  private handleResponse(resp: AxiosResponse) {
    return resp.data;
  }
}

export const api = new Api();
