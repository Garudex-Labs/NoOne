import { applyDocumentLocale, LOCALE_ENDONYMS } from "@noone/shared/i18n";
import { $appName, withAppIdentity } from "@noone/shared/application-identity";
import { useMemo, useSyncExternalStore } from "react";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Locale, Translations } from "./types";
import { en } from "./en";
import { zh } from "./zh";
import { hi } from "./hi";
import { ja } from "./ja";
import { de } from "./de";
import { es } from "./es";
import { fr } from "./fr";
import { ko } from "./ko";
import { ar } from "./ar";

const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  zh,
  ja,
  hi,
  de,
  es,
  fr,
  ko,
  ar,
};

const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS) as Locale[];

// Display metadata for the language picker — endonyms from @noone/shared so the
// desktop and web pickers can never disagree on a language's native name.
export const LOCALE_META: Record<Locale, { name: string }> = Object.fromEntries(
  SUPPORTED_LOCALES.map((id) => [id, { name: LOCALE_ENDONYMS[id] }]),
) as Record<Locale, { name: string }>;

const STORAGE_KEY = "hermes-locale";

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    // SSR or privacy mode
  }
  return "en";
}

interface I18nContextValue {
  appName: string;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  appName: $appName.get(),
  locale: "en",
  setLocale: () => {},
  t: en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const appName = useSyncExternalStore($appName.listen, $appName.get, $appName.get);
  const translations = useMemo(() => withAppIdentity(TRANSLATIONS[locale], appName), [locale, appName]);
  useEffect(() => { document.title = `${appName} - Dashboard`; }, [appName]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const value: I18nContextValue = {
    appName,
    locale,
    setLocale,
    t: translations,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
