import { appText } from '@noone/shared/application-identity'

import type { CatalogInstallTranslations } from './types_catalog_install'
export const hiCatalogInstall: CatalogInstallTranslations = {
  preparing: "इंस्टॉल की तैयारी हो रही है…",
  install: "इंस्टॉल करें",
  advanced: "उन्नत",
  skip: "छोड़ें",
  installing: "इंस्टॉल हो रहा है…",
  installed: "इंस्टॉल है",
  notInstalled: "इंस्टॉल नहीं है",
  failed: "विफल",
  showNames: "नाम दिखाएँ",
  hideNames: "नाम छिपाएँ",
  skill: name => `कौशल ${name}`,
  kind: { plugin: "प्लगइन", skill: "कौशल" },
  tier: { official: "आधिकारिक", verified: "सत्यापित", community: "समुदाय" },
  targetProfile: profile => `आपकी ${profile} प्रोफ़ाइल में इंस्टॉल होता है`,
  sendFailed: "उत्तर भेजा नहीं जा सका। फिर कोशिश करें।",
  commitLabel: "कमिट करें",
  subdirLabel: "फ़ोल्डर",
  securityHeading: "सुरक्षा",
  scan: { passed: "जाँच सफल", warnings: "जाँच में चेतावनियाँ मिलीं", failed: "जाँच विफल" },
  requirementsLabel: "आवश्यकताएँ",
  requiresHermes: range => `${appText('{app_name}')} ${range}`,
  envVar: name => `${name} परिवेश चर`,
  credentialsHeading: "क्रेडेंशियल",
  phase: {
    downloading: "डाउनलोड हो रहा है…",
    python_packages: "Python पैकेज इंस्टॉल हो रहे हैं…",
    loading_tools: "इसके टूल लोड हो रहे हैं…"
  },
  serverNotConnected: (server, reason) => `MCP सर्वर ${server} जुड़ा नहीं है${reason ? `: ${reason}` : ''}`,
  notEnabled: "इंस्टॉल है, लेकिन चालू नहीं",
  missingEnv: names => `सेटअप पूरा करने के लिए ${names} निर्धारित करें`,
  alreadyInstalled: "पहले से इंस्टॉल है; वैसा ही रखा गया"
}
