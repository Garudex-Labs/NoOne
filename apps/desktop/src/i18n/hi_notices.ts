import { hiDesktopCommands } from './hi_desktop_commands'
import { hiSessionCommands } from './hi_session_commands'
import type { Translations } from './types'

// Shell notices (remote-display toast, butterbar, keep-awake offer), spread into en.ts.
export const hiNotices = {
  remoteDisplayBanner: {
    message: reason =>
      `सॉफ़्टवेयर रेंडरिंग सक्रिय — दूरस्थ डिस्प्ले मिला (${reason})। झिलमिलाहट रोकने के लिए GPU त्वरण बंद है।`
  },
  butterbar: {
    goTo: (index, total) => `${total} में से सूचना ${index} दिखाएँ`,
    legal: {
      before: "{app_name} का उपयोग इनके अधीन है: ",
      terms: "सेवा की शर्तें",
      between: " और ",
      privacy: "गोपनीयता नीति",
      after: '.'
    }
  },
  promptNotices: {
    legacySendUnconfirmed:
      "सर्वर इस संदेश के पहले भेजे जाने की पुष्टि नहीं कर सका, इसलिए यह पहले चल चुका हो सकता है। फिर भेजने से पहले बातचीत जाँचें।",
    restoredDraftAttachmentsDropped:
      "न भेजे गए संदेश के अटैचमेंट बहाल नहीं हुए। भेजने से पहले फिर जोड़ें।",
    mcpReloadDeferred:
      "चैट व्यस्त है: MCP बदलाव चरण पूरा होने और MCP फिर लोड होने पर, या चैट फिर खोलने पर लागू होता है",
    mcpReloadUnavailable: servers => `नहीं जुड़े: ${servers}`,
    compactedTurnUnavailable:
      "चैट संपीड़न के दौरान इस संदेश का सारांश बना, इसलिए अब इसे बहाल या संपादित नहीं किया जा सकता।",
    staleTurnUnavailable: "यह संदेश अब चैट के इतिहास में नहीं है।",
    sessionCommands: hiSessionCommands,
    desktopCommands: hiDesktopCommands
  },
  keepAwakeOffer: {
    title: "{app_name} के काम करते समय कंप्यूटर स्लीप में चला गया",
    message:
      "कार्य चलते समय {app_name} कंप्यूटर जागृत रख सकता है। स्क्रीन फिर भी बंद होती है और बैटरी पर कंप्यूटर फिर भी स्लीप में जा सकता है।",
    action: "काम करते समय जागृत रखें"
  },
  connectorOffer: {
    heading: "जुड़े हुए ऐप बनाए रखें",
    body: "Gmail या Slack जैसे जुड़े ऐप अपने खाते में रखने के लिए मुफ़्त Nous खाते से साइन इन करें।"
  }
} satisfies Pick<
  Translations,
  'remoteDisplayBanner' | 'butterbar' | 'promptNotices' | 'keepAwakeOffer' | 'connectorOffer'
>
