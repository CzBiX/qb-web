import debug from 'debug';

const log = debug('app:protocolHandler');

function registerProtocolHandler() {
  if (!('registerProtocolHandler' in navigator)) {
    return;
  }

  try {
    navigator.registerProtocolHandler('magnet', location.origin + '#url=%s', document.title);
  } catch (e) {
    log('Register protocol handler failed.', e);
  }
}

function checkDownloadUrl() {
  if (!location.hash) {
    return null
  }

  const params = new URLSearchParams(location.hash.substring(1));
  const url = params.get('url')
  if (!url) {
    return null;
  }

  params.delete('url');
  location.hash = '#' + params.toString()
  return url
}

export { registerProtocolHandler, checkDownloadUrl };