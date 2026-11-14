import type { Translations } from './types'

export const hiModelMenu: Translations['shell']['modelMenu'] = {
  pickDeferred: (model: string) => `${model} अगले संदेश से लागू होगा`,
  search: "मॉडल खोजें",
  noModels: "कोई मॉडल नहीं मिला",
  editModels: "मॉडल संपादित करें…",
  followDefault: "सेटिंग्स का डिफ़ॉल्ट उपयोग करें",
  refreshModels: "मॉडल रीफ़्रेश करें",
  favorites: "पसंदीदा",
  addFavorite: "पसंदीदा में जोड़ें",
  removeFavorite: "पसंदीदा से हटाएँ",
  favoriteShortcut: "⇧ क्लिक",
  fast: "तेज़",
  free: "मुफ़्त",
  cacheRead: "कैश पठन",
  priceTitle: (input: string, output: string, cache: string) =>
    `इनपुट ${input}/Mtok · आउटपुट ${output}/Mtok` + (cache ? ` · कैश पठन ${cache}/Mtok` : ''),
  localSetup: {
    title: "स्थानीय चलाएँ · मुफ़्त, निजी",
    text: (model: string, size: string) => `${model} इस मशीन में समाता है · ${size} डाउनलोड`,
    action: "सेटअप करें"
  },
  limited: "सीमित",
  limitedUntil: (time: string) => `${time} तक सीमित`,
  limitedTip: (provider: string, time: null | string) =>
    time
      ? `${provider} की उपयोग सीमा पूरी हुई। ${time} पर रीसेट होगी; उसके बाद के लिए अभी भी मॉडल चुन सकते हैं।`
      : `${provider} की उपयोग सीमा पूरी हुई। रीसेट के बाद के लिए अभी भी मॉडल चुन सकते हैं।`,
  modelResets: (time: string) => `${time} पर रीसेट`,
  modelLimitedTip: (time: string) =>
    `इस मॉडल की अपनी सीमा पूरी हुई; ${time} पर रीसेट होगी। बाकी मॉडल काम करते हैं।`,
  usageLeft: (percent: number, time: null | string) =>
    time ? `${percent}% बाकी · ${time} पर रीसेट` : `${percent}% बाकी`,
  poolAccounts: (count: number) => `${count} ${count === 1 ? 'खाता' : 'खाते'}`,
  poolLimited: (limited: number, total: number) => `${limited}/${total} खाते सीमित`,
  poolAccount: (number: number) => `खाता ${number}`,
  poolUnknown: "उपयोग उपलब्ध नहीं",
  poolUnavailable: "फिर साइन इन करें",
  usageTip: (provider: string) => `${provider} की उपयोग सीमा करीब है।`,
  usageWindow: (label: string, percent: number, time: null | string) =>
    time ? `${label}: ${percent}% बाकी, ${time} पर रीसेट` : `${label}: ${percent}% बाकी`
}
