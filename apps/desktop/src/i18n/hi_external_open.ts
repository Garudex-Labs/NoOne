import type { ExternalOpenFailedCopy } from './types_external_open'

export const hiExternalOpenFailed: ExternalOpenFailedCopy = {
  title: "यह लिंक खुल नहीं सका",
  message: "इस पते के लिए कोई ब्राउज़र पंजीकृत नहीं है। लिंक कॉपी करके स्वयं खोलें।",
  copyUrl: "लिंक कॉपी करें",
  close: "बंद करें",
  missing: {
    title: "फ़ाइल नहीं मिली",
    message: "यह फ़ाइल मौजूद नहीं — शायद हट गई, स्थानांतरित हुई या दूसरी मशीन पर हो।"
  }
}
