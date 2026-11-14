import type { Translations } from './types'

type ThreadCopy = Translations['assistant']['thread']

// The error card's layer fallbacks (lib/error-surface-copy.ts): used when a failure code has no own entry.
export const hiErrorLayers: Pick<ThreadCopy, 'errorLayerBodies' | 'errorLayers'> = {
  errorLayers: {
    auth: "साइन-इन की समस्या",
    billing: "क्रेडिट समाप्त",
    disk: "डिस्क भरी है",
    endpoint: "आपके मॉडल सर्वर तक नहीं पहुँच सकते",
    gateway: "संदेश भेजा नहीं जा सका",
    generic: "{app_name} यह उत्तर पूरा नहीं कर सका",
    provider: "AI सेवा ने त्रुटि लौटाई",
    runtime: "{app_name} में समस्या हुई",
    streaming: "उत्तर बीच में कट गया"
  },
  errorLayerBodies: {
    auth: "AI सेवा ने साइन-इन अस्वीकार किया। प्रदाता के क्रेडेंशियल जाँचें, फिर संदेश भेजें।",
    billing: "इस प्रदाता के लिए खाते में क्रेडिट नहीं बचे। क्रेडिट भरें या प्रदाता बदलें, फिर भेजें।",
    disk: "डिस्क भरी है, इसलिए {app_name} बातचीत सहेज नहीं सका। जगह खाली करें, फिर कोशिश करें।",
    endpoint: "{app_name} आपके कस्टम मॉडल सर्वर तक नहीं पहुँच सकता। सुनिश्चित करें कि चल रहा है, फिर संदेश भेजें।",
    gateway:
      "उत्तर शुरू करते समय {app_name} में आंतरिक समस्या हुई। संदेश फिर भेजें; समस्या बनी रहे तो निदान भेजें।",
    generic: "{app_name} के उत्तर देते समय समस्या हुई। फिर कोशिश करें या समस्या बनी रहे तो विवरण कॉपी करें।",
    provider: "AI सेवा अनुरोध पूरा नहीं कर सकी। थोड़ी देर में फिर कोशिश करें या प्रदाता बदलें।",
    runtime:
      "उत्तर शुरू करते समय {app_name} में आंतरिक समस्या हुई। संदेश फिर भेजें; समस्या बनी रहे तो निदान भेजें।",
    streaming: "उत्तर पूरा होने से पहले कनेक्शन टूट गया। फिर भेजने के लिए पुनः प्रयास करें।"
  }
}
