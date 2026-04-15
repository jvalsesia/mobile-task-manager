import ptBR from './locales/pt-BR';
import enUS from './locales/en-US';

export const locales = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

let currentLocale = 'pt-BR'; // default dynamically set to pt-BR per user request

export const setLocale = (locale) => {
  if (locales[locale]) {
    currentLocale = locale;
  }
};

export const getCurrentLocale = () => currentLocale;

export const t = (key, params = {}) => {
  const dictionary = locales[currentLocale] || locales['pt-BR'];
  const keys = key.split('.');
  let value = dictionary;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = key; // fallback to raw string key
      break;
    }
  }

  if (typeof value === 'string') {
    let formatted = value;
    for (const [pKey, pVal] of Object.entries(params)) {
      formatted = formatted.replace(new RegExp(`{${pKey}}`, 'g'), pVal);
    }
    return formatted;
  }
  
  return key;
};
