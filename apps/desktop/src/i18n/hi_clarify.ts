import type { ClarifyCopy } from './types_clarify'

export const hiClarify: ClarifyCopy = {
  notReady: "स्पष्टीकरण अनुरोध अभी तैयार नहीं",
  gatewayDisconnected: "{app_name} अभी ऑफ़लाइन है। फिर जोड़ें, फिर संदेश भेजें।",
  sendFailed: "स्पष्टीकरण उत्तर भेजा नहीं जा सका",
  loadingQuestion: "प्रश्न लोड हो रहा है…",
  other: "अन्य (अपना उत्तर लिखें)",
  placeholder: "अपना उत्तर लिखें…",
  skip: "छोड़ें",
  skipped: "छोड़ा गया",
  noAnswer: "कोई उत्तर नहीं",
  confirmAndContinueLabel: "पुष्टि करें और जारी रखें",
  singleSelectHint: "एक चुनें",
  multiSelectHint: "सभी लागू विकल्प चुनें",
  oneQuestion: "1 प्रश्न",
  questionProgress: (answered, total) => `${total} में से ${answered} का उत्तर दिया`,
  notDelivered:
    "यह प्रश्न ऐप तक नहीं पहुँचा, इसलिए यहाँ उत्तर नहीं दिया जा सकता। रोकें दबाकर चरण समाप्त करें, फिर चैट में उत्तर दें।"
}
