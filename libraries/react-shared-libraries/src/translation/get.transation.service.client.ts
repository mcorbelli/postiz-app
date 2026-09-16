'use client';

import i18next from './i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseTranslationOptions } from 'react-i18next/index';
import { FlatNamespace } from 'i18next';

export function useT(ns?: FlatNamespace, options?: UseTranslationOptions<any>) {
  const { t } = useTranslation(ns, options);
  return t;
}

export function useTranslationSettings() {
  const [savedI18next, setSavedI18next] = useState(i18next);

  return savedI18next;
}
