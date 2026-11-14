import type { GatewayGroupOpenCopy, SkillDeepLinkCopy } from './types_deep_links'

export const hiSkillDeepLink: SkillDeepLinkCopy = {
  installTitle: (name: string) => `“${name}” इंस्टॉल करें?`,
  installDescription: "यह कौशल नए सत्रों में उपलब्ध होगा। केवल विश्वसनीय स्रोत इंस्टॉल करें।",
  installTo: "यहाँ इंस्टॉल करें",
  thisComputer: "यह कंप्यूटर",
  installing: "इंस्टॉल हो रहा है…",
  installComplete: (name: string) => `“${name}” इंस्टॉल हुआ`,
  destinationChanged: "गंतव्य बदल गया। यह संवाद बंद करके इंस्टॉल लिंक फिर खोलें।",
  installed: "इंस्टॉल है",
  source: "स्रोत"
}

export const hiGatewayGroupOpen: GatewayGroupOpenCopy = {
  opening: "समूह चैट खुल रही है…",
  lookupFailed: "गेटवे पर यह समूह खोजा नहीं जा सका। फिर कोशिश करें।",
  missing: "यह समूह चैट अब मौजूद नहीं है।"
}
