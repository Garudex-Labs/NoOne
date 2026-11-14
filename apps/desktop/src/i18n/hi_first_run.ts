import type { FirstRunCopy } from './types_first_run'

export const hiFirstRun: FirstRunCopy = {
  beats: {
    name: "नाम",
    theme: "मुख्य रंग",
    layout: "लेआउट",
    connectors: "ऐप",
    plugins: "प्लगइन",
    tour: "परिचय यात्रा",
    build: "पहला कार्य"
  },
  namePlaceholder: "आपका नाम",
  useName: name => `“${name}” उपयोग करें`,
  install: "इंस्टॉल करें",
  installed: "इंस्टॉल है",
  loading: "लोड हो रहा है…",
  noPlugins: "अभी दिखाने के लिए कोई प्लगइन नहीं है।",
  noneChosen: "कोई नहीं",
  noAnswer: "कोई उत्तर नहीं",
  answerRefused: "उत्तर स्वीकार नहीं हुआ",
  tours: {
    quick: "संक्षिप्त परिचय",
    full: "सब कुछ दिखाएँ",
    skip: "छोड़ें, कुछ बनाते हैं"
  },
  skippedAll: "सेटअप छोड़ा गया",
  skip: "सेटअप छोड़ें",
  skipTip: "निर्देशित सेटअप समाप्त करके नई चैट खोलें।",
  skipFailed: "सेटअप छोड़ा नहीं जा सका",
  slashOffTitle: "सेटअप के दौरान स्लैश कमांड बंद हैं",
  slashOffBody: "सेटअप पूरा होने पर सामान्य रूप से काम करते हैं।",
  localModel: {
    title: "यह कंप्यूटर स्थानीय मॉडल चला सकता है",
    text: (model, size) => `${model} (${size}) आपके हार्डवेयर पर चल सकता है। यह मुफ़्त है और आपकी चैट इसी कंप्यूटर पर रहती हैं।`,
    setUp: "सेटअप करें",
    notNow: "अभी नहीं"
  },
  intro: {
    greeting: "नमस्ते, मैं {app_name} हूँ।",
    plan: "पहले आपके लिए सब कुछ तैयार करते हैं। फिर मिलकर कुछ बढ़िया करेंगे।"
  },
  rerun: {
    title: "शुरुआती सेटअप फिर चलाएँ",
    description: "वर्तमान मॉडल से पहली बार के चरण दिखाने वाली नई सेटअप चैट खोलें।",
    action: "फिर चलाएँ",
    failed: "शुरुआती सेटअप शुरू नहीं हो सका"
  }
}
