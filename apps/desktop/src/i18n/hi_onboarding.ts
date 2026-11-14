import type { Translations } from './types'

export const hiOnboarding: Translations['onboarding'] = {
  headerTitle: "आइए {app_name} का सेटअप करें",
  headerDesc: "चैट शुरू करने के लिए मॉडल प्रदाता जोड़ें। अधिकांश विकल्प एक क्लिक में तैयार होते हैं।",
  preparingInstall: "{app_name} इंस्टॉल पूरा कर रहा है। पहली बार सामान्यतः एक मिनट से कम लगता है।",
  starting: "{app_name} शुरू हो रहा है…",
  setupSlowTitle: "सेटअप सामान्य से अधिक समय ले रहा है।",
  setupSlowBody: "{app_name} पृष्ठभूमि में अभी शुरू हो रहा है।",
  continueWithoutSetup: "सेटअप के बिना जारी रखें",
  lookingUpProviders: "प्रदाता खोजे जा रहे हैं...",
  collapse: "समेटें",
  otherProviders: "अन्य प्रदाता",
  haveApiKey: "मेरे पास API कुंजी है",
  chooseLater: "प्रदाता बाद में चुनूँगा",
  recommended: "अनुशंसित",
  connected: "जुड़ा हुआ",
  featuredPitch: "एक सदस्यता, 300+ अत्याधुनिक मॉडल — {app_name} चलाने का अनुशंसित तरीका",
  fireworksPitch: "सीधा मॉडल API — Fireworks पर होस्ट किए अत्याधुनिक मॉडल",
  localModelsTitle: "स्थानीय मॉडल चलाएँ",
  localModelsPitch: "खाता आवश्यक नहीं — मॉडल डाउनलोड करके इसी मशीन पर चलाएँ",
  openRouterPitch: "एक कुंजी, सैकड़ों मॉडल — अच्छा डिफ़ॉल्ट",
  apiKeyOptions: {
    fireworks: {
      short: "सीधा मॉडल API",
      description: "Fireworks AI पर होस्ट किए मॉडल की सीधी पहुँच।"
    },
    openrouter: {
      short: "एक कुंजी, कई मॉडल",
      description: "एक कुंजी से सैकड़ों मॉडल उपलब्ध कराता है। नए इंस्टॉल के लिए अच्छा डिफ़ॉल्ट।"
    },
    openai: { short: "GPT-श्रेणी के मॉडल", description: "OpenAI मॉडल की सीधी पहुँच।" },
    gemini: { short: "Gemini मॉडल", description: "Google Gemini मॉडल की सीधी पहुँच।" },
    xai: { short: "Grok मॉडल", description: "xAI Grok मॉडल की सीधी पहुँच।" },
    local: {
      short: "स्वयं होस्ट किया",
      description: "{app_name} को स्थानीय या स्वयं होस्ट किए OpenAI-संगत एंडपॉइंट (vLLM, llama.cpp, Ollama आदि) से जोड़ें।"
    }
  },
  backToSignIn: "साइन-इन पर वापस",
  getKey: "कुंजी प्राप्त करें",
  replaceCurrent: "वर्तमान मान बदलें",
  pasteApiKey: "API कुंजी पेस्ट करें",
  localApiKeyPlaceholder: "API कुंजी (वैकल्पिक — केवल एंडपॉइंट को ज़रूरत होने पर)",
  localModelNamePlaceholder: "मॉडल का नाम (जैसे command-a-plus-05-2026)",
  couldNotSave: "क्रेडेंशियल सहेजा नहीं जा सका।",
  connecting: "जुड़ रहा है",
  update: "अपडेट करें",
  flowSubtitles: {
    pkce: "साइन-इन के लिए ब्राउज़र खोलता है, फिर यहाँ जारी रहता है",
    device_code: "ब्राउज़र में सत्यापन पृष्ठ खोलता है — {app_name} अपने आप जुड़ता है",
    external: "टर्मिनल में एक बार साइन इन करें, फिर चैट पर लौटें"
  },
  startingSignIn: provider => `${provider} के लिए साइन-इन शुरू हो रहा है...`,
  verifyingCode: provider => `${provider} से कोड सत्यापित हो रहा है...`,
  connectedProvider: provider => `${provider} जुड़ा`,
  connectedPicking: provider => `${provider} जुड़ा। डिफ़ॉल्ट मॉडल चुना जा रहा है...`,
  signInFailed: "साइन-इन विफल। फिर कोशिश करें।",
  signInExpired:
    "पूरा होने से पहले साइन-इन पृष्ठ की समय सीमा समाप्त हुई। फिर कोशिश करके कुछ मिनट में ब्राउज़र का चरण पूरा करें या API कुंजी उपयोग करें।",
  signInDidNotFinish: provider =>
    `${provider} से साइन-इन पूरा नहीं हुआ। इंटरनेट कनेक्शन जाँचकर फिर कोशिश करें या दूसरा प्रदाता चुनें।`,
  tryAgain: "फिर कोशिश करें",
  useApiKeyInstead: "API कुंजी उपयोग करें",
  errorDetails: "विवरण",
  pickDifferentProvider: "दूसरा प्रदाता चुनें",
  signInWith: provider => `${provider} से साइन इन करें`,
  openedBrowser: provider => `हमने ब्राउज़र में ${provider} खोला है।`,
  authorizeThere: "वहाँ {app_name} को अधिकृत करें।",
  copyAuthCode: "प्राधिकरण कोड कॉपी करके नीचे पेस्ट करें।",
  pasteAuthCode: "प्राधिकरण कोड पेस्ट करें",
  reopenAuthPage: "प्राधिकरण पृष्ठ फिर खोलें",
  waitingAuthorize: "आपकी अनुमति की प्रतीक्षा है...",
  externalPending: provider =>
    `${provider} अपने CLI से साइन इन करता है। यह कमांड टर्मिनल में चलाएँ, फिर लौटकर "मैंने साइन इन कर लिया" चुनें:`,
  signedIn: "मैंने साइन इन कर लिया",
  deviceCodeOpened: provider => `हमने ब्राउज़र में ${provider} खोला है। वहाँ यह कोड दर्ज करें:`,
  reopenVerification: "सत्यापन पृष्ठ फिर खोलें",
  copy: "कॉपी करें",
  defaultModel: "डिफ़ॉल्ट मॉडल",
  freeTier: "मुफ़्त स्तर",
  pro: "प्रो",
  free: "मुफ़्त",
  price: (input, output) => `${input} इनपुट / ${output} आउटपुट प्रति Mtok`,
  change: "बदलें",
  startChatting: "शुरू करें",
  docs: provider => `${provider} के दस्तावेज़`
}
