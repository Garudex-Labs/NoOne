import type { Translations } from './types'

export const hiConnectorAccounts: Translations['connectorsPage']['accounts'] = {
  heading: "खाते",
  count: (count: number) => `${count} ${count === 1 ? 'खाता' : 'खाते'}`,
  addAnother: "दूसरा खाता जोड़ें",
  aliasLabel: "खाते का नाम",
  aliasHint: "छोटे लैटिन अक्षर, अंक और डैश, अधिकतम 32। जैसे work या home।",
  aliasInvalid: "छोटे लैटिन अक्षर, अंक और डैश उपयोग करें; शुरुआत अक्षर या अंक से करें।",
  aliasTaken: "यह नाम पहले से उपयोग में है।",
  add: "जोड़ें",
  rename: "नाम बदलें",
  renameLabel: (name: string) => `${name} के लिए नया नाम`,
  renameGone: "यह खाता अब नहीं है। इसे हटाया गया या फिर जुड़ने पर बदल दिया गया।",
  remove: "हटाएँ",
  removeTitle: (app: string, name: string) => `${name} ${app} खाता हटाएँ?`,
  removeBody: "{app_name} इस खाते के रूप में काम करना बंद करेगा। बाकी खाते जुड़े रहेंगे।",
  retiredCount: (count: number) => `${count} बदले गए खाते`,
  status: {
    expired: "पहुँच की अवधि समाप्त",
    failed: "जुड़ नहीं सका",
    inactive: "निष्क्रिय",
    pending: "साइन-इन की प्रतीक्षा",
    retired: "फिर जुड़ने पर बदल गया",
    revoked: "पहुँच रद्द"
  }
}
