import type { Translations } from './types'

export const hiAppTour: Translations['appTour'] = {
  sessions: { title: "आपकी चैट", text: "हर बातचीत यहाँ रहती है। किसी को भी खोजें, पिन करें या फिर खोलें।" },
  composer: { title: "यहाँ पूछें", text: "बताएँ कि क्या करवाना है। फ़ाइल जोड़ने के लिए @ लिखें।" },
  newSession: { title: "नए सिरे से शुरू करें", text: "नए सत्र का अपना संदर्भ होता है। हर काम के लिए अलग सत्र उपयोग करें।" },
  model: { title: "मॉडल चयन", text: "उत्तर देने वाला मॉडल चुनता है।" },
  modelLocal: "यह कंप्यूटर स्थानीय मॉडल चला सकता है: सेटिंग्स > प्रदाता > स्थानीय मॉडल।",
  capabilities: { title: "क्षमताएँ", text: "{app_name} के लिए कौशल, टूल और प्लगइन। यहाँ और जोड़ें।" },
  messaging: { title: "संदेश सेवाएँ", text: "Telegram, Slack, Discord और अन्य सेवाओं से {app_name} तक पहुँचें।" },
  rightPane: { title: "कार्य पैनल", text: "दाईं ओर फ़ाइल, टर्मिनल, समीक्षा और ऐप का ब्राउज़र खोलता है।" }
}
