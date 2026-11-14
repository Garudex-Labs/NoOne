import { appText } from '@noone/shared/application-identity'

import type { PluginPreviewAccessTranslations } from './types_plugin_preview_access'
/** Copy for the preview-script consent prompt and the per-plugin grant list (Capabilities ▸ Plugins). */
export const hiPluginPreviewAccess: PluginPreviewAccessTranslations = {
  previewScriptPromptTitle: (plugin: string) => `${plugin} को इस पृष्ठ पर स्क्रिप्ट चलाने दें?`,
  previewScriptPromptBody: (plugin: string, origin: string) =>
    `${plugin} पूर्वावलोकन ब्राउज़र में ${origin} पर JavaScript चलाना चाहता है।`,
  previewScriptPromptRisk: "स्क्रिप्ट उस साइट की हर चीज़ पढ़ और बदल सकती हैं, उन खातों के पृष्ठ भी जिनमें आप साइन इन हैं।",
  previewScriptPromptRevokeHint: "केवल इस साइट पर लागू। क्षमताएँ ▸ प्लगइन में अनुमति रद्द कर सकते हैं।",
  previewScriptAllow: "इस साइट पर अनुमति दें",
  previewScriptDeny: "अनुमति न दें",
  previewScriptAccessLabel: "पृष्ठ स्क्रिप्ट",
  previewScriptAccessNone: "पृष्ठ पर स्क्रिप्ट चलाने से पहले पूछता है",
  previewScriptRevoke: (origin: string) => `${origin} की पहुँच रद्द करें`,
  previewScriptRevoked: (plugin: string, origin: string) => `${plugin} अब ${origin} पर स्क्रिप्ट नहीं चला सकता।`,
  previewScriptRevokeUnsaved: (plugin: string, origin: string) =>
    `बदलाव सहेजा नहीं जा सका, इसलिए ${appText('{app_name}')} फिर शुरू होने तक ही रहेगा। अभी ${plugin} को ${origin} पर रोका गया है।`
}
