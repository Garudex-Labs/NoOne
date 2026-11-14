import type { DesktopCommandNotices } from './types_desktop_commands'

// Desktop-side /rollback /agents /config /history /save /export /import /timestamps lines.
export const hiDesktopCommands: DesktopCommandNotices = {
  error: message => `त्रुटि: ${message}`,
  rollbackUsage: "उपयोग: /rollback [list] | diff <n|hash> | <n|hash> [file] [--all]",
  checkpointsDisabled: "इस सत्र में पुनर्स्थापना बिंदु चालू नहीं हैं (config.yaml में checkpoints.enabled सेट करें)।",
  checkpointsEmpty: "इस कार्य निर्देशिका में अभी कोई पुनर्स्थापना बिंदु नहीं।",
  checkpointsHeader: "पुनर्स्थापना बिंदु (नवीनतम पहले):",
  checkpointsHint:
    "/rollback <n> [file] से बहाल करें (अपने संपादन भी बदलने के लिए --all जोड़ें); /rollback diff <n> से पूर्वावलोकन करें।",
  noDiff: "उस पुनर्स्थापना बिंदु के बाद कोई बदलाव नहीं।",
  rollbackFailed: error => `वापस लौटना विफल: ${error}`,
  unknownError: "अज्ञात त्रुटि",
  restored: hash => (hash ? `पुनर्स्थापना बिंदु ${hash} बहाल हुआ।` : "पुनर्स्थापना बिंदु बहाल हुआ।"),
  rewound: count => `इस बातचीत के ${count} संदेश पीछे किए गए।`,
  reopenForRewind: "पीछे की गई बातचीत देखने के लिए चैट फिर खोलें।",
  agentsEmpty: "इस चैट में कोई सक्रिय उप-एजेंट या पृष्ठभूमि प्रक्रिया नहीं।",
  subagentsHeader: count => `उप-एजेंट (${count}):`,
  subagentFallback: "उप-एजेंट",
  statusRunning: "चल रहा है",
  toolCalls: count => `${count} टूल कॉल`,
  processesHeader: count => `पृष्ठभूमि प्रक्रियाएँ (${count}):`,
  configHeader: "कॉन्फ़िगरेशन (प्रदर्शन, अनुमति, पेस्ट और आवाज़ सेटिंग्स; बाकी नहीं दिखतीं):",
  configDefaults: "(डिफ़ॉल्ट)",
  configFooter: "सेटिंग्स में बदलाव करें या गेटवे होस्ट पर `noone config edit` से config.yaml संपादित करें।",
  historyHeader: count => `बातचीत का इतिहास (${count} संदेश):`,
  historyEmpty: "अभी कोई संदेश नहीं।",
  historyYou: "आप",
  historyHermes: '{app_name}',
  saveUsage: "उपयोग: /save [json|md|html] [filename] [redact]",
  saveLegacyRefused:
    "सहेजा नहीं गया: यह गेटवे संवेदनशील जानकारी छिपाई हुई, नाम वाली या गैर-JSON प्रति निर्यात नहीं कर सकता। गेटवे अपडेट करें या बिना विकल्प /save चलाकर गेटवे होस्ट पर मूल JSON लिखें।",
  savedOnHost: path => `गेटवे होस्ट पर सहेजा गया: ${path}`,
  unknownPath: "(अज्ञात पथ)",
  saveUnsupported: "त्रुटि: यह डेस्कटॉप बिल्ड फ़ाइलें नहीं सहेज सकता",
  saveDialogTitle: "बातचीत सहेजें",
  savedTo: path => `बातचीत ${path} में सहेजी गई`,
  saveCancelled: "सहेजा नहीं गया (रद्द)।",
  exportRemote:
    "/export गेटवे होस्ट से प्रोफ़ाइल पैक करता है, जो यह मशीन नहीं है। उस होस्ट पर `noone profile export` चलाएँ।",
  importRemote:
    "/import गेटवे होस्ट पर प्रोफ़ाइल इंस्टॉल करता है, जो यह मशीन नहीं है। उस होस्ट पर `noone profile import <archive>` चलाएँ।",
  timestampsUsage: "उपयोग: /timestamps [on|off|status]",
  timestampsOn: "समय चिह्न: चालू (इस विंडो में; बनाए रखने के लिए config.yaml में display.timestamps सेट करें)",
  timestampsOff: "समय चिह्न: बंद (इस विंडो में; बनाए रखने के लिए config.yaml में display.timestamps सेट करें)"
}
