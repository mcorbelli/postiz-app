// Augments i18next's own types so every t() call is checked against the
// real keys in en/translation.json at compile time - a typo'd or removed
// key is now a TS error instead of a silent runtime fallback. English is
// the source of truth: other locales are allowed to lag behind (they fall
// back to fallbackLng at runtime) without affecting these types.
//
// strictKeyChecks keeps the key checked even on the `t(key, defaultValue)`
// overload this codebase uses everywhere, so existing calls with an inline
// fallback keep compiling as-is, and new calls no longer need one purely to
// satisfy the type checker.
// https://www.i18next.com/overview/typescript
import type { ParseKeys } from 'i18next';
import en from './locales/en/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    strictKeyChecks: true;
    resources: {
      translation: typeof en;
    };
  }
}

// ParseKeys<> (no type argument) relies on the CustomTypeOptions.defaultNS
// default, which doesn't always resolve cleanly when reused as an object
// property type in another file (as opposed to inline at a call site) -
// spelling out the namespace here once removes the ambiguity everywhere
// this is imported instead of at every dynamic-key call site.
export type TranslationKey = ParseKeys<'translation'>;
