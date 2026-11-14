import { appText } from '@noone/shared/application-identity'

import type { PluginUpdateTranslations } from './types_plugin_update'
/** Copy for updating an installed plugin (Plugins tab): catalog re-pin consent and the security-scan override. */
export const hiPluginUpdate: PluginUpdateTranslations = {
  folderAccess: {
    title: "फ़ोल्डर पहुँच",
    hint: (name: string) => `${name} इन फ़ोल्डर की फ़ाइलें पढ़ और बदल सकता है। रद्द करना तुरंत लागू होता है।`,
    revoke: "रद्द करें",
    revokeLabel: (path: string) => `${path} की पहुँच रद्द करें`,
    revoked: (name: string, path: string) => `${name} अब ${path} उपयोग नहीं कर सकता।`,
    revokeFailed: (name: string) => `${name} की फ़ोल्डर पहुँच रद्द नहीं हो सकी`,
    pickerTitle: (name: string) => `${name} के लिए फ़ोल्डर चुनें`,
    pickerButton: "पहुँच की अनुमति दें",
    refusedProtected: (name: string) =>
      `${name} यह फ़ोल्डर उपयोग नहीं कर सकता: इसमें ${appText('{app_name}')} की सेटिंग्स, कुंजियाँ या प्लगइन डेटा है। ऐसा फ़ोल्डर चुनें जिसमें ये न हों।`,
    loadFailed: (name: string) => `${name} से साझा फ़ोल्डर लोड नहीं हो सके।`
  },
  updateToPin: (sha: string) => `${sha} पर अपडेट करें`,
  updateFailed: (name: string) => `${name} अपडेट नहीं हो सका`,
  updated: (name: string) => `${name} वर्तमान सूची के पिन पर अपडेट हुआ। लागू करने के लिए गेटवे फिर शुरू करें।`,
  updateConsentTitle: (name: string) => `${name} और पहुँच माँगता है`,
  updateConsentBody: (name: string, sha: string) =>
    `${name} का नया सूची पिन (${sha}) ऐसी क्षमताएँ जोड़ता है जो इंस्टॉल संस्करण में नहीं हैं। केवल भरोसा हो तो लागू करें:`,
  updateConsentConfirm: "अपडेट लागू करें",
  updateScanTitle: (name: string) => `सुरक्षा जाँच ने ${name} को चिह्नित किया`,
  updateScanBody: (name: string, count: number) =>
    `${name} के अपडेट पर सावधानी का निर्णय मिला (${count} ${count === 1 ? 'निष्कर्ष' : 'निष्कर्ष'})। हर अपडेट जाँचा जाता है। केवल स्रोत पर भरोसा हो तो लागू करें:`,
  updateScanMore: (count: number) => `+ ${count} और`,
  updateScanConfirm: "फिर भी अपडेट करें",
  updateScanBlocked: (name: string) =>
    `सुरक्षा जाँच ने ${name} का अपडेट रोका (खतरनाक निर्णय)। इसे दरकिनार नहीं कर सकते।`,
  updatedGit: (name: string) => `${name} नवीनतम कमिट पर अपडेट हुआ।`,
}
