// Runs synchronously as the very first thing inside <body>, before any JS
// bundle loads, so the correct theme class is in place before first paint -
// this is the same technique next-themes uses internally, hand-written here
// so we don't need the dependency. It duplicates the resolution logic of
// readPreference()/resolveMode() in mode.component.tsx on purpose (a
// pre-hydration script can't import anything) - keep the two in sync.
const THEME_SCRIPT = `(function () {
  try {
    var cookie = document.cookie;
    function readCookie(name) {
      var match = cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? match[1] : '';
    }

    var preference = readCookie('modePreference');
    if (preference !== 'light' && preference !== 'dark' && preference !== 'system') {
      var legacyMode = readCookie('mode');
      preference = legacyMode === 'light' || legacyMode === 'dark' ? legacyMode : 'system';
    }

    var mode = preference === 'system'
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : preference;

    if (mode !== 'dark' && mode !== 'light') {
      mode = 'dark';
    }

    document.body.classList.add(mode);
    document.documentElement.style.colorScheme = mode;

    // Persist both the resolved concrete mode (so every other cookie-reading
    // consumer is correct on its very first render) and the preference
    // itself (so mode.component.tsx's readPreference() sees an explicit
    // 'system'/'light'/'dark' modePreference cookie directly, instead of
    // mistaking the mode cookie this script just wrote for a pre-existing
    // explicit user choice and permanently locking a 'system' preference
    // into 'light'/'dark').
    var expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    if (readCookie('modePreference') !== preference) {
      document.cookie = 'modePreference=' + preference + '; expires=' + expires + '; path=/';
    }
    if (readCookie('mode') !== mode) {
      document.cookie = 'mode=' + mode + '; expires=' + expires + '; path=/';
    }
  } catch (e) {
    document.body.classList.add('dark');
  }
})();`;

export const ThemeFlashScript = () => (
  <script
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
  />
);
