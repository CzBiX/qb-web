import debug from 'debug';

const log = debug('app:protocolHandler');

function registerProtocolHandler() {
  if (!('registerProtocolHandler' in navigator)) {
    return;
  }

  const baseUrl = location.origin + location.pathname;

  try {
    navigator.registerProtocolHandler('magnet', baseUrl + '#download=%s', document.title);
  } catch (e) {
    log('Register protocol handler failed.', e);
  }
}

function checkDownloadUrl() {
  if (!location.hash) {
    return null
  }

  const params = new URLSearchParams(location.hash.substring(1));
  const url = params.get('download')
  if (!url) {
    return null;
  }

  params.delete('download');
  location.hash = '#' + params.toString()
  return url
}

export { registerProtocolHandler, checkDownloadUrl };
