import './i18next.types';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, languages, defaultNS, cookieName } from './i18n.config';
const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: any, namespace: any) => {
      return import(`./locales/${language}/${namespace}.json`);
    })
  )
  .init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined,
    fallbackNS: defaultNS,
    defaultNS,
    // supportedLngs only lists base codes ('it', not 'it-IT'). Without this,
    // i18next's own language-matching accepts the first EXACT match across
    // every detected candidate before ever reducing a regional code to its
    // base - and navigator.languages commonly reports a bare 'en' fallback
    // alongside e.g. 'it-IT', so 'en' won the exact-match race every time
    // regardless of what the detector found. This makes it match 'it-IT'
    // against 'it' immediately instead.
    nonExplicitSupportedLngs: true,
    // 'header' was never a real detector (i18next-browser-languagedetector
    // only knows cookie/querystring/hash/localStorage/sessionStorage/
    // navigator/htmlTag/path/subdomain), so without an explicit language
    // cookie this silently fell straight through to fallbackLng and never
    // looked at the browser's own language. navigator reads it, and caches
    // the result back into the same cookie the server reads (cookieName),
    // so a fresh visitor's detected language survives into SSR too.
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: cookieName,
      caches: ['cookie'],
    },
    preload: runsOnServerSide ? languages : [],
  });

export default i18next;
