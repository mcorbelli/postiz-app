export const fallbackLng = 'en';
export const languages = [
  fallbackLng,
  'he',
  'ru',
  'zh',
  'fr',
  'es',
  'pt',
  'de',
  'it',
  'ja',
  'ko',
  'ar',
  'tr',
  'vi',
];

// as const: a plain `const defaultNS = 'translation'` widens to `string`
// when read elsewhere, which breaks i18next's typed-namespace inference
// (getFixedT, useTranslation) wherever this constant is passed in as Ns.
export const defaultNS = 'translation' as const;
export const cookieName = 'i18next';
export const headerName = 'x-i18next-current-language';
