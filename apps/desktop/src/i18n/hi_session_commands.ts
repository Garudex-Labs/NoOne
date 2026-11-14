import { appText } from '@noone/shared/application-identity'

import type { SessionCommandNotices } from './types_notices'
// Typed /undo /retry /steer /queue lines: the Ink TUI's wording on the same gateway.
export const hiSessionCommands: SessionCommandNotices = {
  undoUsage: "उपयोग: /undo [N]",
  undoNothing: "पूर्ववत करने के लिए कुछ नहीं",
  undidOne: (count: string) => `${count} संदेश पूर्ववत हुआ — हटाया संदेश संपादक में है`,
  undidOther: (count: string) => `${count} संदेश पूर्ववत हुए — हटाया संदेश संपादक में है`,
  retryNothing: "फिर भेजने के लिए कुछ नहीं",
  retryUnsupported: "/retry: मीडिया या अज्ञात सामग्री भागों का पुनः प्रयास समर्थित नहीं",
  busy: (command: string) =>
    `सत्र व्यस्त — ${appText('{app_name}')} अभी उत्तर दे रहा है। पहले वर्तमान उत्तर रोकें (रोकें बटन या टर्मिनल में Ctrl+C), फिर /${command} चलाएँ।`,
  busyCompressing: (command: string) =>
    `सत्र व्यस्त — /compress चल रहा है; पूरा होने पर /${command} चलाएँ।`,
  steerUsage: "उपयोग: /steer <prompt>",
  steerQueued: (preview: string) => `दिशा संदेश कतार में — अगली टूल कॉल के बाद आएगा: "${preview}"`,
  steerNoActiveTurn: (preview: string) => `कोई सक्रिय चरण नहीं — अगले के लिए कतार में: "${preview}"`,
  steerRejected: "दिशा संदेश अस्वीकार — सक्रिय चरण नहीं, अगले चरण के लिए कतार में",
  queued: (preview: string) => `कतार में: "${preview}"`,
  queueFailed: "संदेश कतार में नहीं रखा जा सका",
  countOne: (count: string) => `${count} संदेश कतार में`,
  countOther: (count: string) => `${count} संदेश कतार में`,
  queueEditKeptTitle: "कतार का संदेश नहीं बदला",
  queueEditKept: "संपादन सहेजने से पहले शुरू या अस्वीकार हुआ। संपादित पाठ संदेश संपादक में है।",
  queueEditUnconfirmedTitle: "संपादन की पुष्टि नहीं",
  queueEditUnconfirmed:
    "{app_name} संपादन की पुष्टि नहीं कर सका। वही संपादन फिर आज़माने के लिए दोबारा सहेजें; कभी दो बार कतार में नहीं जाता।"
}
