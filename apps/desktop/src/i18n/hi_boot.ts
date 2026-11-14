import { appText } from '@noone/shared/application-identity'

import type { Translations } from './types'
// The boot screen's copy (including the update-hold screen), composed by en.ts.
export const hiBoot = {
  boot: {
    ready: "{app_name} डेस्कटॉप तैयार है",
    desktopBootFailedWithMessage: message => `डेस्कटॉप शुरू नहीं हुआ: ${message}`,
    steps: {
      connectingGateway: "लाइव डेस्कटॉप गेटवे से जुड़ रहा है",
      loadingSettings: "{app_name} सेटिंग्स लोड हो रही हैं",
      loadingSessions: "हाल के सत्र लोड हो रहे हैं",
      retryingRemoteBackend: "दूरस्थ {app_name} बैकएंड से फिर जुड़ रहा है…",
      startingDesktopConnection: "डेस्कटॉप कनेक्शन शुरू हो रहा है",
      startingHermesDesktop: "{app_name} डेस्कटॉप शुरू हो रहा है…"
    },
    errors: {
      backgroundExited:
        "आपकी चैट चलाने वाली सेवा अचानक बंद हुई। जारी रखने के लिए फिर शुरू करें — चैट और सेटिंग्स सुरक्षित हैं।",
      backgroundExitedDuringStartup: "{app_name} शुरू होते ही बंद हो गया।",
      backendStopped: "पृष्ठभूमि में {app_name} ने काम करना बंद कर दिया",
      restartHermes: "{app_name} फिर शुरू करें",
      openLogs: "लॉग खोलें",
      desktopBootFailed: "{app_name} शुरू नहीं हो सका",
      gatewayConnectionLost: "{app_name} का कनेक्शन टूट गया",
      gatewayConnectionLostDetail:
        "फिर जुड़ने का प्रयास जारी है। आप पढ़ और ड्राफ़्ट लिख सकते हैं। समस्या बनी रहे तो अभी फिर जोड़ें या कनेक्शन सेटिंग्स जाँचें।",
      reconnectNow: "अभी फिर जोड़ें",
      connectionSettings: "कनेक्शन सेटिंग्स",
      gatewaySignInRequired: "दूरस्थ {app_name} ने आपको साइन आउट कर दिया",
      gatewaySignInRequiredDetail: "फिर जोड़ने के लिए फिर साइन इन करें। आपकी चैट और सेटिंग्स सुरक्षित हैं।",
      signInAgain: "फिर साइन इन करें",
      ipcBridgeUnavailable: "{app_name} डेस्कटॉप अपनी पृष्ठभूमि सेवा से बात नहीं कर सका। ऐप फिर शुरू करें।"
    },
    // Plain causes for a local backend boot failure (`classifyBootFailure`);
    // the raw output stays behind "Show recent logs".
    causes: {
      exitedEarly: "{app_name} की पृष्ठभूमि सेवा शुरू होते ही बंद हुई।",
      timedOut: "{app_name} की पृष्ठभूमि सेवा ने समय पर उत्तर नहीं दिया।",
      permission: "{app_name} अपने डेटा फ़ोल्डर में लिख नहीं सका (अनुमति की समस्या)।",
      diskFull: "डिस्क भर गई है, इसलिए {app_name} शुरू नहीं हो सका।",
      portInUse: "कोई दूसरा प्रोग्राम {app_name} का आवश्यक नेटवर्क पोर्ट उपयोग कर रहा है।",
      installMissing: "{app_name} इंस्टॉल का एक हिस्सा गायब है। वापस लाने के लिए इंस्टॉल सुधारें चुनें।"
    },
    failure: {
      title: "{app_name} शुरू नहीं हो सका",
      description:
        "{app_name} की पृष्ठभूमि सेवा शुरू नहीं हुई। नीचे का कोई सुधार उपाय आज़माएँ। यहाँ कुछ भी चैट या सेटिंग्स नहीं मिटाता।",
      details: "विवरण",
      remoteTitle: "दूरस्थ गेटवे में साइन इन आवश्यक",
      remoteDescription:
        "दूरस्थ गेटवे सत्र समाप्त हो गया। फिर जोड़ने के लिए साइन इन करें। यहाँ कुछ भी चैट या सेटिंग्स नहीं मिटाता।",
      webappTitle: "{app_name} में साइन इन करें",
      webappDescription: "इस ब्राउज़र में साइन इन करने के लिए इस कंप्यूटर पर noone webapp चलाएँ।",
      retry: "फिर कोशिश करें",
      repairInstall: "इंस्टॉल सुधारें",
      useLocalGateway: "स्थानीय गेटवे उपयोग करें",
      gatewaySettings: "गेटवे सेटिंग्स",
      back: "वापस",
      openLogs: "लॉग खोलें",
      repairHint: "सुधार इंस्टॉलर फिर चलाता है और नई मशीन पर कुछ मिनट लग सकते हैं।",
      bundledReinstallHint:
        "यह बंडल इंस्टॉल ऐप के भीतर से खुद को सुधार नहीं सकता — बैकएंड बहाल करने के लिए ऐप फिर इंस्टॉल करें।",
      reinstallApp: "ऐप फिर इंस्टॉल करें",
      remoteSignInHint: signInLabel =>
        `सहेजे गए दूरस्थ ब्राउज़र सत्र से साइन आउट करता है, फिर ${signInLabel} खोलता है। इसके बजाय साथ में दिए बैकएंड पर जाने के लिए स्थानीय गेटवे उपयोग करें।`,
      signOutAndSignIn: "साइन आउट करके फिर साइन इन करें",
      remoteFailureHint: "गेटवे सेटिंग्स में URL और साइन-इन जाँचें या स्थानीय गेटवे पर जाएँ।",
      cloudDownTitle: "Nous Cloud एजेंट बंद है",
      cloudDownDescription:
        "इस गेटवे से जुड़ा Nous-प्रबंधित क्लाउड एजेंट सर्वर त्रुटि दे रहा है। यहाँ से फिर शुरू नहीं हो सकता — स्थिति जाँचें, स्थानीय गेटवे चुनें या सहायता लें।",
      cloudDownHint:
        "नीचे के बटन Nous पोर्टल (इंस्टेंस की स्थिति और नियंत्रण) और सहायता के लिए हमारा Discord खोलते हैं।",
      cloudDownCheckPortal: "पोर्टल की स्थिति जाँचें",
      cloudDownDiscord: "Discord पर सहायता लें",
      hideRecentLogs: "हाल के लॉग छिपाएँ",
      showRecentLogs: "हाल के लॉग दिखाएँ",
      signedInTitle: "साइन इन है",
      signedInMessage: "दूरस्थ गेटवे से फिर जुड़ रहा है…",
      signInIncompleteTitle: "साइन-इन अधूरा",
      signInIncompleteMessage: "प्रमाणीकरण पूरा होने से पहले लॉगिन विंडो बंद हुई।",
      signInFailed: "साइन-इन विफल",
      signInToRemoteGateway: "दूरस्थ गेटवे में साइन इन करें",
      signInWithProvider: provider => `${provider} से साइन इन करें`,
      identityProvider: "आपका पहचान प्रदाता"
    },
    updateHold: {
      title: "पिछला अपडेट अभी {app_name} को रोके हुए है",
      titleUnverified: "{app_name} पिछले अपडेट के पूरा होने की पुष्टि नहीं कर सकता",
      description:
        "अपडेट जिन फ़ाइलों को अभी बदल रहा हो उन्हें लोड करने से बचने के लिए {app_name} शुरू नहीं हो रहा। रोक समाप्त होते ही अपने आप शुरू होगा।",
      heldByProcess: pid =>
        `अपडेट (प्रक्रिया ${pid}) समाप्त हुआ, लेकिन उसके द्वारा शुरू हुई प्रक्रिया अभी भी ${appText('{app_name}')} इंस्टॉल को रोके हुए है।`,
      heldUnknown: "अपडेट समाप्त हुआ, लेकिन उसके द्वारा शुरू हुई प्रक्रिया अभी भी {app_name} इंस्टॉल को रोके हुए है।",
      unverified: "अपडेट सहायक अभी {app_name} इंस्टॉल का स्वामी जाँच नहीं सका। {app_name} जाँच जारी रखता है।",
      since: time => `${time} से प्रतीक्षा है`,
      lastChecked: time => `पिछली जाँच ${time}`,
      recoveryHint:
        "सामान्यतः कुछ मिनट में ठीक होता है। न हो तो {app_name} बंद करें, बची git या hermes प्रक्रियाएँ समाप्त करें (या कंप्यूटर फिर शुरू करें), फिर {app_name} खोलें।",
      checkAgain: "फिर जाँचें",
      quit: "{app_name} बंद करें",
      openLogs: "लॉग खोलें",
      startAnyway: "फिर भी शुरू करें…",
      confirmTitle: "अपडेट की रोक के बावजूद {app_name} शुरू करें?",
      confirmBody:
        "बची हुई अपडेट प्रक्रिया शायद अभी {app_name} की फ़ाइलें बदल रही हो। अभी शुरू करने पर अधूरा अपडेट लोड हो सकता है, जो दोबारा अपडेट करने तक काम न करे। {app_name} यह चुनाव लॉग में दर्ज करता है और अपडेट चिह्न बना रहने देता है।",
      confirmKeepWaiting: "प्रतीक्षा जारी रखें",
      confirmStart: "फिर भी शुरू करें",
      startAnywayRefused: "{app_name} शुरू होने से पहले इंस्टॉल को रोकने वाली प्रक्रिया बदल गई। समीक्षा करके फिर कोशिश करें।"
    }
  }
} satisfies Pick<Translations, 'boot'>
