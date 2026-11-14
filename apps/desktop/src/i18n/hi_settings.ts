import type { TranslationOverrides } from './define-locale'
import { hiSettingsModels } from './hi_settings_models'

export const hiSettings = {
  settings: {
    subpages: {
      appearanceTheme: 'थीम',
      appearanceTypography: 'अक्षर-विन्यास',
      appearanceWindowLayout: 'विंडो और लेआउट',
      appearanceChatDisplay: 'चैट का प्रदर्शन',
      appearancePet: 'पालतू साथी',
      appearanceGeneral: 'सामान्य',
      modelMain: 'मुख्य मॉडल',
      modelAuxiliary: 'सहायक मॉडल',
      modelMoa: 'एजेंटों का मिश्रण',
      modelFallbacks: 'वैकल्पिक मॉडल',
      chatBehavior: 'व्यवहार',
      chatAttachments: 'अटैचमेंट',
      workspaceProjects: 'प्रोजेक्ट और खोज',
      workspaceShell: 'शेल परिवेश',
      workspaceFiles: 'फ़ाइलें और निष्पादन',
      safetyApprovals: 'अनुमतियाँ',
      safetyPrivacy: 'गोपनीयता और नेटवर्क',
      safetyCheckpoints: 'पुनर्स्थापना बिंदु',
      browserProfile: 'ब्राउज़र प्रोफ़ाइल',
      browserNetwork: 'स्थानीय और निजी URL',
      memoryPersistent: 'स्थायी स्मृति',
      memoryContext: 'संदर्भ और संपीड़न',
      voiceConversation: 'आवाज़ से बातचीत',
      voiceTranscription: 'वाणी से पाठ',
      voiceSpeech: 'पाठ से वाणी',
      advancedRuntime: 'एजेंट की सीमाएँ',
      advancedTools: 'टूल तक पहुँच',
      advancedTerminal: 'टर्मिनल बैकएंड',
      advancedOutput: 'आउटपुट की सीमाएँ',
      advancedDelegation: 'उप-एजेंट',
      advancedDesktop: 'डेस्कटॉप और शुरुआत',
      gatewayConnection: 'प्राथमिक गेटवे',
      gatewayDevices: 'सहेजे गए कनेक्शन',
      gatewayManagedUpdates: 'दूरस्थ अपडेट',
      gatewayManagedUpdatesUnavailable:
        'दूरस्थ अपडेट के लिए ऐसा डेस्कटॉप संस्करण चाहिए जो प्रबंधित SSH अपडेट का समर्थन करता हो।',
      gatewayManagedUpdatesEmpty: 'यहाँ अपडेट प्रबंधित करने के लिए सहेजे गए कनेक्शन में एक SSH कनेक्शन जोड़ें।',
      keyboardShortcuts: 'कुंजी संयोजन',
      hudGesture: 'HUD का इशारा',
      screenCapture: 'स्क्रीन कैप्चर',
      notificationAlerts: 'डेस्कटॉप सूचनाएँ',
      notificationSounds: 'ध्वनियाँ',
      archivedSessions: 'संग्रह और रखरखाव अवधि',
      defaultDirectory: 'डिफ़ॉल्ट प्रोजेक्ट फ़ोल्डर',
      vaultCredentials: 'सहेजे गए क्रेडेंशियल',
      vaultSources: 'पासवर्ड प्रबंधक',
      appUpdates: 'संस्करण और अपडेट',
      uninstall: 'अनइंस्टॉल करें',
      billingOverview: 'सारांश',
      billingPlans: 'योजनाएँ'
    },
    closeSettings: 'सेटिंग्स बंद करें',
    exportConfig: 'कॉन्फ़िगरेशन निर्यात करें',
    importConfig: 'कॉन्फ़िगरेशन आयात करें',
    resetToDefaults: 'डिफ़ॉल्ट पर रीसेट करें',
    resetConfirm: 'सभी सेटिंग्स को {app_name} के डिफ़ॉल्ट पर रीसेट करें?',
    exportFailed: 'निर्यात विफल',
    resetFailed: 'रीसेट विफल',
    pluginPages: {
      blurb:
        'इंस्टॉल किए गए प्लगइन द्वारा जोड़े गए विकल्प। हर प्लगइन का अपना पृष्ठ होता है और कुछ उसके अंतर्गत उप-पृष्ठ जोड़ते हैं।',
      empty: 'अभी किसी प्लगइन की सेटिंग्स नहीं हैं।',
      manage: 'प्लगइन प्रबंधित करें',
      agentSettings: 'एजेंट सेटिंग्स',
      pageCount: (n: number) => (n === 1 ? '1 पृष्ठ' : `${n} पृष्ठ`),
      missing: 'इस प्लगइन का कोई सेटिंग्स पृष्ठ नहीं है। यह बंद या अनइंस्टॉल हो सकता है।'
    },
    nav: {
      providers: 'प्रदाता',
      providerAccounts: 'खाते',
      providerApiKeys: 'API कुंजियाँ',
      providerCustomEndpoints: 'कस्टम एंडपॉइंट',
      providerLocalModels: 'स्थानीय मॉडल',
      gateway: 'गेटवे',
      apiKeys: 'टूल और कुंजियाँ',
      keybinds: 'कीबोर्ड शॉर्टकट',
      keysTools: 'टूल',
      keysSettings: 'सेटिंग्स',
      mcp: 'MCP',
      archivedChats: 'संग्रहीत चैट',
      sessions: 'सत्र',
      about: 'परिचय',
      billing: 'बिलिंग',
      notifications: 'सूचनाएँ',
      vault: 'पासवर्ड और लॉगिन',
      plugins: 'प्लगइन'
    },
    plugins: {
      title: 'डेस्कटॉप प्लगइन',
      openFolder: 'डेस्कटॉप प्लगइन फ़ोल्डर खोलें',
      rescan: 'फिर स्कैन करें',
      reveal: 'फ़ाइल प्रबंधक में दिखाएँ',
      failed: 'विफल',
      kinds: { bundled: 'साथ में शामिल', disk: 'डिस्क पर', runtime: 'रनटाइम' },
      installModal: {
        installFromGit: 'Git से इंस्टॉल करें',
        reviewRepository: 'रिपॉज़िटरी की समीक्षा करें',
        repoPlaceholder: 'https://github.com/owner/repo',
        title: 'प्लगइन इंस्टॉल करें',
        description: 'कुछ भी इंस्टॉल करने से पहले देखें कि इस रिपॉज़िटरी में क्या है।',
        repoLabel: 'रिपॉज़िटरी',
        verified: 'सत्यापित',
        unverified: 'असत्यापित',
        reviewedByNous: 'Nous द्वारा समीक्षा की गई।',
        installsAndEnables: profile => `${profile} के लिए इंस्टॉल होता है और तुरंत चालू हो जाता है।`,
        installsOnly: profile => `${profile} के लिए इंस्टॉल होता है।`,
        advanced: 'उन्नत',
        versionLabel: 'संस्करण',
        reviewedPin: sha => (sha ? `समीक्षा किया गया पिन ${sha}` : 'समीक्षा किया गया पिन'),
        latestCommit: 'नवीनतम कमिट',
        sourceMoved: sha =>
          sha
            ? `आपकी समीक्षा के बाद रिपॉज़िटरी बदल गई है। इंस्टॉल करने से पहले नए संस्करण (कमिट ${sha}) की समीक्षा करें।`
            : 'आपकी समीक्षा के बाद रिपॉज़िटरी बदल गई है। नया संस्करण पढ़ा जा रहा है…',
        legacyBackendConfirm:
          'यह बैकएंड ऐप से पुराना है, इसलिए यह सुनिश्चित नहीं कर सकता कि इंस्टॉल होने वाला संस्करण वही है जिसकी आपने समीक्षा की थी: यदि रिपॉज़िटरी बदल गई है, तो नया संस्करण इंस्टॉल होगा। यह सुनिश्चित करने के लिए बैकएंड अपडेट करें।',
        installAnyway: 'फिर भी इंस्टॉल करें',
        partialInstall: sha =>
          sha
            ? `इस प्लगइन का केवल एक हिस्सा इंस्टॉल हुआ है: एजेंट वाला हिस्सा कमिट ${sha} पर है, लेकिन आपकी समीक्षा के बाद रिपॉज़िटरी बदलने से डेस्कटॉप वाला हिस्सा इंस्टॉल नहीं हो सका। दिखाए गए संस्करण से दोनों हिस्से बदलने के लिए उन्नत विकल्पों में ज़बरन पुनः इंस्टॉल चालू करें, या केवल एजेंट वाला हिस्सा रखने के लिए रद्द करें।`
            : 'इस प्लगइन का केवल एक हिस्सा इंस्टॉल हुआ है: एजेंट वाला हिस्सा इंस्टॉल है, लेकिन आपकी समीक्षा के बाद रिपॉज़िटरी बदलने से डेस्कटॉप वाला हिस्सा इंस्टॉल नहीं हो सका। दिखाए गए संस्करण से दोनों हिस्से बदलने के लिए उन्नत विकल्पों में ज़बरन पुनः इंस्टॉल चालू करें, या केवल एजेंट वाला हिस्सा रखने के लिए रद्द करें।',
        nothingToInstall: 'इस पैकेज में यहाँ इंस्टॉल करने के लिए कुछ नहीं है।',
        includesHeading: 'इस पैकेज में शामिल है',
        agentLabel: 'एजेंट प्लगइन',
        desktopLabel: 'डेस्कटॉप UI',
        profileLabel: 'इस प्रोफ़ाइल के लिए इंस्टॉल करें',
        agentTargetLocal: (profile, dir) => `${profile} बैकएंड (${dir}) में इंस्टॉल होता है`,
        agentTargetRemote: profile => `जुड़े हुए ${profile} बैकएंड में इंस्टॉल होता है`,
        toolsConnected: n => (n === 1 ? '1 टूल जुड़ा है' : `${n} टूल जुड़े हैं`),
        skillsReady: names => (names.length === 1 ? `कौशल ${names[0]} तैयार है` : `${names.length} कौशल तैयार हैं`),
        nextChat: 'अगली चैट में और टूल उपलब्ध होंगे',
        serverNotConnected: (server, reason) => `MCP सर्वर ${server} जुड़ा नहीं है${reason ? `: ${reason}` : '.'}`,
        missingEnvAction: 'सेटअप करें',
        alreadyInstalled: (name: string) => `${name} पहले से इंस्टॉल है।`,
        desktopTarget: 'इस ऐप के स्थानीय desktop-plugins फ़ोल्डर में इंस्टॉल होता है',
        desktopTargetFromPackage: 'ऊपर दिए पैकेज से इस ऐप में लोड होता है — सभी प्रोफ़ाइल के लिए एक जैसा',
        desktopOnlyNote: 'केवल डेस्कटॉप वाले पैकेज बैकएंड एजेंट प्लगइन इंस्टॉल नहीं करते।',
        insecureWarning:
          'यह URL असुरक्षित या स्थानीय स्कीम का उपयोग करता है। प्रोडक्शन इंस्टॉल के लिए https:// या git@ को प्राथमिकता दें।',
        securityIntro:
          'केवल विश्वसनीय स्रोतों से इंस्टॉल करें — क्या जोड़ा जाएगा, यह देखने के लिए नीचे रिपॉज़िटरी की समीक्षा करें।',
        sourceHeading: 'स्रोत कोड',
        viewRepository: 'रिपॉज़िटरी देखें',
        viewPluginFiles: 'प्लगइन फ़ाइलें देखें',
        enableAgent: 'इंस्टॉल के बाद एजेंट प्लगइन चालू करें',
        forceReinstall: 'ज़बरन पुनः इंस्टॉल करें (पहले से इंस्टॉल हो तो बदलें)',
        pinToCommit: 'कमिट पर पिन करें (वैकल्पिक)',
        pinToCommitPlaceholder: 'पूरा 40-अक्षर वाला कमिट SHA',
        pinToCommitHint:
          'इस SHA को इंस्टॉल करने वाले सभी लोगों को समान कोड मिलता है; फिर प्लगइन दोबारा पिन होने तक अपडेट स्वीकार नहीं करता। नवीनतम कमिट के लिए खाली छोड़ें।',
        pinToCommitInvalid: 'पूरा 40-अक्षर वाला कमिट SHA होना चाहिए (ब्रांच और टैग स्वीकार नहीं हैं)।',
        install: 'इंस्टॉल करें',
        installing: 'इंस्टॉल हो रहा है…',
        probing: 'रिपॉज़िटरी की जाँच हो रही है…',
        probeUnavailable: 'इस परिवेश में प्लगइन की जाँच उपलब्ध नहीं है।',
        desktopUnavailable: 'इस परिवेश में डेस्कटॉप प्लगइन इंस्टॉल करना उपलब्ध नहीं है।',
        selectComponent: 'इंस्टॉल करने के लिए कम से कम एक घटक चुनें।',
        agentSuccess: name => `एजेंट प्लगइन ${name} इंस्टॉल हो गया`,
        desktopSuccess: name => `डेस्कटॉप प्लगइन ${name} इंस्टॉल हो गया`,
        agentFailed: 'एजेंट प्लगइन इंस्टॉल विफल',
        installUncertain:
          '{app_name} ने इंस्टॉल परिणाम की प्रतीक्षा बंद कर दी है, लेकिन प्लगइन अभी भी इंस्टॉल हो सकता है। यह संवाद बंद करें और फिर से इंस्टॉल करने से पहले प्लगइन में फिर स्कैन करें का उपयोग करें।',
        desktopFailed: 'डेस्कटॉप प्लगइन इंस्टॉल विफल',
        missingEnv: (name, vars) =>
          `${name} इंस्टॉल है, लेकिन काम करने के लिए एक कुंजी चाहिए: ${vars}। अभी जोड़ें, अन्यथा प्लगइन के टूल विफल होंगे।`
      }
    },
    vault: {
      title: 'पासवर्ड और लॉगिन',
      blurb:
        '“GitHub में लॉगिन करो” कहें और एजेंट आपके लिए साइन इन करेगा। पहली बार साइन-इन पृष्ठ मिलने पर वहीं आपके लॉगिन की जानकारी माँगेगा; उसके बाद यह अपने आप काम करेगा। पासवर्ड इस मशीन पर एन्क्रिप्ट होते हैं और सीधे पृष्ठ में भरे जाते हैं — मॉडल उन्हें कभी नहीं देखता।',
      count: n => `${n} सहेजे गए`,
      loadFailed: 'वॉल्ट की सामग्री लोड नहीं हो सकी',
      empty: 'अभी कुछ सहेजा नहीं गया',
      emptyDesc:
        'यहाँ कुछ जोड़ना ज़रूरी नहीं है। एजेंट से किसी साइट में साइन इन करने को कहें; वह उसी समय एक बार लॉगिन की जानकारी माँगेगा। यदि पहले से दर्ज करना चाहें तो जोड़ें का उपयोग करें।',
      add: 'जोड़ें',
      addTitle: 'लॉगिन, कार्ड या पता जोड़ें',
      addDescription: 'इस मशीन पर एन्क्रिप्ट करके सहेजा जाता है। एजेंट पासवर्ड कभी नहीं देखता।',
      added: 'सहेजा गया।',
      adding: 'सहेजा जा रहा है…',
      addConfirm: 'सहेजें',
      kindField: 'प्रकार',
      kinds: { login: 'लॉगिन', payment: 'भुगतान कार्ड', address: 'पता' },
      labelField: 'नाम',
      labelPlaceholder: 'जैसे GitHub का कार्य खाता',
      labelRequired: 'नाम आवश्यक है।',
      originField: 'साइट का मूल URL',
      originPlaceholder: 'https://github.com',
      originPlaceholderCheckout: 'https://shop.example.com',
      originInvalid: 'https://example.com जैसा मान्य URL दर्ज करें।',
      identifierTypeField: 'पहचान का प्रकार',
      identifierTypes: { email: 'ईमेल', phone: 'फ़ोन', username: 'उपयोगकर्ता नाम' },
      identifierField: 'पहचान',
      identifierShown: identifier => identifier,
      passwordField: 'पासवर्ड',
      loginFieldsRequired: 'पहचान और पासवर्ड आवश्यक हैं।',
      cardNumberField: 'कार्ड नंबर',
      cardNameField: 'कार्ड पर नाम',
      expMonthField: 'समाप्ति माह',
      expYearField: 'समाप्ति वर्ष',
      cvcField: 'CVC',
      postalField: 'डाक कोड',
      addressLine1Field: 'पते की पंक्ति 1',
      addressLine2Field: 'पते की पंक्ति 2',
      cityField: 'शहर',
      stateField: 'राज्य / क्षेत्र',
      countryField: 'देश',
      optional: '(वैकल्पिक)',
      createdOn: date => `${date} को जोड़ा गया`,
      deleteAction: 'सहेजी गई सामग्री हटाएँ',
      otpField: 'ऑथेंटिकेटर कुंजी',
      otpPlaceholder: 'Base32 सीक्रेट या otpauth:// लिंक',
      otpHint: '2FA चालू करते समय साइट जो “सेटअप कुंजी” दिखाती है। इसे सहेजने पर {app_name} स्वयं कोड बनाता है।',
      twoFactorBadge: 'स्वचालित 2FA',
      deleteTitle: 'यह सामग्री मिटाएँ?',
      deleteDescription: label => `"${label}" हटा दिया जाएगा। इसे वापस नहीं लाया जा सकता।`,
      deleteConfirm: 'मिटाएँ',
      sources: {
        title: 'पासवर्ड प्रबंधक',
        blurb:
          'इंस्टॉल किए गए पासवर्ड प्रबंधक अपने आप मिल जाते हैं। एजेंट पहली बार लॉगिन की ज़रूरत होने पर प्रबंधक का लॉक खोलने को कहता है (प्रति सत्र एक बार); केवल सत्र टोकन स्मृति में रहता है और एजेंट आपका मास्टर पासवर्ड या कोई लॉगिन कभी नहीं देखता।',
        toggleFailed: 'पासवर्ड प्रबंधक अपडेट नहीं हो सका',
        notInstalled: name =>
          `नहीं मिला। ${name} का कमांड-लाइन टूल इंस्टॉल करें और उसमें साइन इन करें; {app_name} उसे अपने आप पहचान लेता है।`,
        disabledDesc: 'मिला, लेकिन {app_name} के लिए बंद है।',
        lockedDesc: 'मिला। लॉगिन की ज़रूरत पड़ने पर एजेंट इसका लॉक खोलने को कहेगा, या अभी खोलें।',
        unlockedDesc:
          'इस सत्र के लिए लॉक खुला है। 30 मिनट निष्क्रिय रहने पर या {app_name} बंद होने पर अपने आप लॉक हो जाता है।',
        statusLocked: 'लॉक है',
        statusNotDetected: 'नहीं मिला',
        statusOff: 'बंद',
        statusUnlocked: 'लॉक खुला है',
        unlock: 'लॉक खोलें',
        unlocking: 'लॉक खुल रहा है…',
        lock: 'लॉक करें',
        unlocked: name => `इस सत्र के लिए ${name} का लॉक खुल गया।`,
        unlockTitle: name => `${name} का लॉक खोलें`,
        unlockDescription:
          'अपना मास्टर पासवर्ड दर्ज करें। यह इसी मशीन पर पासवर्ड प्रबंधक को दिया जाता है और फिर हटा दिया जाता है — इसे कभी सहेजा, लॉग किया या एजेंट को दिखाया नहीं जाता।',
        masterPasswordPlaceholder: 'मास्टर पासवर्ड'
      }
    },
    notifications: {
      title: 'सूचनाएँ',
      intro: 'ऑपरेटिंग सिस्टम की सूचनाएँ (ऐप के भीतर की सूचनाएँ नहीं)। प्रति डिवाइस।',
      enableAll: 'सूचनाएँ चालू करें',
      enableAllDesc: 'बंद करने पर नीचे की सभी सूचनाएँ बंद हो जाती हैं।',
      focusedHint: 'कार्य पूरा होने की सूचना तभी आती है जब {app_name} पृष्ठभूमि में हो।',
      kinds: {
        approval: {
          label: 'अनुमति चाहिए',
          description: 'एक कमांड आपकी स्वीकृति या अस्वीकृति की प्रतीक्षा कर रहा है।'
        },
        input: {
          label: 'जानकारी चाहिए',
          description: '{app_name} ने प्रश्न पूछा है या उसे पासवर्ड या सीक्रेट चाहिए।'
        },
        turnDone: {
          label: 'उत्तर तैयार है',
          description: '{app_name} के पृष्ठभूमि में रहते हुए एक चरण पूरा हुआ।'
        },
        turnError: {
          label: 'चरण विफल',
          description: 'पृष्ठभूमि में चल रहे चरण की त्रुटियाँ।'
        },
        backgroundDone: {
          label: 'पृष्ठभूमि का कार्य पूरा हुआ',
          description: 'पृष्ठभूमि में चल रहा टर्मिनल कमांड पूरा हुआ।'
        },
        credits: {
          label: 'क्रेडिट की सूचनाएँ',
          description: 'क्रेडिट का उपयोग रुका है या बहाल हुआ है।'
        },
        plugin: {
          label: 'प्लगइन की सूचनाएँ',
          description: '{app_name} के पृष्ठभूमि में रहते हुए डेस्कटॉप प्लगइन ने सूचना भेजी।'
        }
      },
      browserPermission: {
        title: 'ब्राउज़र की सूचनाएँ',
        allow: 'अनुमति दें',
        states: {
          default:
            'टैब पृष्ठभूमि में होने पर इस ब्राउज़र से सूचनाएँ दिखाएँ। अनुमति देने तक केवल टैब का शीर्षक चमकता है।',
          granted: 'अनुमति दी गई। टैब पृष्ठभूमि में होने पर सूचनाएँ दिखती हैं; टैब का शीर्षक भी चमकता है।',
          denied: 'इस ब्राउज़र की साइट सेटिंग्स में ब्लॉक है। टैब का शीर्षक फिर भी चमकता है।',
          insecure: 'HTTPS चाहिए, जैसे Tailscale serve। साधारण HTTP पर टैब का शीर्षक फिर भी चमकता है।',
          unsupported: 'यह ब्राउज़र सूचनाएँ नहीं दिखा सकता। टैब का शीर्षक फिर भी चमकता है।'
        }
      },
      test: 'परीक्षण सूचना भेजें',
      testTitle: '{app_name}',
      testBody: 'सूचनाएँ काम कर रही हैं।',
      testSent: 'परीक्षण भेजा गया। कुछ न दिखे तो ऑपरेटिंग सिस्टम की सूचना अनुमतियाँ और फ़ोकस/परेशान न करें मोड जाँचें।',
      testUnsupported: 'यह सिस्टम मूल सूचनाओं का समर्थन नहीं करता।',
      muteSoundsTitle: 'इंटरफ़ेस की ध्वनियाँ बंद करें',
      muteSoundsDesc:
        'कार्य पूरा होने, सक्रियण शब्द और सोचने के स्वचालित संकेत, हैप्टिक प्रतिक्रिया और ऑपरेटिंग सिस्टम की सूचना ध्वनियाँ बंद होती हैं। ध्वनि के नमूने और बोले गए उत्तर फिर भी चलते हैं।',
      completionSoundTitle: 'कार्य पूरा होने की ध्वनि',
      completionSoundDesc: 'एजेंट का चरण पूरा होने पर बजती है। प्रीसेट चुनें और यहाँ सुनें।',
      completionSoundPreview: 'पूर्वावलोकन'
    },
    sections: {
      model: 'मॉडल',
      chat: 'चैट',
      appearance: 'रूप-रंग',
      workspace: 'कार्यक्षेत्र',
      safety: 'सुरक्षा',
      memory: 'स्मृति और संदर्भ',
      voice: 'आवाज़',
      advanced: 'उन्नत'
    },
    searchPlaceholder: {
      about: '{app_name} डेस्कटॉप का परिचय',
      config: 'सेटिंग्स खोजें...',
      gateway: 'गेटवे कनेक्शन...',
      keys: 'API कुंजियाँ खोजें...',
      mcp: 'MCP सर्वर खोजें...',
      sessions: 'संग्रहीत सत्र खोजें...'
    },
    modeOptions: {
      light: { label: 'हल्का', description: 'उजली डेस्कटॉप सतहें' },
      dark: { label: 'गहरा', description: 'कम चकाचौंध वाला कार्यक्षेत्र' },
      system: { label: 'सिस्टम', description: 'ऑपरेटिंग सिस्टम के रूप-रंग के अनुसार' }
    },
    appearance: {
      chatTextScaleTitle: 'चैट के पाठ का आकार',
      chatTextScaleDesc:
        'UI के पैमाने के सापेक्ष बातचीत के पाठ और संदेश संपादक का आकार बदलता है। साइडबार और नियंत्रणों का आकार वही रहता है।',
      title: 'रूप-रंग',
      intro: 'केवल डेस्कटॉप के लिए। मोड चमक तय करता है; थीम रंग और चैट की सज्जा तय करती है।',
      colorMode: 'रंग मोड',
      colorModeDesc: 'एक स्थिर मोड चुनें या {app_name} को सिस्टम सेटिंग के अनुसार चलने दें।',
      toolViewTitle: 'टूल कॉल का प्रदर्शन',
      toolViewDesc: 'उत्पाद दृश्य टूल का कच्चा डेटा छिपाता है; तकनीकी दृश्य पूरा इनपुट/आउटपुट दिखाता है।',
      hideCodeDiffsTitle: 'कोड के अंतर छिपाएँ',
      hideCodeDiffsDesc:
        'कोड दिखाए बिना फ़ाइल संपादन को टूल की पंक्तियों में जोड़ी/हटाई गई पंक्तियों की संख्या के साथ दिखाएँ।',
      hideThreadTimelineTitle: 'बातचीत की समयरेखा पट्टियाँ छिपाएँ',
      hideThreadTimelineDesc: 'हर बातचीत के दाएँ किनारे की नेविगेशन पट्टियाँ छिपाएँ।',
      reasoningCollapsedTitle: 'सोच को डिफ़ॉल्ट रूप से समेटें',
      reasoningCollapsedDesc: 'स्ट्रीम होते तर्क को उपलब्ध रखें, लेकिन आपके खोलने तक उसका विस्तार न करें।',
      uiScaleTitle: 'UI का पैमाना',
      uiScaleDesc: (percent: number) =>
        `पूरे ऐप में पाठ और नियंत्रणों का आकार बदलता है। Cmd/Ctrl के साथ +, - और 0 भी काम करते हैं। वर्तमान: ${percent}%।`,
      sessionDensityTitle: 'सत्र सूची का घनत्व',
      sessionDensityDesc: 'चुनें कि साइडबार में सत्र के शीर्षक के नीचे कितना संदर्भ दिखे।',
      sessionDensityCompact: 'सघन',
      sessionDensityComfortable: 'आरामदायक',
      sessionDensityDetailed: 'विस्तृत',
      tabStripTitle: 'टैब पट्टी',
      tabStripDesc:
        'क्षेत्र के ऊपर टैब दिखाएँ। स्वचालित मोड एक ही पैनल होने पर उन्हें छिपाता है, जब तक कोई दूसरा चैट या टाइल क्षेत्र खुला न हो।',
      tabStripAuto: 'स्वचालित',
      tabStripAlways: 'हमेशा',
      tabStripNever: 'कभी नहीं',
      appActionsTitle: 'ऐप की कार्रवाइयाँ',
      appActionsDesc: 'शीर्षक पट्टी में सेटिंग्स, लेआउट और HUD का स्थान। दाएँ रखने पर बाईं ओर टैब के लिए जगह बचती है।',
      appActionsLeft: 'बाएँ',
      appActionsRight: 'दाएँ',
      terminalFontTitle: 'टर्मिनल फ़ॉन्ट',
      terminalFontDesc:
        'डेस्कटॉप टर्मिनल के लिए इंस्टॉल किया हुआ फ़ॉन्ट चुनें। Nerd Fonts, Powerlevel10k और शेल आइकन दिखाते हैं; साथ में शामिल JetBrains Mono के लिए खाली छोड़ें।',
      terminalFontPlaceholder: 'MesloLGS NF या CSS फ़ॉन्ट स्टैक',
      terminalFontPreview: 'अक्षर-चिह्न का पूर्वावलोकन',
      terminalFontReset: 'डिफ़ॉल्ट उपयोग करें',
      chatFontTitle: 'चैट फ़ॉन्ट',
      chatFontDesc:
        'चैट और बाकी ऐप के लिए इंस्टॉल किया हुआ फ़ॉन्ट चुनें। OpenDyslexic जैसे आसानी से पढ़े जाने वाले फ़ॉन्ट के लिए उपयोगी; थीम का फ़ॉन्ट उपयोग करने के लिए खाली छोड़ें।',
      chatFontPlaceholder: 'OpenDyslexic या CSS फ़ॉन्ट स्टैक',
      chatFontPreview: 'पूर्वावलोकन',
      chatFontSample: 'चंचल भूरी लोमड़ी सुस्त कुत्ते के ऊपर से कूदती है। 0123456789',
      chatFontReset: 'थीम का फ़ॉन्ट उपयोग करें',
      translucencyTitle: 'विंडो की पारदर्शिता',
      translucencyDesc: 'पाठ सहित पूरी विंडो से अपना डेस्कटॉप देखें। हल्के और गहरे मोड के लिए अलग-अलग समायोजन।',
      translucencyGlassDesc:
        'धुँधला काँच: डेस्कटॉप हल्के धुँधलेपन के साथ दिखता है और पाठ स्पष्ट रहता है। हल्के और गहरे मोड के लिए अलग-अलग समायोजन।',
      translucencyModeClear: 'साफ़',
      translucencyModeGlass: 'काँच',
      translucencyTintTitle: 'रंगत',
      translucencyFadeTitle: 'फीका पड़ना',
      translucencyFrostTitle: 'धुँधलापन',
      translucencyFrost: {
        'under-window': 'गहन',
        popover: 'मृदु',
        titlebar: 'उजला',
        header: 'चकाचौंध'
      },
      translucencyScopeTitle: 'क्षेत्र',
      translucencyScope: {
        window: 'पूरी विंडो',
        sidebar: 'केवल साइडबार'
      },
      backdropTitle: 'चैट की पृष्ठभूमि',
      backdropDesc: 'बातचीत के पीछे प्रतिमा की हल्की तस्वीर।',
      userBubbleTitle: 'संदेश का बुलबुला',
      userBubbleDesc: 'आपके संदेश कितने पारदर्शी हों। 0 पर पूरी तरह ठोस; 100 पर केवल बाहरी रेखा बचती है।',
      textDirectionTitle: 'पाठ की दिशा',
      textDirectionDesc:
        'चैट संदेश और संदेश संपादक अपनी दिशा कैसे चुनें। स्वचालित मोड हर अनुच्छेद के पहले अक्षर का अनुसरण करता है; मिश्रित पाठ गलत दिशा में लगे तो दिशा चुनें। कोड हमेशा बाएँ से दाएँ रहता है।',
      textDirection: { auto: 'स्वचालित', rtl: 'दाएँ से बाएँ', ltr: 'बाएँ से दाएँ' },
      introSplashTitle: 'शुरुआती दृश्य',
      introSplashDesc: 'खाली चैट पर दिखने वाला नाम-चिह्न और प्रॉम्प्ट।',
      modelPricingTitle: 'मॉडल की कीमतें',
      modelPricingDesc: 'मॉडल चयन में प्रति दस लाख टोकन की इनपुट, आउटपुट और कैश-पठन कीमतें दिखाएँ।',
      reactionsTitle: 'संदेश पर प्रतिक्रियाएँ',
      reactionsDesc:
        'iMessage जैसी इमोजी प्रतिक्रियाएँ — संदेशों पर प्रतिक्रिया दें और {app_name} आपके संदेशों पर प्रतिक्रिया दे सकता है।',
      tipsTitle: 'ऐप के भीतर सुझाव',
      tipsDesc:
        'ऐप और {app_name} से कभी-कभी मिलने वाले संकेत। हर सुझाव एक बार दिखता है। पहले 30 दिनों के बाद अपने आप बंद हो जाता है; आप फिर चालू कर सकते हैं।',
      tipsReset: (count: number) => `${count} ${count === 1 ? 'सुझाव' : 'सुझाव'} फिर दिखाएँ`,
      toursTitle: 'निर्देशित परिचय',
      toursDesc:
        '{app_name} को ऐप का परिचय देते हुए हर चरण उजागर करने दें। पहले 30 दिनों के बाद अपने आप बंद हो जाता है; आप फिर चालू कर सकते हैं।',
      composerPopoutTitle: 'तैरता संदेश संपादक',
      composerPopoutDesc: 'संदेश संपादक को उसके डॉक से बाहर खींचने दें। बंद होने पर यह नीचे डॉक में रहता है।',
      fileBrowserTitle: 'फ़ाइल ब्राउज़र',
      fileBrowserDesc:
        'कार्यक्षेत्र खुला हो तो चैट के पास फ़ाइल ब्राउज़र दिखाएँ। शीर्षक पट्टी का स्विच भी इसे बदलता है।',
      vibeHeartsTitle: 'स्नेह के दिल',
      vibeHeartsDesc: 'thanks, ily, good bot कहने या दिल भेजने पर तैरते दिल। ऊपर दी गई संदेश प्रतिक्रियाओं से अलग।',
      embedsTitle: 'संदेश में एम्बेड',
      embedsDesc:
        'समृद्ध पूर्वावलोकन तीसरे पक्ष की साइटों (YouTube, X, …) से लोड होते हैं। पूछें मोड हर सेवा की अनुमति मिलने तक स्थानधारक दिखाता है; हमेशा उन्हें अपने आप लोड करता है; बंद मोड साधारण लिंक रखता है।',
      embedsAsk: 'पूछें',
      embedsAlways: 'हमेशा',
      embedsOff: 'बंद',
      embedsReset: (count: number) => `${count} अनुमत ${count === 1 ? 'सेवा' : 'सेवाओं'} को रीसेट करें`,
      resumeLastSessionTitle: 'शुरू होने पर पिछली चैट फिर खोलें',
      resumeLastSessionDesc:
        'चालू होने पर ऐप नए सिरे से शुरू होते समय आपकी सबसे हाल की चैट फिर खोलता है। हमेशा नई चैट से शुरू करने के लिए बंद करें।',
      product: 'उत्पाद',
      productDesc: 'संक्षिप्त सारांशों के साथ आसानी से समझ में आने वाली टूल गतिविधि।',
      technical: 'तकनीकी',
      technicalDesc: 'टूल के कच्चे आर्ग्युमेंट/परिणाम और निम्न-स्तरीय विवरण शामिल करें।',
      themeTitle: 'थीम',
      themeDesc: 'केवल डेस्कटॉप के रंग। चुना गया मोड इसके ऊपर लागू होता है।',
      themeSearchPlaceholder: 'अपनी थीम या VS Code Marketplace में खोजें…',
      themeProfileNote: profile => `${profile} प्रोफ़ाइल के लिए सहेजा गया — हर प्रोफ़ाइल की अपनी थीम होती है।`,
      installTitle: 'VS Code से इंस्टॉल करें',
      installDesc:
        'इसकी रंग थीम को डेस्कटॉप के रंगों में बदलने के लिए Marketplace एक्सटेंशन ID (जैसे dracula-theme.theme-dracula) पेस्ट करें।',
      installPlaceholder: 'publisher.extension',
      installButton: 'इंस्टॉल करें',
      installing: 'इंस्टॉल हो रहा है…',
      installError: 'यह थीम इंस्टॉल नहीं हो सकी।',
      installed: name => `“${name}” इंस्टॉल हो गया।`,
      removeTheme: 'थीम हटाएँ',
      importedBadge: 'आयातित',
      pet: {
        title: 'पालतू साथी',
        intro:
          'petdex का एक एनिमेटेड साथी अपनाएँ, जो ऐप के ऊपर तैरता है और {app_name} के काम पर प्रतिक्रिया देता है — टूल चलते समय दौड़ता है, सफलता पर खुश होता है और त्रुटियों पर रूठता है।',
        restartHint:
          'पालतू साथी के लिए एक छोटा पुनः प्रारंभ चाहिए — यह सुविधा जुड़ने से पहले ऐप शुरू हुआ था। {app_name} बंद करके फिर खोलें, फिर यहाँ लौटें।',
        scaleTitle: 'आकार',
        scaleDesc: 'तैरते साथी का आकार बदलें। तुरंत हर जगह लागू होता है।',
        roamTitle: 'घूमना',
        roamDesc: 'निष्क्रिय होने पर साथी को विंडो में अपने आप घूमने दें।',
        chooseTitle: 'पालतू साथी चुनें',
        chooseDesc: 'चुनने पर ज़रूरत हो तो इंस्टॉल होता है और सक्रिय हो जाता है।',
        searchPlaceholder: 'पालतू साथी खोजें…',
        unreachable: 'petdex गैलरी तक नहीं पहुँचा जा सका। कनेक्शन जाँचें और यह पृष्ठ फिर खोलें।',
        noMatch: query => `"${query}" से कोई पालतू साथी मेल नहीं खाता।`,
        installedTag: 'इंस्टॉल है',
        generatedTag: 'बनाया गया',
        countCapped: (cap, total) => `${total} में से ${cap} दिखाए जा रहे हैं — सूची सीमित करने के लिए लिखें।`,
        count: n => `${n} पालतू साथी${n === 1 ? '' : ''}।`,
        uninstall: name => `${name} अनइंस्टॉल करें`,
        delete: name => `${name} मिटाएँ`,
        deleteTitle: name => `${name} मिटाएँ?`,
        deleteBody: 'इससे पालतू साथी स्थायी रूप से मिट जाएगा — इसे फिर इंस्टॉल नहीं किया जा सकता।',
        deleteConfirm: 'मिटाएँ',
        rename: name => `${name} का नाम बदलें`,
        renameTitle: 'पालतू साथी का नाम बदलें',
        renamePlaceholder: 'अपने साथी का नाम रखें',
        renameSave: 'सहेजें',
        exportPet: name => `${name} निर्यात करें`,
        adoptFailed: slug => `${slug} को अपनाया नहीं जा सका`,
        uninstallFailed: slug => `${slug} अनइंस्टॉल नहीं हो सका`,
        renameFailed: slug => `${slug} का नाम नहीं बदला जा सका`,
        exportFailed: slug => `${slug} निर्यात नहीं हो सका`,
        noneAvailable: 'अभी चालू करने के लिए कोई पालतू साथी उपलब्ध नहीं है।',
        turnOnFailed: 'पालतू साथी चालू नहीं हो सका।',
        turnOffFailed: 'पालतू साथी बंद नहीं हो सका।'
      }
    },
    fieldLabels: {
      model: 'डिफ़ॉल्ट मॉडल',
      modelContextLength: 'मुख्य मॉडल की संदर्भ सीमा (ओवरराइड)',
      fallbackProviders: 'वैकल्पिक मॉडल',
      toolsets: 'चालू टूल समूह',
      timezone: 'समय क्षेत्र',
      'display.personality': 'व्यक्तित्व',
      'display.showReasoning': 'तर्क खंड',
      'desktop.repoScanEnabled': 'रिपॉज़िटरी की स्वचालित खोज',
      'desktop.repoScanRoots': 'रिपॉज़िटरी खोज के मूल फ़ोल्डर',
      'desktop.repoScanExcludePaths': 'खोज से बाहर रिपॉज़िटरी पथ',
      'agent.maxTurns': 'एजेंट के अधिकतम चरण',
      'agent.imageInputMode': 'चित्र अटैचमेंट',
      'agent.apiMaxRetries': 'API पुनः प्रयास',
      'agent.serviceTier': 'सेवा स्तर',
      'agent.toolUseEnforcement': 'टूल उपयोग लागू करना',
      'terminal.cwd': 'कार्य निर्देशिका',
      'terminal.backend': 'निष्पादन बैकएंड',
      'terminal.timeout': 'कमांड की समय सीमा',
      'terminal.persistentShell': 'स्थायी शेल',
      'terminal.envPassthrough': 'परिवेश चर आगे भेजना',
      'terminal.dockerImage': 'Docker इमेज',
      'terminal.singularityImage': 'Singularity इमेज',
      'terminal.modalImage': 'Modal इमेज',
      'terminal.daytonaImage': 'Daytona इमेज',
      fileReadMaxChars: 'फ़ाइल पढ़ने की सीमा',
      'toolOutput.maxBytes': 'टर्मिनल आउटपुट की सीमा',
      'toolOutput.maxLines': 'फ़ाइल पृष्ठ की सीमा',
      'toolOutput.maxLineLength': 'पंक्ति लंबाई की सीमा',
      'codeExecution.mode': 'कोड निष्पादन मोड',
      'approvals.mode': 'अनुमति मोड',
      'approvals.timeout': 'अनुमति की समय सीमा',
      'approvals.mcpReloadConfirm': 'MCP पुनः लोड की पुष्टि करें',
      commandAllowlist: 'अनुमत कमांड की सूची',
      'security.redactSecrets': 'सीक्रेट छिपाएँ',
      'security.allowPrivateUrls': 'निजी URL की अनुमति दें',
      'browser.allowPrivateUrls': 'ब्राउज़र में निजी URL',
      'browser.autoLocalForPrivateUrls': 'निजी URL के लिए स्थानीय ब्राउज़र',
      'browser.useRealProfile': 'मेरी वास्तविक ब्राउज़र प्रोफ़ाइल उपयोग करें',
      'checkpoints.enabled': 'फ़ाइल पुनर्स्थापना बिंदु',
      'checkpoints.maxSnapshots': 'पुनर्स्थापना बिंदुओं की सीमा',
      'voice.maxRecordingSeconds': 'अधिकतम रिकॉर्डिंग अवधि',
      'voice.autoTts': 'उत्तर ज़ोर से पढ़ें',
      'voice.voiceChatMode': 'आवाज़ से चैट का मोड',
      'voice.gptLive.voice': 'GPT-Live की आवाज़',
      'voice.gptLive.instructions': 'GPT-Live का व्यक्तित्व',
      'stt.enabled': 'वाणी से पाठ',
      'stt.echoTranscripts': 'प्रतिलेख चैट में भेजें',
      'stt.provider': 'वाणी से पाठ का प्रदाता',
      'stt.streaming': 'लाइव प्रतिलेखन',
      'stt.local.model': 'स्थानीय प्रतिलेखन मॉडल',
      'stt.local.language': 'प्रतिलेखन की भाषा',
      'stt.openai.model': 'OpenAI STT मॉडल',
      'stt.openai.streamingModel': 'OpenAI लाइव प्रतिलेखन मॉडल',
      'stt.groq.model': 'Groq STT मॉडल',
      'stt.mistral.model': 'Mistral STT मॉडल',
      'stt.xai.model': 'xAI STT मॉडल',
      'stt.deepinfra.model': 'DeepInfra STT मॉडल',
      'stt.elevenlabs.modelId': 'ElevenLabs STT मॉडल',
      'stt.elevenlabs.languageCode': 'ElevenLabs की भाषा',
      'stt.elevenlabs.tagAudioEvents': 'ऑडियो घटनाओं के टैग',
      'stt.elevenlabs.diarize': 'वक्ताओं की पहचान',
      'tts.provider': 'पाठ से वाणी का प्रदाता',
      'tts.edge.voice': 'Edge की आवाज़',
      'tts.openai.model': 'OpenAI TTS मॉडल',
      'tts.openai.voice': 'OpenAI की आवाज़',
      'tts.elevenlabs.voiceId': 'ElevenLabs की आवाज़',
      'tts.elevenlabs.modelId': 'ElevenLabs मॉडल',
      'tts.xai.voiceId': 'xAI (Grok) की आवाज़',
      'tts.xai.language': 'xAI की भाषा',
      'tts.xai.speed': 'xAI की प्लेबैक गति',
      'tts.xai.autoSpeechTags': 'xAI के स्वचालित वाणी टैग',
      'tts.xai.optimizeStreamingLatency': 'xAI स्ट्रीमिंग विलंब का अनुकूलन',
      'tts.xai.sampleRate': 'xAI सैंपल दर',
      'tts.xai.bitRate': 'xAI बिट दर',
      'tts.minimax.model': 'MiniMax TTS मॉडल',
      'tts.minimax.voiceId': 'MiniMax की आवाज़',
      'tts.mistral.model': 'Mistral TTS मॉडल',
      'tts.mistral.voiceId': 'Mistral की आवाज़',
      'tts.gemini.model': 'Gemini TTS मॉडल',
      'tts.gemini.voice': 'Gemini की आवाज़',
      'tts.neutts.model': 'NeuTTS मॉडल',
      'tts.neutts.device': 'NeuTTS डिवाइस',
      'tts.kittentts.model': 'KittenTTS मॉडल',
      'tts.kittentts.voice': 'KittenTTS की आवाज़',
      'tts.piper.voice': 'Piper की आवाज़',
      'tts.deepinfra.model': 'DeepInfra TTS मॉडल',
      'tts.deepinfra.voice': 'DeepInfra की आवाज़',
      'memory.memoryEnabled': 'स्थायी स्मृति',
      'memory.userProfileEnabled': 'उपयोगकर्ता प्रोफ़ाइल',
      'memory.memoryCharLimit': 'स्मृति की सीमा',
      'memory.userCharLimit': 'प्रोफ़ाइल की सीमा',
      'memory.provider': 'स्मृति प्रदाता',
      'context.engine': 'संदर्भ इंजन',
      'compression.enabled': 'स्वचालित संपीड़न',
      'compression.threshold': 'संपीड़न की सीमा',
      'compression.codexGpt55Autoraise': 'Codex संपीड़न सीमा अपने आप बढ़ाना',
      'compression.targetRatio': 'संपीड़न लक्ष्य',
      'compression.protectLastN': 'सुरक्षित हाल के संदेश',
      'auxiliary.compression.timeout': 'संपीड़न मॉडल की समय सीमा (सेकंड)',
      'delegation.model': 'उप-एजेंट मॉडल',
      'delegation.provider': 'उप-एजेंट प्रदाता',
      'delegation.maxIterations': 'उप-एजेंट चरणों की सीमा',
      'delegation.maxConcurrentChildren': 'समानांतर उप-एजेंट',
      'delegation.childTimeoutSeconds': 'उप-एजेंट की समय सीमा',
      'delegation.reasoningEffort': 'उप-एजेंट का तर्क प्रयास',
      'updates.nonInteractiveLocalChanges': 'ऐप अपडेट के दौरान स्थानीय बदलाव'
    },
    fieldDescriptions: {
      model: 'नई चैट के लिए उपयोग होता है, जब तक आप संदेश संपादक में कोई दूसरा मॉडल न चुनें।',
      modelContextLength:
        'केवल मुख्य चैट मॉडल की पहचानी गई संदर्भ सीमा को बदलता है (टोकन में)। चुने हुए मॉडल की पहचानी गई सीमा उपयोग करने के लिए 0 रखें। सहायक/MoA मॉडल प्रभावित नहीं होते।',
      fallbackProviders: 'डिफ़ॉल्ट मॉडल विफल होने पर आज़माने के लिए वैकल्पिक provider:model प्रविष्टियाँ।',
      'display.personality': 'नए सत्रों के लिए सहायक की डिफ़ॉल्ट शैली।',
      'display.showReasoning': 'बैकएंड उपलब्ध कराए तो तर्क खंड दिखाएँ।',
      'desktop.repoScanEnabled': 'प्रोजेक्ट में दिखाने के लिए स्थानीय फ़ोल्डर में Git रिपॉज़िटरी खोजें।',
      'desktop.repoScanRoots': 'स्कैन करने वाले फ़ोल्डर। होम निर्देशिका स्कैन करने के लिए खाली छोड़ें।',
      'desktop.repoScanExcludePaths': 'रिपॉज़िटरी खोज के दौरान छोड़ने वाले फ़ोल्डर और उनके उप-फ़ोल्डर।',
      timezone: 'IANA समय क्षेत्र पहचानकर्ता। खाली होने पर सिस्टम का समय क्षेत्र उपयोग होता है।',
      'browser.useRealProfile':
        'स्थानीय ब्राउज़िंग में आपके वास्तविक लॉगिन उपयोग होते हैं। Hermes आपके डिफ़ॉल्ट ब्राउज़र की प्रोफ़ाइल (कुकी, लॉगिन, प्राथमिकताएँ) की एक प्रबंधित प्रति बनाता है और साथ में दिए Chromium से चलाता है — आपकी सक्रिय प्रोफ़ाइल कभी सीधे नहीं खुलती और हर बार चलने पर प्रति उससे ताज़ा होती है। क्लाउड ब्राउज़र बैकएंड सेट होने पर भी एजेंट अनुरोध पर वास्तविक प्रोफ़ाइल का स्थानीय सत्र खोल सकता है। केवल Chromium ब्राउज़र (Chrome, Edge, Brave, Brave Origin, Chromium) समर्थित हैं; दूसरे डिफ़ॉल्ट ब्राउज़र पर स्पष्ट त्रुटि मिलती है। डिफ़ॉल्ट रूप से बंद।',
      'agent.imageInputMode': 'चित्र अटैचमेंट मॉडल को कैसे भेजे जाएँ, यह नियंत्रित करता है।',
      'agent.maxTurns': 'Hermes के कार्य रोकने से पहले टूल कॉल वाले चरणों की अधिकतम संख्या।',
      'terminal.cwd': 'टूल और टर्मिनल के काम के लिए डिफ़ॉल्ट प्रोजेक्ट फ़ोल्डर।',
      'terminal.persistentShell':
        'SSH बैकएंड: कमांड के बीच निर्यात किए गए चर बनाए रखें। बंद होने पर हर कमांड लॉगिन परिवेश से शुरू होता है; कार्य निर्देशिका हमेशा बनी रहती है।',
      'terminal.envPassthrough': 'टूल निष्पादन में भेजने वाले परिवेश चर।',
      'terminal.dockerImage': 'निष्पादन बैकएंड Docker होने पर उपयोग की जाने वाली कंटेनर इमेज।',
      'terminal.singularityImage': 'निष्पादन बैकएंड Singularity होने पर उपयोग की जाने वाली इमेज।',
      'terminal.modalImage': 'निष्पादन बैकएंड Modal होने पर उपयोग की जाने वाली इमेज।',
      'terminal.daytonaImage': 'निष्पादन बैकएंड Daytona होने पर उपयोग की जाने वाली इमेज।',
      'codeExecution.mode': 'कोड निष्पादन को वर्तमान प्रोजेक्ट तक कितनी सख्ती से सीमित रखा जाए।',
      fileReadMaxChars: 'एक फ़ाइल अनुरोध में Hermes अधिकतम कितने अक्षर पढ़ सकता है।',
      'approvals.mode': 'स्पष्ट अनुमति माँगने वाले कमांड को Hermes कैसे संभाले।',
      'approvals.timeout': 'अनुमति के अनुरोध समय समाप्त होने से पहले कितनी देर प्रतीक्षा करें।',
      'security.redactSecrets': 'जहाँ संभव हो, मॉडल को दिखाई देने वाली सामग्री से पहचाने गए सीक्रेट छिपाएँ।',
      'checkpoints.enabled': 'फ़ाइल संपादन से पहले वापस लौटने के लिए स्नैपशॉट बनाएँ।',
      'memory.memoryEnabled': 'भविष्य के सत्रों में मदद करने वाली स्थायी स्मृतियाँ सहेजें।',
      'memory.userProfileEnabled': 'उपयोगकर्ता की प्राथमिकताओं की संक्षिप्त प्रोफ़ाइल बनाए रखें।',
      'context.engine': 'संदर्भ सीमा के पास लंबी बातचीत प्रबंधित करने की रणनीति।',
      'compression.enabled': 'बातचीत बड़ी होने पर पुराने संदर्भ का सारांश बनाएँ।',
      'compression.codexGpt55Autoraise': 'समर्थित ChatGPT Codex OAuth मॉडल के लिए संपीड़न सीमा 85% तक बढ़ाएँ।',
      'auxiliary.compression.timeout':
        'सहायक संपीड़न मॉडल की हर कॉल की प्रतीक्षा के सेकंड (डिफ़ॉल्ट 120)। धीमे स्थानीय मॉडल के लिए बढ़ाएँ।',
      'voice.autoTts': 'सहायक के उत्तर अपने आप बोलें।',
      'voice.voiceChatMode':
        'chained: नीचे के प्रदाताओं से वाणी से पाठ → Hermes → पाठ से वाणी। gpt-live: एक पूर्ण-द्विदिश OpenAI आवाज़ मॉडल (gpt-live-1) सुनता और बोलता है, और हर वास्तविक अनुरोध Hermes को देता है — आपका चुना हुआ कोई भी मॉडल पूरे टूल समूह के साथ उत्तर देता है। OpenAI API कुंजी चाहिए; आवाज़ स्तर की लागत $0.05 प्रति मिनट है।',
      'voice.gptLive.voice': 'GPT-Live मोड की आवाज़। कस्टम आवाज़ ID स्वीकार हैं।',
      'voice.gptLive.instructions':
        'लाइव आवाज़ के व्यक्तित्व के लिए अतिरिक्त वाक्य (लहजा, गति, भाषा)। Hermes अपना सिस्टम प्रॉम्प्ट बनाए रखता है।',
      'tts.xai.voiceId': 'xAI आवाज़ ID (जैसे eve) या कस्टम आवाज़ ID।',
      'tts.xai.language': 'बोली जाने वाली भाषा का कोड (जैसे en, pt-BR) या स्वतः पहचान के लिए "auto"।',
      'tts.xai.speed': 'प्लेबैक गति। 0.7 = धीमी, 1.0 = सामान्य, 1.5 = तेज़।',
      'tts.xai.autoSpeechTags': 'संश्लेषण से पहले LLM को पाठ में भावपूर्ण ऑडियो टैग ([laughing], [sighs]) जोड़ने दें।',
      'tts.xai.optimizeStreamingLatency': 'विलंब और गुणवत्ता के बीच संतुलन। 0 = सर्वोत्तम गुणवत्ता, 2 = सबसे कम विलंब।',
      'tts.xai.sampleRate': 'ऑडियो सैंपल दर Hz में। अधिक दर = बेहतर गुणवत्ता, बड़ी फ़ाइलें।',
      'tts.xai.bitRate': 'MP3 बिट दर bps में। केवल mp3 कोडेक पर लागू।',
      'tts.neutts.device': 'NeuTTS के लिए स्थानीय इंफ़रेंस डिवाइस।',
      'stt.enabled': 'स्थानीय या प्रदाता-आधारित वाणी प्रतिलेखन चालू करें।',
      'stt.echoTranscripts': 'आवाज़ संदेशों का मूल 🎙️ प्रतिलेख वापस चैट में भेजें।',
      'stt.streaming': 'बोलते समय पाठ दिखाएँ (OpenAI, xAI, ElevenLabs)। किसी भी विफलता पर रिकॉर्डिंग का उपयोग होता है।',
      'stt.elevenlabs.languageCode': 'वैकल्पिक ISO-639-3 भाषा कोड। खाली होने पर ElevenLabs अपने आप पहचानता है।',
      'updates.nonInteractiveLocalChanges':
        'जब Hermes ऐप से खुद को अपडेट करता है (टर्मिनल में प्रश्न पूछे बिना), स्थानीय स्रोत संपादन रखें (stash) या मिटाएँ (discard)। टर्मिनल अपडेट हमेशा पूछते हैं।'
    },
    uninstallSection: {
      dangerZone: 'जोखिम क्षेत्र',
      checkingInstalled: 'इंस्टॉल सामग्री जाँची जा रही है…',
      uninstallHermes: '{app_name} अनइंस्टॉल करें',
      managedBody: 'यह इंस्टॉल आपके सिस्टम द्वारा प्रबंधित है, इसलिए {app_name} स्वयं को हटा नहीं सकता।',
      dataKept: path => `आपका कॉन्फ़िगरेशन, चैट और सीक्रेट ${path} में हैं। ऐप हटाने से वे नहीं मिटते।`,
      openAppsSettings: 'ऐप की सेटिंग्स खोलें',
      chooseHowMuch:
        'चुनें कि कितना हटाना है। काम पूरा करने के लिए ऐप बंद होगा; वापस आने के लिए इंस्टॉलर कभी भी फिर खोलें।',
      confirmUninstall: 'अनइंस्टॉल की पुष्टि करें',
      confirmBody: what => `इससे ${what} हट जाएगा। इसे वापस नहीं लाया जा सकता।`,
      appLabel: 'ऐप:',
      couldNotStart: 'अनइंस्टॉल शुरू नहीं हो सका।',
      uninstalling: 'अनइंस्टॉल हो रहा है…',
      yesUninstall: 'हाँ, अनइंस्टॉल करें',
      options: {
        gui: {
          title: 'केवल चैट GUI अनइंस्टॉल करें',
          description: 'यह डेस्कटॉप ऐप हटाएँ। {app_name} एजेंट, आपका कॉन्फ़िगरेशन और चैट बने रहेंगे।',
          consequence: 'डेस्कटॉप चैट GUI (यह ऐप और इसका डेटा)'
        },
        lite: {
          title: 'GUI और एजेंट अनइंस्टॉल करें, मेरा डेटा रखें',
          description:
            'ऐप और {app_name} एजेंट हटाएँ, लेकिन भविष्य में फिर इंस्टॉल करने के लिए कॉन्फ़िगरेशन, चैट और सीक्रेट रखें।',
          consequence: 'चैट GUI और {app_name} एजेंट (कॉन्फ़िगरेशन, चैट और सीक्रेट रखे जाएँगे)'
        },
        full: {
          title: 'सब कुछ अनइंस्टॉल करें',
          description: 'ऐप, एजेंट और सभी उपयोगकर्ता डेटा हटाएँ — कॉन्फ़िगरेशन, चैट, निर्धारित कार्य, सीक्रेट और लॉग।',
          consequence: 'सब कुछ — चैट GUI, {app_name} एजेंट और आपका पूरा कॉन्फ़िगरेशन, चैट, सीक्रेट और लॉग'
        }
      }
    },
    memoryLayers: {
      activeProvider: 'सक्रिय स्मृति प्रदाता',
      selectedProvider: 'चुना गया स्मृति प्रदाता',
      selectedDesc: current => `अभी सक्रिय नहीं: यह चुनाव सहेजने तक सत्र ${current} का उपयोग करते रहेंगे।`,
      builtinMemory: 'केवल अंतर्निहित स्मृति',
      noProvider: 'कोई नहीं — केवल अंतर्निहित स्मृति',
      noProviderDesc:
        '{app_name} केवल नीचे के अंतर्निहित स्तर का उपयोग करता है। बाहरी प्रदाता जोड़ने के लिए सेटिंग्स › स्मृति और संदर्भ में चुनें।',
      providerDesc: name => `${name} हर सत्र में अंतर्निहित स्तर के साथ अपनी याद करने की क्षमता जोड़ता है।`,
      providerNotReadyDesc: name =>
        `${name} सहेजा गया प्रदाता है, लेकिन तैयार होने तक याद करने की क्षमता नहीं जोड़ता। अंतर्निहित स्तर दोनों स्थितियों में काम करता है।`,
      providerUnknownDesc: name => `${name} सहेजा गया प्रदाता है; {app_name} उसकी तैयारी की स्थिति पढ़ नहीं सका।`,
      statusUnavailable: 'स्मृति की स्थिति उपलब्ध नहीं',
      statusUnavailableDesc: 'कौन सा स्मृति प्रदाता सक्रिय या तैयार है, यह पढ़ा नहीं जा सका।',
      retry: 'फिर कोशिश करें',
      status: {
        ready: 'तैयार',
        needs_config: 'सेटअप चाहिए',
        unavailable: 'उपलब्ध नहीं',
        missing: 'इंस्टॉल नहीं है'
      },
      builtinLayer: 'अंतर्निहित स्तर',
      onByDefault: 'डिफ़ॉल्ट रूप से चालू',
      on: 'चालू',
      off: 'बंद',
      onlyFile: file => `केवल ${file}`,
      builtinDesc:
        'MEMORY.md और USER.md, {app_name} की अपनी स्मृति हैं, किसी बाहरी प्रदाता से अलग। दोनों डिफ़ॉल्ट रूप से सत्रों में लोड होते हैं; सेटिंग्स › स्मृति और संदर्भ में स्मृति और उपयोगकर्ता प्रोफ़ाइल के स्विच इन्हें अलग-अलग बंद करते हैं। प्रदाता इस स्तर में क्षमता जोड़ता है; इसे कभी बदलता नहीं।'
    },
    customEndpoints: {
      active: 'सक्रिय',
      apiKeySet: 'API कुंजी निर्धारित है',
      use: 'उपयोग करें',
      editTitle: 'एंडपॉइंट संपादित करें',
      addTitle: 'एंडपॉइंट जोड़ें',
      fields: {
        name: 'नाम',
        providerId: 'प्रदाता ID',
        endpointUrl: 'एंडपॉइंट URL',
        defaultModel: 'डिफ़ॉल्ट मॉडल',
        context: 'संदर्भ',
        apiKey: 'API कुंजी',
        apiKeyNewPlaceholder: 'वर्तमान कुंजी रखने के लिए खाली छोड़ें',
        apiKeyPlaceholder: 'वैकल्पिक',
        useNewChats: 'नई चैट के लिए उपयोग करें',
        discoverModels: 'मॉडल खोजें'
      },
      test: 'जाँचें',
      save: 'सहेजें',
      newEndpoint: 'नया एंडपॉइंट',
      apiMode: 'API मोड',
      autoDetect: 'स्वतः पहचान',
      couldNotLoad: 'कस्टम एंडपॉइंट लोड नहीं हो सके',
      endpointSaved: 'कस्टम एंडपॉइंट सहेजा गया।',
      saveFailed: 'सहेजना विफल',
      endpointReachable: 'एंडपॉइंट तक पहुँचा जा सकता है।',
      endpointReachableTransport: transport => `एंडपॉइंट तक पहुँचा जा सकता है (${transport} रूट उपलब्ध है)।`,
      endpointReachableModels: (reachable, count) => `${reachable} ${count} मॉडल मिले।`,
      endpointValidationFailed: 'एंडपॉइंट का सत्यापन विफल।',
      validationFailed: 'सत्यापन विफल',
      activationFailed: 'सक्रिय करना विफल',
      deleteConfirm: name => `${name} मिटाएँ?`,
      deleteFailed: 'मिटाना विफल',
      title: 'कस्टम एंडपॉइंट',
      deleteEndpoint: 'एंडपॉइंट मिटाएँ',
      emptyDescription: 'नीचे OpenAI-संगत एंडपॉइंट जोड़ें।',
      emptyTitle: 'कोई कस्टम एंडपॉइंट नहीं',
      namePlaceholder: 'Axet Proxy',
      contextPlaceholder: 'स्वचालित'
    },
    computerUse: {
      accessibility: 'अभिगम्यता',
      screenRecording: 'स्क्रीन रिकॉर्डिंग',
      driverHealth: 'ड्राइवर की स्थिति'
    },
    about: {
      updates: 'अपडेट',
      channel: {
        title: 'अपडेट चैनल',
        description:
          'स्थिर मोड केवल प्रकाशित रिलीज़ इंस्टॉल करता है। हर कमिट मोड बदलाव आते ही main ब्रांच का अनुसरण करता है।',
        stable: 'स्थिर रिलीज़',
        main: 'हर कमिट',
        stableConfirmTitle: 'स्थिर रिलीज़ पर जाएँ?',
        stableConfirmBody:
          '{app_name} नवीनतम प्रकाशित रिलीज़ पर जाएगा, जो अभी चल रहे कोड से पुरानी हो सकती है। नए कोड से लिखा डेटा सही न पढ़ा जाए, इसलिए पहले बैकअप लें।',
        stableConfirm: 'स्थिर रिलीज़ पर जाएँ',
        failed: 'अपडेट चैनल नहीं बदला जा सका',
        detailsLabel: 'चैनल',
        branch: (b: string) => `ब्रांच: ${b}`,
        change: 'बदलें',
        latestRelease: (v: string) => `आप नवीनतम स्थिर रिलीज़ (${v}) पर हैं।`,
        rollbackTitle: (v: string) => `स्थिर रिलीज़ ${v} पर वापस जाएँ`,
        rollbackBody: (v: string) =>
          `यह बिल्ड स्थिर रिलीज़ ${v} से नया है। उसे इंस्टॉल करने से {app_name} उस रिलीज़ पर वापस जाएगा।`,
        heldBody: (v: string) =>
          `यह बिल्ड स्थिर रिलीज़ ${v} से नया है। आपके सत्र पहले से ऐसे गेटवे रनटाइम का उपयोग कर रहे हैं जिसे ${v} खोल नहीं सकता, इसलिए नई स्थिर रिलीज़ आने तक {app_name} इसी बिल्ड पर रहेगा।`,
        rollbackAction: (v: string) => `${v} पर वापस लौटें`,
        allChanges: 'सभी बदलाव देखें'
      }
    },
    config: {
      minimizeToTrayTitle: 'ट्रे में छोटा करें',
      minimizeToTrayDesc:
        'विंडो छोटी करें या मुख्य विंडो बंद करें ताकि वे सिस्टम ट्रे (macOS पर मेनू बार) में छिपें और {app_name} चलता रहे। बाहर निकलने के लिए ट्रे मेनू में {app_name} बंद करें या Cmd+Q उपयोग करें। डिफ़ॉल्ट रूप से बंद; केवल इस डिवाइस पर लागू।',
      minimizeToTrayUnavailable:
        'सिस्टम ट्रे उपलब्ध नहीं है। विंडो सामान्य रूप से छोटी और बंद होंगी। फिर कोशिश करने के लिए इसे बंद करके चालू करें।',
      none: 'कोई नहीं',
      noneParen: '(कोई नहीं)',
      builtinOnly: 'केवल अंतर्निहित',
      notSet: 'निर्धारित नहीं',
      commaSeparated: 'अल्पविराम से अलग किए गए मान',
      searchPlaceholder: 'खोजें…',
      noResults: 'कोई परिणाम नहीं मिला',
      systemDefault: 'सिस्टम डिफ़ॉल्ट',
      loading: '{app_name} का कॉन्फ़िगरेशन लोड हो रहा है...',
      emptyTitle: 'कॉन्फ़िगर करने के लिए कुछ नहीं',
      emptyDesc: 'इस खंड में बदलने योग्य सेटिंग्स नहीं हैं।',
      failedLoad: 'सेटिंग्स लोड नहीं हो सकीं',
      autosaveFailed: 'स्वचालित सहेजना विफल',
      imported: 'कॉन्फ़िगरेशन आयात हुआ',
      invalidJson: 'अमान्य कॉन्फ़िगरेशन JSON',
      toolsetsWipeConfirm:
        'सभी चालू टूल समूह हटाएँ? इससे स्मृति, टर्मिनल, वेब खोज, कार्य सौंपना और अधिकांश अन्य टूल दोबारा चालू करने तक बंद हो जाते हैं।',
      keepAwakeTitle: 'कंप्यूटर को जागृत रखें',
      keepAwakeDesc:
        'इस मशीन को स्लीप में जाने से रोकें। “काम करते समय” केवल सक्रिय चरण के दौरान जागृत रखता है, ताकि रात भर के काम चलते रहें और लैपटॉप पूरा सप्ताह जागा न रहे। स्क्रीन की चमक फिर भी कम हो सकती है।',
      keepAwakeOff: 'बंद',
      keepAwakeWhileWorking: 'काम करते समय',
      keepAwakeAlways: 'हमेशा',
      disableF12Title: 'F12 DevTools बंद करें',
      disableF12Desc: 'F12 से डेवलपर टूल खुलना रोकें। Ctrl+Shift+I (या Mac पर Cmd+Opt+I) फिर भी काम करता है।',
      alwaysExternalLinksTitle: 'लिंक हमेशा बाहरी ब्राउज़र में खोलें',
      alwaysExternalLinksDesc:
        'क्लिक किए गए हर लिंक को ऐप के ब्राउज़र की बजाय सिस्टम ब्राउज़र में खोलें। दाएँ क्लिक के मेनू में “ऐप के ब्राउज़र में खोलें” फिर भी काम करता है।',
      attachmentSizeTitle: 'पूर्वावलोकन / चित्र लोड का अधिकतम आकार',
      attachmentSizeDesc:
        'पूर्वावलोकन और चित्र जोड़ने के लिए डेस्कटॉप अधिकतम कितनी बड़ी स्थानीय फ़ाइल लोड करे, MB में। डिफ़ॉल्ट 16 है। दूरस्थ गैर-चित्र अटैचमेंट की अलग सीमा 256 MB है। बहुत अधिक सीमा पूरी फ़ाइल स्मृति में लोड करती है और ऐप अटक या क्रैश हो सकता है।',
      attachmentSizeUnit: 'MB',
      attachmentSizeLabel: 'मेगाबाइट में पूर्वावलोकन / चित्र लोड का अधिकतम आकार',
      voiceShortcutHintTitle: 'आवाज़ रिकॉर्डिंग का शॉर्टकट',
      voiceShortcutHintDesc:
        'आवाज़ रिकॉर्डिंग का शॉर्टकट सेटिंग्स → कीबोर्ड शॉर्टकट (“आवाज़ से बातचीत शुरू / बंद करें”) में निर्धारित करें। voice.record_key कॉन्फ़िगरेशन केवल CLI पर लागू होता है।',
      desktopReadAloudTitle: 'इस ऐप में उत्तर ज़ोर से पढ़ें',
      desktopReadAloudDesc:
        'डेस्कटॉप में हर पूरा उत्तर बोलें। संदेश संपादक बटन वाला ही स्विच है; सभी खुली विंडो पर लागू होता है और बंद करने पर उत्तर बीच वाक्य में रुक जाता है। नीचे “उत्तर ज़ोर से पढ़ें” संदेश सेवाओं और CLI के लिए है।',
      showOptions: 'विकल्प दिखाएँ'
    },
    hudModifier: {
      title: 'HUD बुलाने के लिए दबाएँ',
      description:
        'किसी भी ऐप से HUD सामने लाने के लिए Mac पर ⌘ + Option, या Windows/Linux पर Ctrl + Alt दबाकर छोड़ें। डिफ़ॉल्ट रूप से बंद; केवल इस डिवाइस पर लागू।',
      permission:
        'सिस्टम सेटिंग्स → गोपनीयता और सुरक्षा → इनपुट निगरानी में {app_name} को अनुमति दें, फिर कोशिश करें। यह इशारा कुंजियाँ रिकॉर्ड या स्क्रीन कैप्चर नहीं करता।',
      unavailable:
        'HUD इशारा सहायक शुरू नहीं हो सका या अचानक बंद हो गया। फिर कोशिश करें या {app_name} फिर शुरू करें। मौजूदा HUD शॉर्टकट {app_name} के भीतर अभी भी काम करता है।',
      missingHelper:
        'इस {app_name} इंस्टॉल में HUD इशारा सहायक नहीं है। {app_name} अपडेट या फिर इंस्टॉल करें, फिर कोशिश करें।',
      unsupportedSession:
        'यह डेस्कटॉप सत्र वैश्विक मॉडिफ़ायर कुंजी इशारों का समर्थन नहीं करता। Linux पर X11 चाहिए; Wayland समर्थित नहीं है।'
    },
    screenshot: {
      enabledTitle: 'स्क्रीनशॉट शॉर्टकट',
      enabledDesc:
        'किसी भी ऐप से दोनों Command कुंजियाँ साथ दबाएँ ताकि सामने की विंडो कैप्चर होकर आपके वर्तमान {app_name} ड्राफ़्ट में जुड़े। कभी अपने आप नहीं भेजता। डिफ़ॉल्ट रूप से बंद; केवल इस Mac पर लागू। विंडो की सामग्री संवेदनशील हो सकती है — भेजने से पहले अटैचमेंट देखें।',
      statusTitle: 'स्क्रीनशॉट शॉर्टकट की स्थिति',
      checking: 'स्क्रीनशॉट शॉर्टकट जाँचा जा रहा है…',
      disabled: 'स्क्रीनशॉट शॉर्टकट बंद है।',
      starting: 'शॉर्टकट लिसनर शुरू हो रहा है। अभी तैयार नहीं है।',
      ready: 'शॉर्टकट तैयार है। स्क्रीनशॉट भेजे बिना वर्तमान ड्राफ़्ट में जुड़ते हैं।',
      inputPermission:
        'इनपुट निगरानी की अनुमति से {app_name} दूसरे ऐप के सक्रिय होने पर दोनों Command कुंजियाँ पहचान सकता है। सिस्टम सेटिंग्स → गोपनीयता और सुरक्षा → इनपुट निगरानी में {app_name} को अनुमति दें, फिर यहाँ आकर फिर कोशिश करें।',
      screenPermission:
        'स्क्रीन रिकॉर्डिंग की अनुमति से {app_name} इस शॉर्टकट पर सामने वाले ऐप की विंडो कैप्चर कर सकता है। सिस्टम सेटिंग्स → गोपनीयता और सुरक्षा → स्क्रीन रिकॉर्डिंग में {app_name} को अनुमति दें, फिर यहाँ आकर फिर कोशिश करें। macOS कहे तो {app_name} फिर शुरू करें।',
      openSettings: 'सिस्टम सेटिंग्स खोलें',
      retry: 'फिर कोशिश करें',
      unavailable: 'स्क्रीनशॉट शॉर्टकट उपलब्ध नहीं है। फिर कोशिश करें या बंद करें।',
      errorTitle: 'स्क्रीनशॉट शॉर्टकट की त्रुटि',
      loadFailed: 'शॉर्टकट की स्थिति पढ़ी नहीं जा सकी। वर्तमान सेटिंग जाँचने के लिए फिर कोशिश करें।',
      saveFailed: 'शॉर्टकट में बदलाव की पुष्टि नहीं हो सकी। वर्तमान सेटिंग जाँचने के लिए फिर कोशिश करें।',
      permissionFailed: 'सिस्टम सेटिंग्स खुल नहीं सकीं। गोपनीयता और सुरक्षा स्वयं खोलें, फिर कोशिश करें।',
      captureFailed: 'सामने की विंडो कैप्चर नहीं हो सकी। कुछ जोड़ा या भेजा नहीं गया।',
      contextChanged: 'कैप्चर के दौरान वर्तमान ड्राफ़्ट बदल गया। स्क्रीनशॉट जोड़ा या भेजा नहीं गया।'
    },
    quickEntry: {
      enabledTitle: 'त्वरित लेखन',
      enabledDesc: 'वैश्विक शॉर्टकट से कहीं से भी छोटा संदेश संपादक बुलाएँ और {app_name} खोले बिना प्रॉम्प्ट भेजें।',
      shortcutTitle: 'त्वरित लेखन का शॉर्टकट',
      shortcutDesc: 'कम से कम एक मॉडिफ़ायर चाहिए, जैसे CommandOrControl+Shift+Space।',
      active: 'शॉर्टकट सक्रिय है।',
      takenBy: 'कोई दूसरा ऐप यह शॉर्टकट उपयोग करता है — दूसरा चुनें।',
      invalidShortcut: 'मान्य शॉर्टकट नहीं है। कम से कम एक मॉडिफ़ायर कुंजी शामिल करें।'
    },
    credentials: {
      pasteKey: 'कुंजी पेस्ट करें',
      pasteLabelKey: label => `${label} कुंजी पेस्ट करें`,
      optional: 'वैकल्पिक',
      enterValueFirst: 'पहले मान दर्ज करें।',
      couldNotSave: 'क्रेडेंशियल सहेजा नहीं जा सका।',
      remove: 'हटाएँ',
      getKey: 'कुंजी प्राप्त करें',
      saving: 'सहेजा जा रहा है'
    },
    envActions: {
      actions: 'कार्रवाइयाँ',
      manageInKeys: 'API कुंजियों में प्रबंधित करें',
      docs: 'दस्तावेज़',
      hideValue: 'मान छिपाएँ',
      revealValue: 'मान दिखाएँ',
      replace: 'बदलें',
      set: 'निर्धारित करें',
      clear: 'साफ़'
    },
    // v2 multi-connection registry: Settings → Gateways.
    connections: {
      title: 'पंजीकृत गेटवे',
      intro: 'इस डिवाइस और दूरस्थ, SSH या Cloud कनेक्शन से पहुँच सकने वाले हर {app_name} गेटवे को प्रबंधित करें।',
      stagedNote:
        'हर गेटवे जुड़ा रहता है। प्रोफ़ाइल, चैट, संदेश और cron कार्य अपने गेटवे के साथ रहते हैं; सत्र उन्हें एक साथ दिखा सकते हैं।',
      launchModeTitle: 'शुरुआत में पिछले उपयोग किए गए गेटवे के सत्रों पर लौटें',
      launchModeDesc: 'बंद होने पर सत्र प्राथमिक गेटवे पर खुलते हैं।',
      searchPlaceholder: 'गेटवे खोजें…',
      noSearchResults: 'खोज से कोई गेटवे मेल नहीं खाता।',
      loadFailed: 'कनेक्शन लोड नहीं हो सके',
      currentPill: 'वर्तमान',
      primaryPill: 'प्राथमिक',
      managedPill: 'ऐप द्वारा प्रबंधित',
      addConnection: 'कनेक्शन जोड़ें',
      editConnection: 'संपादित करें',
      removeConnection: 'हटाएँ',
      removeConfirmTitle: 'यह कनेक्शन हटाएँ?',
      removeConfirmDesc: (label: string) =>
        `“${label}” इस ऐप से हट जाएगा। इंस्टेंस नहीं बदलेगा — आप उसे कभी भी फिर जोड़ सकते हैं।`,
      makePrimary: 'प्राथमिक बनाएँ',
      testConnection: 'जाँचें',
      testOk: 'पहुँच योग्य',
      testFailed: 'कनेक्शन परीक्षण विफल',
      saveFailed: 'कनेक्शन सहेजा नहीं जा सका',
      removeFailed: 'कनेक्शन हटाया नहीं जा सका',
      updateAll: 'सभी इंस्टेंस अपडेट करें',
      updateAllRunning: 'सभी इंस्टेंस अपडेट हो रहे हैं…',
      updateAllDone: 'अपडेट भेजे गए',
      updateAllFailed: 'सभी जगह अपडेट भेजना विफल',
      updateSkippedCloud: 'Hermes Cloud द्वारा प्रबंधित',
      kindLocal: 'स्थानीय',
      kindRemote: 'दूरस्थ गेटवे',
      kindCloud: 'Hermes Cloud',
      kindSsh: 'SSH',
      kindLocalDesc: 'इस ऐप द्वारा प्रबंधित {app_name} रनटाइम।',
      kindRemoteDesc: 'HTTP(S) से पहुँच योग्य {app_name} गेटवे — LAN, Tailscale या इंटरनेट पर।',
      kindCloudDesc: 'आपके Hermes Cloud खाते से मिला होस्ट किया हुआ इंस्टेंस।',
      kindSshDesc: 'SSH से पहुँचने वाला {app_name} इंस्टॉल।',
      labelTitle: 'नाम',
      labelDesc: 'आवश्यक। यह इंस्टेंस जहाँ भी दिखे, यह नाम दिखेगा; अलग होना चाहिए (जैसे “घर की लैब”, “काम का लैपटॉप”)।',
      labelPlaceholder: 'घर की लैब',
      urlTitle: 'गेटवे URL',
      sshHostTitle: 'SSH होस्ट',
      headersTitle: 'अतिरिक्त गेटवे हेडर',
      headersDesc:
        'इस गेटवे की हर HTTP और WebSocket अनुरोध के साथ भेजे जाते हैं — Cloudflare Access (CF-Access-Client-Id / CF-Access-Client-Secret) जैसे एक्सेस प्रॉक्सी के लिए। मान एन्क्रिप्ट करके सहेजे जाते हैं। {app_name} द्वारा प्रबंधित हेडर (Authorization, Cookie, Host…) अनदेखे किए जाते हैं।',
      headerValuePlaceholder: 'मान',
      headerValueSaved: 'सहेजा गया — बनाए रखने के लिए खाली छोड़ें',
      headerAdd: 'हेडर जोड़ें',
      headerRemove: 'हटाएँ',
      duplicateLocal: 'यह ऐप पहले से एक स्थानीय कनेक्शन प्रबंधित करता है — केवल एक हो सकता है।',
      duplicateUrl: (label: string) => `इस गेटवे URL का कनेक्शन पहले से है (“${label}”)।`,
      duplicateSsh: (label: string) => `इस SSH होस्ट का कनेक्शन पहले से है (“${label}”)।`,
      sameBackendHint: (label: string) => `“${label}” वाला ही बैकएंड`,
      localAddHint: 'स्थानीय विकल्प उपलब्ध नहीं: प्रबंधित स्थानीय कनेक्शन पहले से है (हमेशा केवल एक होता है)।',
      cloudAddHint:
        'सुझाव: ऊपर Hermes Cloud में साइन इन करने से एजेंट अपने आप मिलते हैं — इस फ़ॉर्म का उपयोग केवल ज्ञात इंस्टेंस URL को स्वयं पंजीकृत करने के लिए करें।',
      save: 'कनेक्शन सहेजें',
      saving: 'सहेजा जा रहा है…',
      cancel: 'रद्द करें',
      empty: 'अभी कोई कनेक्शन पंजीकृत नहीं है।'
    },
    managedUpdates: {
      title: 'प्रबंधित अपडेट',
      intro:
        'डेस्कटॉप द्वारा प्रबंधित SSH इंस्टॉल को एक समन्वित प्रक्रिया में अपडेट करें: सत्रों के काम पूरे होते हैं, दूरस्थ चेकआउट अपडेट होता है और हर प्रोफ़ाइल संबंधित रसीद के साथ बहाल होती है।',
      sshConnection: 'डेस्कटॉप द्वारा प्रबंधित SSH इंस्टॉल',
      update: 'अपडेट करें',
      updating: 'अपडेट हो रहा है…',
      progress: 'सत्रों का काम पूरा हो रहा है, दूरस्थ इंस्टॉल अपडेट हो रहा है और प्रोफ़ाइल बहाल हो रही हैं…',
      updated: 'अपडेट हुआ',
      partial: 'अपडेट हुआ — बहाली विफल',
      refused: 'अस्वीकार किया गया',
      failed: 'अपडेट विफल',
      alreadyRunning: 'अपडेट पहले से जारी है',
      receipt: (id: string, outcome: string) => `रसीद ${id} · ${outcome}`,
      receiptVersions: (pre: string, post: string) => `${pre} → ${post}`,
      scopesRestored: (profiles: string) => `बहाल प्रोफ़ाइल: ${profiles}`,
      scopeNotRestored: (profile: string, error: string) => `प्रोफ़ाइल “${profile}” बहाल नहीं हुई: ${error}`
    },
    gateway: {
      loading: 'गेटवे सेटिंग्स लोड हो रही हैं...',

      unavailableTitle: 'गेटवे सेटिंग्स उपलब्ध नहीं',
      unavailableDesc: 'कनेक्शन सेटिंग्स केवल उसे चला रहे कंप्यूटर के {app_name} डेस्कटॉप ऐप से बदली जा सकती हैं।',
      webappHostTitle: '{app_name} होस्ट',
      webappHostDesc:
        'वेब ऐप हमेशा उसे उपलब्ध कराने वाले {app_name} होस्ट पर चलता है। नीचे के सहेजे गए कनेक्शन इसी मशीन की सूची हैं, जो {app_name} डेस्कटॉप ऐप के साथ साझा है; दूसरे गेटवे इसी होस्ट के माध्यम से पहुँचते हैं।',
      webappOauthPaste: {
        title: 'साइन इन पूरा करें',
        description:
          'यदि साइन-इन टैब ऐसे पते पर रुका जो लोड नहीं हुआ (यह ब्राउज़र गेटवे की मशीन पर नहीं है), तो वह पता यहाँ पेस्ट करें।',
        placeholder: 'http://127.0.0.1:…/webapp/gateway-connections/oauth/callback?…',
        finish: 'पूरा करें',
        failed: 'साइन इन पूरा नहीं हो सका'
      },
      webAccess: {
        title: 'वेब पहुँच',
        intro:
          'अपने Nous खाते से साइन इन करके फ़ोन या दूसरे कंप्यूटर से इस कंप्यूटर का {app_name} खोलें। साइन इन करने वाला कोई भी व्यक्ति इस कंप्यूटर पर कमांड चला सकता है।',
        failed: 'वेब पहुँच नहीं बदली जा सकी',
        running: 'चल रहा है',
        stopped: 'बंद है',
        starting: 'शुरू हो रहा है',
        stopping: 'बंद हो रहा है',
        restartNeeded: 'फिर शुरू करना ज़रूरी है',
        unavailable: 'उपलब्ध नहीं',
        notRunningDetail: 'दूसरे डिवाइस से {app_name} खोलने के लिए इसे शुरू करें।',
        needsNous: 'पहले प्रदाता खंड में अपने Nous खाते में साइन इन करें।',
        runningLan: 'इसी नेटवर्क के किसी डिवाइस पर यह पता खोलें।',
        runningPublic: 'आपके URL से उपलब्ध है।',
        runningLocal: 'केवल यह कंप्यूटर इसे खोल सकता है। दूसरे डिवाइस से खोलने के लिए रोककर फिर शुरू करें।',
        pendingOn: 'सहेजा गया। गेटवे फिर शुरू होने पर वेब ऐप उपलब्ध कराएगा।',
        pendingOff: 'बंद किया गया, लेकिन फिर शुरू होने तक गेटवे वेब ऐप उपलब्ध कराता रहेगा।',
        unavailableDetail: reason => `गेटवे वेब ऐप उपलब्ध नहीं करा सका: ${reason}`,
        restartBusy:
          'सहेजा गया। चैट चल रही है, इसलिए गेटवे फिर शुरू नहीं हुआ। चैट समाप्त होने पर गेटवे फिर शुरू करें चुनें।',
        restartFailed: 'सहेजा गया, लेकिन गेटवे फिर शुरू नहीं हो सका। फिर कोशिश करने के लिए गेटवे फिर शुरू करें चुनें।',
        restartFailedBecause: reason => `गेटवे फिर शुरू नहीं हो सका: ${reason}`,
        startTimedOut: 'गेटवे ने 90 सेकंड के भीतर वेब ऐप उपलब्ध नहीं कराया।',
        stopTimedOut: 'गेटवे ने 90 सेकंड के भीतर वेब ऐप उपलब्ध कराना बंद नहीं किया।',
        startStages: {
          preparing: 'वेब ऐप तैयार हो रहा है। बिल्ड बनाने में कुछ मिनट लग सकते हैं।',
          building: 'वेब ऐप का बिल्ड बन रहा है। कुछ मिनट लग सकते हैं।',
          registering: 'इस पते के लिए Nous साइन-इन सेट किया जा रहा है।',
          restarting: 'वेब ऐप उपलब्ध कराने के लिए गेटवे फिर शुरू हो रहा है।'
        },
        startElapsed: time => `${time} बीत चुका है`,
        start: 'शुरू करें',
        stop: 'रोकें',
        restartGateway: 'गेटवे फिर शुरू करें',
        modeLan: 'यह नेटवर्क',
        modeLanDetail: url => `आपके Wi-Fi के डिवाइस ${url} खोल सकते हैं। केवल विश्वसनीय नेटवर्क पर उपयोग करें।`,
        lanUnencrypted:
          'कनेक्शन एन्क्रिप्ट नहीं है: इस नेटवर्क के अन्य लोग आपका भेजा और प्राप्त किया डेटा पढ़ सकते हैं।',
        noLan: 'इस कंप्यूटर का कोई नेटवर्क पता दूसरे डिवाइस से पहुँच योग्य नहीं है।',
        modePublic: 'मेरा अपना URL',
        modePublicDetail: port =>
          `आपका पहले से चल रहा HTTPS पता, जैसे Tailscale Serve या टनल, जो http://127.0.0.1:${port} पर भेजता हो।`
      },
      title: 'गेटवे कनेक्शन',
      envOverride: 'परिवेश का ओवरराइड',
      intro:
        'डिफ़ॉल्ट रूप से स्थानीय। जब यह ऐप कहीं और के {app_name} बैकएंड को चलाए तो दूरस्थ चुनें। गेटवे कनेक्शन मशीन-स्तर के हैं; प्रोफ़ाइल जुड़े हुए गेटवे से मिलती हैं।',
      envOverrideTitle: '{app_name} शुरू करने के तरीके से यह कनेक्शन तय हुआ था।',
      envOverrideDesc:
        'ऐप के बाहर की शुरुआती सेटिंग ने यह कनेक्शन चुना, इसलिए नीचे के विकल्प केवल पढ़ने योग्य हैं। यहाँ बदलने के लिए उस सेटिंग के बिना {app_name} फिर शुरू करें — या सेटअप करने वाले व्यक्ति से पूछें।',
      modeTitle: 'कनेक्शन मोड',
      localTitle: 'स्थानीय गेटवे',
      localDesc: 'localhost पर निजी {app_name} बैकएंड शुरू करें। यह डिफ़ॉल्ट है और ऑफ़लाइन काम करता है।',
      remoteTitle: 'दूरस्थ गेटवे',
      remoteDesc: 'इस डेस्कटॉप इंटरफ़ेस को दूरस्थ {app_name} बैकएंड से जोड़ें।',
      remoteAuthHint:
        'होस्ट किए गए गेटवे OAuth या उपयोगकर्ता नाम और पासवर्ड उपयोग करते हैं; स्वयं होस्ट किए गए गेटवे सत्र टोकन उपयोग कर सकते हैं।',
      cloudTitle: 'Hermes Cloud',
      cloudDesc: 'Hermes Cloud में एक बार साइन इन करें और अपने खाते के एजेंट में से चुनें — URL पेस्ट नहीं करना पड़ता।',
      cloudSignInTitle: 'Hermes Cloud',
      cloudSignIn: 'Hermes Cloud में साइन इन करें',
      cloudSignedIn: 'Hermes Cloud में साइन इन है',
      cloudNeedsSignIn: 'अपने खाते के एजेंट खोजने के लिए Hermes Cloud में साइन इन करें।',
      cloudSignedInDesc: 'आप साइन इन हैं। नीचे एजेंट चुनें; सत्र अपने आप ताज़ा होता है।',
      cloudAgentsTitle: 'आपके एजेंट',
      cloudOrgPickerTitle: 'संगठन चुनें',
      cloudOrgSelect: 'चुनें',
      cloudOrgChange: 'संगठन बदलें',
      cloudOrgRole: role => `भूमिका: ${role}`,
      cloudLoadingAgents: 'आपके एजेंट लोड हो रहे हैं…',
      cloudNoAgents: {
        before: 'इस खाते पर कोई एजेंट नहीं मिला। नया बनाने के लिए खोलें: ',
        linkText: 'Nous पोर्टल',
        after: ', फिर रीफ़्रेश करें।'
      },
      cloudRefresh: 'रीफ़्रेश करें',
      cloudConnect: 'जोड़ें',
      cloudSavedTitle: 'सहेजे गए Cloud गेटवे',
      cloudSavedDesc:
        'अपना डिफ़ॉल्ट बदले बिना सहेजा गया गेटवे उपयोग करें। इंस्टेंस जोड़ने के लिए नीचे साइन इन करें। सहेजे गए कनेक्शन की सूची में नाम और साइन-इन प्रबंधित करें।',
      cloudUseSaved: 'गेटवे उपयोग करें',
      cloudActive: 'इस विंडो में सक्रिय',
      cloudConnecting: 'जुड़ रहा है…',
      cloudDiscoverFailed: 'आपके Hermes Cloud एजेंट लोड नहीं हो सके',
      cloudConnectFailed: 'उस एजेंट से जुड़ नहीं सके',
      cloudSignInFailed: 'Hermes Cloud साइन-इन विफल',
      cloudSignedOutTitle: 'Hermes Cloud से साइन आउट हुआ',
      cloudSignedOutMessage: 'Hermes Cloud सत्र साफ़ किया गया।',
      cloudConnectedTitle: 'जुड़ा हुआ',
      cloudConnectedPill: 'जुड़ा हुआ',
      cloudConnectedTo: name => `${name} से जुड़ गया।`,
      cloudAgentProvisioning: 'प्रावधान हो रहा है…',
      cloudStatusLabel: status => `स्थिति: ${status}`,
      remoteUrlTitle: 'दूरस्थ URL',
      remoteUrlDesc: 'दूरस्थ डैशबोर्ड बैकएंड का मूल URL। पथ उपसर्ग समर्थित हैं, जैसे /hermes।',
      probing: 'गेटवे के प्रमाणीकरण का तरीका जाँचा जा रहा है…',
      probeError:
        '{app_name} उस पते तक नहीं पहुँच सकता। URL जाँचें और सुनिश्चित करें कि दूसरे कंप्यूटर पर {app_name} चल रहा है — जवाब मिलने पर साइन-इन विकल्प दिखेंगे।',
      signedIn: 'साइन इन है',
      signIn: 'साइन इन करें',
      signOut: 'साइन आउट करें',
      signInWith: provider => `${provider} से साइन इन करें`,
      authTitle: 'प्रमाणीकरण',
      authSignedInPassword:
        'यह गेटवे उपयोगकर्ता नाम और पासवर्ड उपयोग करता है। आप साइन इन हैं; सत्र अपने आप ताज़ा होता है।',
      authSignedInOauth: 'यह गेटवे OAuth उपयोग करता है। आप साइन इन हैं; सत्र अपने आप ताज़ा होता है।',
      authNeedsPassword:
        'यह गेटवे उपयोगकर्ता नाम और पासवर्ड उपयोग करता है। इस डेस्कटॉप ऐप को अधिकृत करने के लिए साइन इन करें।',
      authNeedsOauth: provider =>
        `यह गेटवे OAuth उपयोग करता है। इस डेस्कटॉप ऐप को अधिकृत करने के लिए ${provider} से साइन इन करें।`,
      tokenTitle: 'सत्र टोकन',
      tokenDesc: 'REST और WebSocket पहुँच के लिए डैशबोर्ड सत्र टोकन। सहेजा गया टोकन रखने के लिए खाली छोड़ें।',
      existingToken: value => `मौजूदा टोकन ${value}`,
      savedToken: 'सहेजा गया',
      pasteSessionToken: 'सत्र टोकन पेस्ट करें',
      plainTextConfirmTitle: 'गेटवे टोकन साधारण पाठ में सहेजें?',
      plainTextConfirmDesc:
        'इस मशीन पर ऑपरेटिंग सिस्टम की कीरिंग सेवा नहीं मिली, इसलिए टोकन ऐप की कनेक्शन सेटिंग्स फ़ाइल में बिना एन्क्रिप्शन सहेजा जाएगा और इस उपयोगकर्ता के रूप में चलने वाली कोई भी प्रक्रिया उसे पढ़ सकती है। एन्क्रिप्ट करके सहेजने के लिए सिस्टम कीचेन (Linux पर GNOME Keyring या KWallet) इंस्टॉल या चालू करें।',
      plainTextConfirmAction: 'साधारण पाठ में सहेजें',
      plainTextStoredTitle: 'टोकन साधारण पाठ में सहेजा गया',
      plainTextStoredDesc:
        'सुरक्षित भंडारण उपलब्ध नहीं है, इसलिए टोकन इस मशीन की ऐप कनेक्शन सेटिंग्स फ़ाइल में बिना एन्क्रिप्शन है। एन्क्रिप्ट करने के लिए सिस्टम कीचेन (Linux पर GNOME Keyring या KWallet) इंस्टॉल या चालू करें।',
      keychainEncryptionTitle: 'सहेजे गए सीक्रेट ऑपरेटिंग सिस्टम की कीचेन से एन्क्रिप्ट करें',
      keychainEncryptionDesc:
        'डिफ़ॉल्ट रूप से बंद। चालू होने पर गेटवे टोकन और साइन-इन क्रेडेंशियल सिस्टम कीचेन (Keychain Access, GNOME Keyring या Windows DPAPI) से एन्क्रिप्ट होते हैं — सिस्टम अनुमति या पासवर्ड माँग सकता है। बंद होने पर साधारण फ़ाइलों में सहेजे जाते हैं जिन्हें केवल आपका उपयोगकर्ता खाता पढ़ सकता है।',
      keychainEncryptionFailed: 'सीक्रेट का एन्क्रिप्शन नहीं बदला जा सका',
      testRemote: 'दूरस्थ कनेक्शन जाँचें',
      saveForRestart: 'अगली शुरुआत के लिए सहेजें',
      saveAndReconnect: 'सहेजें और फिर जोड़ें',
      diagnostics: 'निदान',
      diagnosticsDesc: 'फ़ाइल प्रबंधक में desktop.log दिखाएँ — गेटवे शुरू न होने पर उपयोगी।',
      openLogs: 'लॉग खोलें',
      incompleteTitle: 'दूरस्थ गेटवे अधूरा है',
      incompleteSignIn: 'दूरस्थ मोड में जाने से पहले दूरस्थ URL दर्ज करें और साइन इन करें।',
      incompleteToken: 'दूरस्थ मोड में जाने से पहले दूरस्थ URL और सत्र टोकन दर्ज करें।',
      incompleteSignInTest: 'जाँचने से पहले दूरस्थ URL दर्ज करें और साइन इन करें।',
      incompleteTokenTest: 'जाँचने से पहले दूरस्थ URL और सत्र टोकन दर्ज करें।',
      enterUrlFirst: 'पहले दूरस्थ URL दर्ज करें।',
      restartingTitle: 'गेटवे कनेक्शन फिर शुरू हो रहा है',
      savedTitle: 'गेटवे सेटिंग्स सहेजी गईं',
      restartingMessage: '{app_name} डेस्कटॉप सहेजी गई सेटिंग्स से फिर जुड़ेगा — इंटरफ़ेस खुला रहेगा।',
      savedMessage: 'अगली शुरुआत के लिए सहेजा गया।',
      connectedTo: (baseUrl, version) => `${baseUrl} से जुड़ा${version ? ` · {app_name} ${version}` : ''}`,
      reachableTitle: 'दूरस्थ गेटवे तक पहुँचा जा सकता है',
      signedOutTitle: 'साइन आउट हुआ',
      signedOutMessage: 'दूरस्थ गेटवे सत्र साफ़ किया गया।',
      failedLoad: 'गेटवे सेटिंग्स लोड नहीं हो सकीं',
      signInFailed: 'साइन-इन विफल',
      signOutFailed: 'साइन-आउट विफल',
      testFailed: 'दूरस्थ गेटवे परीक्षण विफल',
      applyFailed: 'गेटवे सेटिंग्स लागू नहीं हो सकीं',
      saveFailed: 'गेटवे सेटिंग्स सहेजी नहीं जा सकीं',
      sshTitle: 'SSH से जोड़ें',
      sshDesc:
        '{app_name} दूरस्थ मशीन पर SSH से शुरू होकर टनल के माध्यम से इस ऐप से जुड़ता है — आपको कुछ शुरू या सार्वजनिक नहीं करना पड़ता। होस्ट तक काम करने वाली कुंजी-आधारित SSH पहुँच आवश्यक है।',
      sshTrustHint: 'पहली मिली होस्ट कुंजी विश्वसनीय मानकर पिन होती है; बाद में बदलने पर कनेक्शन रोक दिया जाता है।',
      sshHostTitle: 'होस्ट',
      sshHostDesc: 'user@host या ~/.ssh/config का Host उपनाम।',
      sshHostPick: 'होस्ट चुनें…',
      sshHostPickTitle: 'होस्ट',
      sshHostPickDesc: '~/.ssh/config का Host उपनाम, या स्वयं लिखने के लिए कस्टम चुनें।',
      sshHostCustom: 'कस्टम (स्वयं दर्ज करें)…',
      sshUserTitle: 'उपयोगकर्ता',
      sshUserDesc: 'खाली = ~/.ssh/config या आपका वर्तमान उपयोगकर्ता।',
      sshUserPlaceholder: '~/.ssh/config से',
      sshPortTitle: 'पोर्ट',
      sshPortDesc: 'खाली = 22 या ~/.ssh/config का पोर्ट।',
      sshKeyTitle: 'पहचान फ़ाइल',
      sshKeyDesc: 'निजी कुंजी का पथ। खाली = ssh-agent या ~/.ssh/config।',
      sshHermesPathTitle: '{app_name} का पथ (वैकल्पिक)',
      sshHermesPathDesc: 'दूरस्थ hermes बाइनरी का पूरा पथ। खाली = स्वतः पहचान।',
      sshHermesPathPlaceholder: 'स्वतः पहचान',
      sshTestConnection: 'SSH जाँचें',
      sshConnect: 'जोड़ें',
      sshButtonsHint: 'सहेजना अगली शुरुआत पर लागू होता है। जोड़ें अभी फिर जोड़ता है।',
      sshReachable: (host, platform) => `पहुँच योग्य: ${host} (${platform}) — {app_name} मिला`,
      sshIncompleteHost: 'जोड़ने से पहले SSH होस्ट दर्ज करें।',
      sshErrUnreachable: 'SSH से उस होस्ट तक नहीं पहुँचा जा सका। होस्ट, पोर्ट और नेटवर्क जाँचें।',
      sshErrAuth:
        'SSH प्रमाणीकरण विफल। कुंजी ssh-agent में लोड करें (ssh-add) या ~/.ssh/config में IdentityFile सेट करें — {app_name} ssh बिना संवाद के चलाता है।',
      sshErrHostKey:
        'पिछले कनेक्शन के बाद होस्ट कुंजी बदल गई है। सुनिश्चित करें कि यह अपेक्षित है, फिर ssh-keygen -R <host> चलाएँ और फिर जोड़ें।',
      sshErrNotInstalled:
        'दूरस्थ होस्ट पर {app_name} इंस्टॉल नहीं है। वहाँ इंस्टॉल करें (curl -fsSL https://raw.githubusercontent.com/Garudex-Labs/NoOne/main/scripts/install.sh | sh) या {app_name} का पथ सेट करें।',
      sshErrPlatform:
        'दूरस्थ प्लेटफ़ॉर्म समर्थित नहीं। {app_name} डेस्कटॉप SSH मोड Linux, macOS और Windows दूरस्थ होस्ट का समर्थन करता है।',
      sshErrTimeout: 'SSH कनेक्शन की समय सीमा समाप्त। होस्ट पहुँच से बाहर या स्लीप में हो सकता है।',
      sshErrUpdateRequired: 'डेस्कटॉप SSH से जोड़ने से पहले दूरस्थ होस्ट पर {app_name} अपडेट करें।',
      sshErrInteractiveAuth:
        'Tailscale SSH के लिए ब्राउज़र में संवादात्मक जाँच चाहिए। टर्मिनल में `ssh <host> true` चलाएँ, जाँच पूरी करें, फिर कोशिश करें — {app_name} SSH बिना संवाद के चलाता है।',
      sshErrUnknown: 'SSH कनेक्शन विफल।'
    },
    keys: {
      loading: 'API कुंजियाँ और क्रेडेंशियल लोड हो रहे हैं...',
      failedLoad: 'API कुंजियाँ लोड नहीं हो सकीं',
      empty: 'इस श्रेणी में अभी कुछ कॉन्फ़िगर नहीं है।'
    },
    search: {
      placeholder: 'सभी सेटिंग्स खोजें…',
      pill: 'खोजें'
    },
    profileScope: {
      appliesTo: 'लागू होता है',
      editsProfile: profile => `इस पृष्ठ के बदलाव “${profile}” प्रोफ़ाइल पर लागू होते हैं।`
    },
    mcp: {
      loading: 'MCP सर्वर लोड हो रहे हैं...',
      invalidJson: 'अमान्य MCP JSON',
      saveFailed: 'सहेजना विफल',
      removeFailed: 'हटाना विफल',
      reloadFailed: 'MCP पुनः लोड विफल',
      savedTitle: 'MCP सर्वर सहेजा गया',
      savedMessage: name => `${name} MCP पुनः लोड होने के बाद लागू होगा।`,
      disabled: 'बंद है',
      name: 'नाम',
      serverJson: 'सर्वर JSON',
      remove: 'हटाएँ',
      test: 'कनेक्शन जाँचें',
      catalogLoading: 'MCP सूची लोड हो रही है...',
      catalogInstallFailed: name => `${name} इंस्टॉल नहीं हो सका`,
      catalogEnvRequired: 'इंस्टॉल करने से पहले आवश्यक मान भरें।',
      capabilitySummary: (tools, prompts, resources) =>
        `${[`${tools} टूल`, ...(prompts ? [`${prompts} प्रॉम्प्ट`] : []), ...(resources ? [`${resources} संसाधन`] : [])].join(', ')} चालू हैं`,
      costTokens: tokens => `~${tokens} टोकन/कॉल`,
      usage30d: uses => `${uses} उपयोग/30 दिन`,
      statusConnecting: 'जुड़ रहा है…',
      statusNeedsAuth: 'प्रमाणीकरण चाहिए',
      statusError: 'त्रुटि',
      statusOff: 'बंद',
      allServers: 'सभी सर्वर',
      authenticatedTitle: 'प्रमाणित',
      authenticatedMessage: (server, count) => `${server}: ${count} टूल`,
      authenticate: 'प्रमाणित करें',
      noOutput: 'अभी कोई आउटपुट नहीं।',
      deepLinkTitle: 'MCP सर्वर जोड़ें?',
      deepLinkDescription:
        'एक लिंक ने यह MCP सर्वर {app_name} में जोड़ने का अनुरोध किया है। नीचे का सटीक कॉन्फ़िगरेशन देखें — यह लिंक से आया है, {app_name} से नहीं।',
      deepLinkStdioWarning:
        'यह सर्वर नीचे के कमांड से आपकी मशीन पर स्थानीय प्रक्रिया चलाता है। केवल स्रोत विश्वसनीय होने पर आगे बढ़ें।',
      deepLinkConfirm: 'सर्वर जोड़ें',
      deepLinkNameInvalid: 'नामों में 1-64 अक्षर, अंक, बिंदु, डैश या अंडरस्कोर हो सकते हैं।',
      deepLinkNameConflict: name => `${name} नाम का सर्वर पहले से है — दूसरा नाम चुनें या रद्द करें।`,
      deepLinkErrorTitle: 'MCP इंस्टॉल लिंक अस्वीकार हुआ',
      deepLinkErrorName: 'लिंक में सर्वर का नाम नहीं है या अमान्य है।',
      deepLinkErrorConfig: 'लिंक का कॉन्फ़िगरेशन मान्य base64-एन्कोडेड JSON नहीं है।',
      deepLinkErrorShape: 'कॉन्फ़िगरेशन JSON ऑब्जेक्ट होना चाहिए जिसमें पाठ वाला `url` या `command` फ़ील्ड हो।',
      deepLinkErrorUrl: 'केवल http:// और https:// सर्वर URL की अनुमति है।',
      deepLinkErrorTooLarge: 'कॉन्फ़िगरेशन डेटा 32KB की सीमा से अधिक है।'
    },
    model: hiSettingsModels.model,
    localModels: hiSettingsModels.localModels,
    billing: {
      perMonth: amount => `${amount}/माह`,
      creditsPerMonth: amount => `${amount} क्रेडिट/माह`,
      usageLabel: label => `${label} का उपयोग`,
      freeTier: {
        signIn: 'साइन इन करें',
        title: 'आप Nous के मुफ़्त स्तर पर हैं',
        message: 'और मॉडल और टूल खोलने के लिए Nous खाते से साइन इन करें।',
        caption:
          'कनेक्टर सहित nous/welcome पर चलता है। साइन इन करने पर कनेक्टर बने रहते हैं और खाते की ज़रूरत वाले टूल तथा बाकी सभी मॉडल जुड़ते हैं।',
        name: 'Nous · मुफ़्त स्तर',
        footnote:
          'मुफ़्त स्तर पर न कोई शेष राशि है, न भुगतान। Nous खाते से साइन इन करने पर भुगतान और उपयोग दिखाई देते हैं।',
        plan: 'मुफ़्त स्तर',
        model: 'मॉडल',
        connectors: 'कनेक्टर',
        included: 'शामिल'
      },
      amountValidation: {
        reloadTo: 'भरने की लक्ष्य राशि',
        greaterThanThreshold: 'भरने की लक्ष्य राशि सीमा से अधिक होनी चाहिए।',
        decimal: label => `${label}: डॉलर की राशि अधिकतम 2 दशमलव स्थानों में दर्ज करें।`,
        positive: label => `${label}: राशि $0 से अधिक होनी चाहिए।`,
        minimum: (label, amount) => `${label}: न्यूनतम ${amount} है।`,
        maximum: (label, amount) => `${label}: अधिकतम ${amount} है।`
      },
      stepUp: {
        openVerification: 'सत्यापन पृष्ठ खोलें',
        dismiss: 'खारिज करें',
        waiting: 'सत्यापन लिंक की प्रतीक्षा है…',
        verify: 'जारी रखने के लिए सत्यापित करें',
        deniedTitle: 'सत्यापन स्वीकृत नहीं हुआ',
        deniedBody: 'इस टर्मिनल को दूरस्थ खर्च की अनुमति दिए बिना सत्यापन पूरा हुआ।',
        successTitle: 'सत्यापन पूरा हुआ',
        successBody: 'इस टर्मिनल को दूरस्थ खर्च की अनुमति है।'
      },
      charge: {
        added: amount => (amount ? `$${amount} जोड़े गए।` : 'क्रेडिट जोड़े गए।'),
        failedTitle: 'भुगतान विफल',
        unconfirmedTitle: 'भुगतान परिणाम की पुष्टि नहीं',
        unconfirmedBody: message =>
          `${message} पिछले भुगतान के परिणाम की पुष्टि नहीं हुई है - फिर कोशिश करने से पहले शेष राशि/इतिहास जाँचें।`,
        checkTitle: 'भुगतान जाँचा नहीं जा सका',
        checkBody: 'भुगतान जाँचा नहीं जा सका।',
        untrackedTitle: 'भुगतान की स्थिति पता नहीं चल सकी',
        untrackedBody: 'बिलिंग सेवा ने अनुरोध स्वीकार किया, लेकिन भुगतान ID नहीं लौटाई।',
        timeoutTitle: '5 मिनट बाद भी प्रक्रिया जारी है',
        timeoutBody: 'भुगतान अभी भी पूरा हो सकता है। फिर कोशिश करने से पहले पोर्टल जाँचें।',
        authenticationRequired: 'आपके बैंक को सत्यापन (3DS) चाहिए। खरीद पूरी करने के लिए पोर्टल पर पूरा करें।',
        expired: 'आपके कार्ड की अवधि समाप्त है। पोर्टल पर अपडेट करें।',
        declined: 'आपका कार्ड अस्वीकार हुआ। पोर्टल पर दूसरा कार्ड आज़माएँ।',
        failedBody: reason => `भुगतान पूरा नहीं हुआ (${reason})।`
      },
      title: 'बिलिंग',
      preview: 'पूर्वावलोकन',
      summary: {
        balance: 'शेष राशि',
        plan: 'योजना',
        autoRefill: 'स्वचालित पुनर्भरण'
      },
      sections: {
        invoices: 'चालान',

        plan: 'योजना',
        paymentAndCredits: 'भुगतान और क्रेडिट',
        usage: 'उपयोग'
      },
      usage: {
        title: 'उपयोग'
      },
      buyCredits: {
        customAmount: 'क्रेडिट की कस्टम राशि',
        title: 'अभी क्रेडिट खरीदें',
        buyButton: 'खरीदें',
        processing: 'प्रक्रिया जारी है… भुगतान निपटान जाँचा जा रहा है',
        added: amount => `${amount} जोड़े गए। शेष राशि ताज़ा हो रही है।`,
        retry: 'फिर कोशिश करें',
        openPortal: 'पोर्टल खोलें'
      },
      plan: {
        title: 'योजनाएँ',
        changePlan: 'योजना बदलें',
        viewPlans: 'योजनाएँ देखें',
        backAria: 'बिलिंग पर वापस',
        current: 'वर्तमान योजना',
        scheduled: 'निर्धारित',
        empty: 'अभी बदलने के लिए कोई योजना उपलब्ध नहीं है।',
        undo: 'पूर्ववत करें',
        undoing: 'पूर्ववत हो रहा है…',
        downgrade: 'निचली योजना पर जाएँ',
        confirmDowngrade: 'निचली योजना की पुष्टि करें',
        tryAgain: 'फिर कोशिश करें',
        checkingChange: 'यह बदलाव जाँचा जा रहा है…',
        cannotChange: 'यह बदलाव यहाँ नहीं किया जा सकता।',
        alreadyOn: name => `आप पहले से ${name} पर हैं — बदलने के लिए कुछ नहीं।`,
        notScheduleable: 'यह बदलाव यहाँ निर्धारित नहीं किया जा सकता।',
        scheduling: 'निर्धारित हो रहा है…',
        cancel: 'रद्द करें',
        effectScheduled: (targetName, effectiveAt, creditsDelta) =>
          `${targetName} पर बदलाव — ${effectiveAt} से लागू। अभी कोई भुगतान नहीं; तब तक वर्तमान योजना बनी रहेगी।${creditsDelta ? ` मासिक क्रेडिट में बदलाव: ${creditsDelta}।` : ''}`
      },
      keepGoingOnCredits: {
        title: 'क्रेडिट से काम जारी रखें',
        description:
          'शामिल उपयोग समाप्त होने पर अपने क्रेडिट उपयोग करें। बंद होने पर {app_name} रीसेट की प्रतीक्षा करता है।',
        approveInBrowser: 'बदलने के लिए ब्राउज़र में दूरस्थ खर्च की अनुमति दें। अनुमति देते ही लागू होता है।',
        openAgain: 'फिर खोलें',
        cancel: 'रद्द करें',
        approvedRetry: 'दूरस्थ खर्च स्वीकृत है, लेकिन बदलाव सहेजा नहीं गया।',
        tryAgain: 'फिर कोशिश करें'
      },
      autoReload: {
        threshold: 'सीमा',
        thresholdAria: 'स्वचालित पुनर्भरण की सीमा',
        reloadTo: 'यहाँ तक भरें',
        reloadToAria: 'स्वचालित पुनर्भरण की लक्ष्य राशि',
        turnOffConfirm: 'स्वचालित पुनर्भरण बंद करें?',
        turnOff: 'बंद करें',
        disable: 'अक्षम करें',
        updated: 'स्वचालित पुनर्भरण अपडेट हुआ।',
        turnedOff: 'स्वचालित पुनर्भरण बंद हुआ।',
        manage: 'प्रबंधित करें',
        save: 'सहेजें',
        saving: 'सहेजा जा रहा है…',
        cancel: 'रद्द करें'
      },
      state: {
        notice: {
          loggedOut: {
            title: 'अपना Nous खाता जोड़ें',
            message: 'यहाँ शेष राशि, योजना और उपयोग देखने के लिए Nous खाते से साइन इन करें।',
            action: 'साइन इन करें'
          },
          openPortal: 'पोर्टल खोलें ↗',
          noCard: {
            title: 'कोई भुगतान विधि सहेजी नहीं है',
            message:
              'कार्ड सहेजे जाने तक अतिरिक्त क्रेडिट खरीदना और स्वचालित पुनर्भरण बंद रहते हैं। पोर्टल पर कार्ड जोड़ें।',
            action: 'कार्ड जोड़ें ↗'
          }
        },
        paymentMethod: {
          title: 'भुगतान विधि',
          description: 'अतिरिक्त क्रेडिट और सदस्यता नवीनीकरण के लिए उपयोग होने वाला कार्ड प्रबंधित करें।',
          addAction: 'भुगतान विधि जोड़ें',
          updateAction: 'अपडेट करें',
          provenance: {
            autoRefill: 'स्वचालित पुनर्भरण का कार्ड',
            customerDefault: 'ग्राहक का डिफ़ॉल्ट',
            subPin: 'सदस्यता का कार्ड',
            suffix: label => ` - ${label}`
          }
        },
        buyCredits: {
          description: 'आज आपके कार्ड से एक भुगतान, जो शेष राशि में जुड़ता है।'
        },
        autoRefill: {
          title: 'कम होने पर भरें',
          genericDescription: 'शेष राशि सीमा से कम होने पर उसे फिर भरकर रखें।',
          offPill: 'बंद',
          enabledPill: 'चालू',
          notAvailablePill: '—',
          manageCaption: 'पोर्टल से स्वचालित पुनर्भरण प्रबंधित करें।',
          turnOnCaption: 'पोर्टल से स्वचालित पुनर्भरण चालू करें',
          chargesDescription: (reloadTo, threshold) =>
            `शेष राशि ${threshold} से कम होने पर अपने आप ${reloadTo} का भुगतान करता है।`,
          distinctCardCaption: cardLabel => `स्वचालित पुनर्भरण ${cardLabel} से भुगतान करता है — पोर्टल पर मिलान करें`,
          distinctCardFallback: 'दूसरा कार्ड',
          reconcileAction: 'मिलान करें ↗'
        },
        usage: {
          subscriptionCredits: {
            title: 'सदस्यता क्रेडिट',
            barLabel: 'बचे हुए सदस्यता क्रेडिट',
            captionResets: date => `${date} को रीसेट होता है`,
            valueOf: (remaining, monthly) => `${monthly} में से ${remaining} बचे हैं`,
            valueOver: (remaining, monthly, over) => `${monthly} में से ${remaining} बचे हैं · ${over} अधिक`
          },
          topupCredits: {
            title: 'अतिरिक्त क्रेडिट',
            caption: 'समाप्त नहीं होते'
          },
          monthlyCap: {
            title: 'मासिक खर्च सीमा',
            barLabel: 'उपयोग की गई मासिक खर्च सीमा',
            captionDefault: 'डिफ़ॉल्ट अधिकतम सीमा',
            captionSpending: 'मासिक दूरस्थ खर्च',
            valueUsed: (spent, limit) => `${limit} में से ${spent} उपयोग हुए`
          },
          window: {
            today: 'आज',
            week: 'इस सप्ताह',
            month: 'इस महीने',
            topTier: 'बड़े मॉडल (मासिक)',
            barLabel: title => `${title} के शामिल उपयोग में से इस्तेमाल हुआ`,
            captionPaused: 'रुका है: सदस्यता भुगतान विफल',
            captionPausedOther: 'रुका है: पोर्टल में बिलिंग देखें',
            captionTopTierUsedUp: 'मासिक कोटा समाप्त; बाकी के लिए क्रेडिट उपयोग होते हैं',
            captionTopTierUsedUpKeepGoingOff: 'मासिक कोटा समाप्त; बाकी शामिल मॉडल अभी भी काम करते हैं',
            captionResetsIn: duration => `${duration} में रीसेट होता है`,
            captionIncluded: 'शामिल उपयोग',
            valueUsed: percent => `${percent} उपयोग हुआ`
          }
        },
        planCard: {
          freeTier: 'मुफ़्त',
          chooseAction: 'चुनें ↗',
          adjustPlanAction: 'योजना समायोजित करें ↗',
          unavailableCaption: 'सदस्यता विवरण उपलब्ध नहीं; पोर्टल अभी भी खोला जा सकता है।',
          downgradeCaption: (tierName, when) => `${when} को ${tierName} में बदलता है।`,
          cancellationCaption: when => `${when} को रद्द होता है।`,
          renewsCaption: date => `${date} को नवीनीकरण होता है`,
          noSubscriptionCaption: 'कोई सक्रिय सदस्यता नहीं — सशुल्क मॉडल अतिरिक्त क्रेडिट उपयोग करते हैं।'
        }
      },
      errors: {
        consentRequired: {
          title: 'कार्ड की पुष्टि चाहिए',
          message: 'टर्मिनल भुगतान के लिए पोर्टल में इस कार्ड की पुष्टि करें'
        },
        insufficientScope: {
          title: 'दूरस्थ खर्च की अनुमति चाहिए',
          message:
            'इसके लिए दूरस्थ खर्च की अनुमति चाहिए। अनुमति देने के लिए अतिरिक्त क्रेडिट खरीदना शुरू करें, फिर कोशिश करें।'
        },
        remoteSpendingRevoked: {
          title: 'दूरस्थ खर्च रोका गया',
          messageByAdmin: 'व्यवस्थापक ने इस टर्मिनल के लिए दूरस्थ खर्च रोका।',
          messageBySelf: 'आपने इस टर्मिनल के लिए दूरस्थ खर्च रोका।'
        },
        remoteSpendingReconnect: who => `${who} इस डिवाइस को फिर अधिकृत करने के लिए सेटिंग्स -> गेटवे से फिर जोड़ें।`,
        sessionRevoked: {
          title: 'सत्र से साइन आउट हुआ',
          message: 'आपका सत्र साइन आउट हुआ। सेटिंग्स → गेटवे से फिर साइन इन करें।'
        },
        cliBillingDisabled: {
          title: 'दूरस्थ खर्च बंद है',
          message:
            'इस खाते के लिए दूरस्थ खर्च बंद है — बिलिंग व्यवस्थापक पोर्टल के {app_name} पृष्ठ से चालू कर सकता है।'
        },
        roleRequired: {
          title: 'व्यवस्थापक भूमिका चाहिए',
          message: 'राशि जोड़ने के लिए संगठन का व्यवस्थापक/मालिक चाहिए। व्यवस्थापक से पूछें या पोर्टल पर प्रबंधित करें।'
        },
        idempotencyConflict: {
          title: 'नया अतिरिक्त क्रेडिट भुगतान शुरू करें',
          message: '🔴 यह भुगतान कुंजी पहले अलग राशि के लिए उपयोग हुई थी। नया अतिरिक्त क्रेडिट भुगतान शुरू करें।'
        },
        noPaymentMethod: {
          title: 'कोई सहेजा कार्ड नहीं',
          message:
            '💳 टर्मिनल भुगतान के लिए अभी कोई कार्ड सहेजा नहीं है। पोर्टल पर सेट करें ' +
            '(एक बार की क्रेडिट खरीद से दोबारा उपयोग योग्य कार्ड नहीं सहेजा जाता)।'
        },
        orgAccessDenied: {
          title: 'संगठन की पहुँच अस्वीकृत',
          message: 'यह टोकन ऐसे संगठन से जुड़ा नहीं है जिसे आप प्रबंधित कर सकते हैं'
        },
        monthlyCapExceeded: {
          title: 'मासिक खर्च सीमा पूरी हुई',
          messageReached: '🔴 मासिक खर्च सीमा पूरी हुई।',
          messageHeadroom: remaining => `🔴 मासिक खर्च सीमा पूरी हुई — $${remaining} की गुंजाइश बची है।`
        },
        rateLimited: {
          title: 'अभी बहुत अधिक भुगतान',
          message: mins =>
            mins > 0
              ? `🟡 अभी बहुत अधिक भुगतान (~${mins} मिनट बाद फिर कोशिश करें)। यह भुगतान की विफलता नहीं है।`
              : '🟡 अभी बहुत अधिक भुगतान। यह भुगतान की विफलता नहीं है।'
        },
        stripeUnavailable: {
          title: 'Stripe में समस्या है',
          message: mins =>
            mins > 0
              ? `Stripe में समस्या है — ~${mins} मिनट बाद फिर कोशिश करें`
              : 'Stripe में समस्या है — थोड़ी देर बाद फिर कोशिश करें'
        },
        upgradeCapExceeded: {
          title: 'दैनिक योजना-बदलाव सीमा पूरी हुई',
          message: 'दैनिक योजना-बदलाव सीमा पूरी हुई — कल फिर कोशिश करें'
        },
        endpointUnavailable: {
          title: 'बिलिंग एंडपॉइंट उपलब्ध नहीं',
          message: 'बिलिंग एंडपॉइंट ने गैर-JSON उत्तर दिया (इस परिनियोजन में शायद उपलब्ध न हो)।'
        },
        timeout: {
          title: 'बिलिंग अनुरोध की समय सीमा समाप्त',
          message: 'बिलिंग अनुरोध की समय सीमा समाप्त।'
        },
        transport: {
          title: 'बिलिंग कनेक्शन विफल',
          message: 'बिलिंग अनुरोध गेटवे तक पहुँचने से पहले विफल हुआ।'
        },
        default: {
          title: 'बिलिंग अनुरोध विफल',
          message: 'बिलिंग अनुरोध विफल।'
        }
      }
    },
    providers: {
      connectAccount: 'खाता जोड़ें',
      haveApiKey: 'इसके बजाय API कुंजी है?',
      intro:
        'सदस्यता से साइन इन करें — API कुंजी कॉपी नहीं करनी पड़ती। {app_name} यहीं ऐप में आपके लिए ब्राउज़र साइन-इन चलाता है।',
      connected: 'जुड़ा हुआ',
      collapse: 'समेटें',
      connectAnother: 'दूसरा प्रदाता जोड़ें',
      otherProviders: 'अन्य प्रदाता',
      disconnect: 'कनेक्शन हटाएँ',
      disconnectInTerminal: 'कनेक्शन हटाएँ (टर्मिनल में हटाने का कमांड चलाता है)',
      removeConfirm: provider => `${provider} हटाएँ?`,
      removeExternalGeneric: provider => `${provider} अपने CLI से प्रबंधित है — वहीं हटाएँ।`,
      removeKeyManaged: provider => `${provider} API कुंजी से कॉन्फ़िगर है। API कुंजियों से हटाएँ।`,
      removeTerminalConfirm: (provider, command) =>
        `${provider} का कनेक्शन हटाएँ? क्रेडेंशियल साफ़ करने के लिए टर्मिनल में "${command}" चलेगा।`,
      removeTerminalRunning: provider => `टर्मिनल में ${provider} का कनेक्शन हटाने का कमांड चल रहा है…`,
      removedTitle: 'खाता हटाया गया',
      removedMessage: provider => `${provider} हटा दिया गया।`,
      failedRemove: provider => `${provider} हटाया नहीं जा सका`,
      noProviderKeys: 'कोई प्रदाता API कुंजी उपलब्ध नहीं।',
      searchKeys: 'प्रदाता खोजें…',
      noKeysMatch: 'खोज से कोई प्रदाता मेल नहीं खाता।',
      localEndpoint: {
        title: 'स्थानीय / कस्टम एंडपॉइंट',
        description: '{app_name} को किसी भी OpenAI-संगत एंडपॉइंट (Zyphra, vLLM, llama.cpp, Ollama आदि) से जोड़ें।'
      },
      loading: 'प्रदाता लोड हो रहे हैं...'
    },
    sessions: {
      loading: 'संग्रहीत सत्र लोड हो रहे हैं…',
      archivedTitle: 'संग्रहीत सत्र',
      archivedIntro:
        'संग्रहीत चैट साइडबार से छिपती हैं, लेकिन उनके सभी संदेश बने रहते हैं। संग्रह करने के लिए साइडबार में चैट पर Alt/⌥+Shift-क्लिक करें।',
      emptyArchivedTitle: 'कुछ संग्रहीत नहीं',
      emptyArchivedDesc: 'चैट को यहाँ रखने के लिए संग्रह करें।',
      unarchive: 'संग्रह से निकालें',
      deletePermanently: 'स्थायी रूप से मिटाएँ',
      messages: count => `${count} ${count === 1 ? 'संदेश' : 'संदेश'}`,
      restored: 'बहाल हुआ',
      deleteConfirm: title => `"${title}" स्थायी रूप से मिटाएँ? इसे वापस नहीं लाया जा सकता।`,
      autoArchiveTitle: 'पुरानी चैट अपने आप संग्रह करें',
      autoArchiveDesc:
        'कुछ समय से न खोली गई चैट अपने आप संग्रह करें। पिन की हुई चैट कभी संग्रह नहीं होतीं और कुछ मिटता नहीं — संग्रहीत चैट केवल यहाँ आ जाती हैं।',
      autoArchiveDaysLabel: 'इतने समय बाद संग्रह करें',
      autoArchiveDaysUnit: 'निष्क्रियता के दिन',
      autoArchiveFailed: 'स्वचालित संग्रह अपडेट नहीं हो सका',
      defaultDirTitle: 'डिफ़ॉल्ट प्रोजेक्ट निर्देशिका',
      defaultDirDesc:
        'नया सत्र इस फ़ोल्डर में शुरू होता है, जब तक दूसरा न चुनें। होम निर्देशिका उपयोग करने के लिए निर्धारित न करें।',
      defaultDirUpdated: shortcut =>
        `डिफ़ॉल्ट प्रोजेक्ट निर्देशिका अपडेट हुई — लागू करने के लिए नई चैट${shortcut ? ` (${shortcut})` : ''} शुरू करें`,
      defaultsTo: label => `डिफ़ॉल्ट ${label} है।`,
      change: 'बदलें',
      choose: 'चुनें',
      clear: 'साफ़',
      notSet: 'निर्धारित नहीं',
      failedLoad: 'संग्रहीत सत्र लोड नहीं हो सके',
      unarchiveFailed: 'संग्रह से निकालना विफल',
      deleteFailed: 'मिटाना विफल',
      updateDirFailed: 'डिफ़ॉल्ट निर्देशिका अपडेट नहीं हो सकी',
      clearDirFailed: 'डिफ़ॉल्ट निर्देशिका साफ़ नहीं हो सकी'
    },
    toolsets: {
      loadingConfig: 'कॉन्फ़िगरेशन लोड हो रहा है',
      savedTitle: 'क्रेडेंशियल सहेजा गया',
      savedMessage: key => `${key} अपडेट हुआ।`,
      removedTitle: 'क्रेडेंशियल हटाया गया',
      removedMessage: key => `${key} हटा दिया गया।`,
      failedSave: key => `${key} सहेजना विफल`,
      failedRemove: key => `${key} हटाना विफल`,
      failedReveal: key => `${key} दिखाना विफल`,
      removeConfirm: key => `.env से ${key} हटाएँ?`,
      set: 'निर्धारित करें',
      notSet: 'निर्धारित नहीं',
      selectedTitle: 'प्रदाता चुना गया',
      selectedMessage: provider => `${provider} अब सक्रिय है।`,
      failedSelect: provider => `${provider} चुनना विफल`,
      failedLoad: 'टूल कॉन्फ़िगरेशन लोड नहीं हो सका',
      noProviderOptions: 'इस टूल समूह में प्रदाता विकल्प नहीं हैं — चालू करें और यह वर्तमान सेटअप के साथ काम करेगा।',
      noProviders: 'अभी इस टूल समूह के लिए कोई प्रदाता उपलब्ध नहीं है।',
      ready: 'तैयार',
      needsSignIn: 'साइन-इन चाहिए',
      needsSetup: 'सेटअप आवश्यक',
      activeBackend: 'सक्रिय',
      activeBackendHint: 'यह आपका सक्रिय बैकएंड है',
      useBackend: 'यह बैकएंड उपयोग करें',
      nousIncluded: 'Nous सदस्यता में शामिल — सक्रिय करने के लिए Nous खाते से साइन इन करें।',
      nousAuthNeededTitle: 'अपने Nous खाते से साइन इन करें',
      nousAuthNeededMessage: provider => `${provider} सहेजा गया है, लेकिन Nous खाते से साइन इन करने पर ही काम करेगा।`,
      nousAuthSignIn: 'साइन इन करें',
      nousAuthDoneTitle: 'Nous खाता जुड़ा',
      nousAuthDoneMessage: 'आपकी सदस्यता के बैकएंड अब सक्रिय हैं।',
      nousAuthFailed: 'Nous साइन-इन पूरा नहीं हुआ',
      nousAuthFailedMessage: 'फिर कोशिश करें।',
      nousAuthTryAgain: 'फिर कोशिश करें',
      noApiKeyRequired: 'API कुंजी की ज़रूरत नहीं।',
      postSetupHint: step =>
        `इस बैकएंड को एक बार इंस्टॉल करना है (${step})। इसी मशीन पर चलता है — कुछ मिनट लग सकते हैं।`,
      postSetupInstalledHint: 'इंस्टॉल है। केवल खराबी होने पर सेटअप फिर चलाएँ।',
      postSetupRun: 'सेटअप चलाएँ',
      postSetupRerun: 'सेटअप फिर चलाएँ',
      postSetupInstalled: 'इंस्टॉल है',
      postSetupRunning: 'इंस्टॉल हो रहा है…',
      postSetupStarting: 'शुरू हो रहा है…',
      postSetupCompleteTitle: 'सेटअप पूरा हुआ',
      postSetupCompleteMessage: step => `${step} इंस्टॉल हुआ।`,
      postSetupErrorTitle: 'सेटअप त्रुटियों के साथ पूरा हुआ',
      postSetupErrorMessage: step =>
        `${step} का सेटअप पूरा नहीं हुआ। कारण देखने के लिए लॉग खोलें, फिर सेटअप फिर चलाएँ।`,
      postSetupOpenLogs: 'लॉग खोलें',
      postSetupRunAgain: 'फिर चलाएँ',
      postSetupFailed: step => `${step} का सेटअप चलाना विफल`,
      webSearchActive: backend => `खोज: ${backend}`,
      webExtractActive: backend => `निष्कर्षण: ${backend}`,
      webCapabilityUnset: 'निर्धारित नहीं',
      webUseForSearch: 'खोज के लिए उपयोग करें',
      webUseForExtract: 'निष्कर्षण के लिए उपयोग करें',
      webUsedForSearch: 'खोज बैकएंड',
      webUsedForExtract: 'निष्कर्षण बैकएंड',
      webCapabilitySelectedMessage: (provider, capability) => `${provider} अब वेब ${capability} संभालता है।`,
      failedSelectCapability: provider => `${provider} निर्धारित करना विफल`,
      loadingModels: 'मॉडल सूची लोड हो रही है...',
      modelSectionTitle: 'मॉडल',
      modelCount: count => `${count} मॉडल${count === 1 ? '' : ''}`,
      modelInUse: 'उपयोग में',
      modelDefault: 'डिफ़ॉल्ट',
      modelInactiveHint: 'मॉडल बदलने के लिए पहले यह बैकएंड चुनें।',
      modelSelectedTitle: 'मॉडल चुना गया',
      modelSelectedMessage: model => `${model} नए सत्रों पर लागू होता है।`,
      failedSelectModel: model => `${model} चुनना विफल`,
      terminalBackend: {
        sectionTitle: 'निष्पादन बैकएंड',
        loading: 'निष्पादन बैकएंड जाँचे जा रहे हैं…',
        failedLoad: 'टर्मिनल बैकएंड लोड नहीं हो सके',
        ready: 'तैयार',
        needsSetup: 'सेटअप चाहिए',
        unavailable: 'उपलब्ध नहीं',
        inUse: 'उपयोग में',
        selectedTitle: 'बैकएंड चुना गया',
        selectedMessage: backend => `टर्मिनल कमांड अब ${backend} से चलते हैं। नए सत्रों पर लागू।`,
        failedSelect: backend => `${backend} चुनना विफल`,
        needsSetupHint: 'यह बैकएंड पूरा सेटअप किए बिना चुना गया है — सेटअप पूरा होने तक कमांड विफल होंगे।',
        needsSetupConfirmTitle: backend => `फिर भी ${backend} चुनें?`,
        needsSetupConfirmDescription: detail =>
          `${detail} इस बदलाव के बाद शुरू होने वाले सत्रों में सेटअप पूरा होने तक टर्मिनल या फ़ाइल टूल नहीं होंगे।`,
        needsSetupConfirmDescriptionGeneric:
          'इस बैकएंड का सेटअप अभी नहीं हुआ है। इस बदलाव के बाद शुरू होने वाले सत्रों में सेटअप पूरा होने तक टर्मिनल या फ़ाइल टूल नहीं होंगे।',
        needsSetupConfirmAction: 'फिर भी चुनें',
        unavailableTitle: 'टर्मिनल कमांड उपलब्ध नहीं',
        unavailableMessage: backend =>
          `{app_name} अभी शेल कमांड नहीं चला सकता: ${backend} तैयार नहीं है। स्थानीय पर जाएँ या ${backend} का सेटअप पूरा करके फिर कोशिश करें।`,
        openBackendSettings: 'टर्मिनल सेटिंग्स खोलें',
        useLocal: 'स्थानीय उपयोग करें',
        switchedToLocal: 'टर्मिनल कमांड अब स्थानीय रूप से चलते हैं। नए सत्रों पर लागू।'
      },
      browserRealProfile: {
        label: 'मेरी वास्तविक ब्राउज़र प्रोफ़ाइल उपयोग करें',
        description:
          'आपके डिफ़ॉल्ट ब्राउज़र के लॉगिन और कुकी की प्रबंधित प्रति बनाता है जिससे एजेंट ब्राउज़ करता है, और ऐप के ब्राउज़र टैब में भी साइन इन करता है। आपकी सक्रिय प्रोफ़ाइल कभी सीधे नहीं खुलती। नए सत्रों पर लागू।',
        enabledTitle: 'वास्तविक प्रोफ़ाइल से ब्राउज़िंग चालू',
        enabledMessage: 'नए सत्र डिफ़ॉल्ट ब्राउज़र प्रोफ़ाइल की प्रति से ब्राउज़ करेंगे।',
        disabledTitle: 'वास्तविक प्रोफ़ाइल से ब्राउज़िंग बंद',
        disabledMessage:
          'प्रोफ़ाइल की प्रति मिटेगी और ऐप का ब्राउज़र उससे साइन आउट होगा; नए सत्र साफ़ ब्राउज़र उपयोग करेंगे।',
        failedSave: 'वास्तविक प्रोफ़ाइल की सेटिंग सहेजी नहीं जा सकी',
        reimportSignins: 'साइन-इन फिर आयात करें',
        signinsImportedTitle: 'ऐप के ब्राउज़र में साइन-इन',
        signinsImported: count =>
          `आपकी ब्राउज़र प्रोफ़ाइल की ${count} कुकी${count === 1 ? '' : ''} से ऐप के ब्राउज़र में साइन इन किया गया।`,
        signinsRemote:
          'यह बैकएंड दूसरी मशीन पर चलता है, इसलिए उसकी ब्राउज़र प्रोफ़ाइल ऐप के ब्राउज़र में आयात नहीं होती।',
        signinsFailed: 'ऐप के ब्राउज़र में साइन-इन आयात नहीं हो सके',
        prompt: {
          title: 'अपनी साइटों में साइन इन रहें',
          body: '{app_name} को डिफ़ॉल्ट ब्राउज़र प्रोफ़ाइल की प्रति से ब्राउज़ करने दें, ताकि एजेंट और ऐप के ब्राउज़र टैब दोनों में साइटें पहले से साइन इन होकर खुलें।',
          bulletSnapshot: 'कुकी और लॉगिन की प्रबंधित प्रति बनाई जाती है।',
          bulletLiveProfile: 'आपकी सक्रिय ब्राउज़र प्रोफ़ाइल कभी सीधे नहीं खुलती।',
          bulletLocal: 'इस कंप्यूटर से कुछ बाहर नहीं जाता।',
          dontShowAgain: 'फिर न दिखाएँ',
          notNow: 'अभी नहीं',
          enable: 'मेरी प्रोफ़ाइल उपयोग करें'
        }
      }
    }
  }
} satisfies TranslationOverrides
