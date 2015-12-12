import electron from 'electron';
import debug from 'debug';

(function() {
  const NOTIF_COUNT_REGEX = /\((\d)\)/;

  const log = debug('whatsie:app');
  const ipcr = electron.ipcRenderer;

  // Set the user agent and then load the app
  const webView = document.getElementById('webView');
  webView.setAttribute('useragent', navigator.userAgent);
  webView.setAttribute('src', 'https://web.whatsapp.com/');

  // Listen for title changes to update the badge
  webView.addEventListener('page-title-updated', function(event) {
    const matches = NOTIF_COUNT_REGEX.exec(webView.getTitle());
    const parsed = parseInt(matches && matches[1], 10);
    const count = isNaN(parsed) || !parsed ? null : '' + parsed;
    log('sending notif-count', count);
    ipcr.send('notif-count', count);
  });
})();
