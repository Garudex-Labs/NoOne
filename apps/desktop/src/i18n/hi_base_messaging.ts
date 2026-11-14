import { appText } from '@noone/shared/application-identity'

import type { TranslationOverrides } from './define-locale'

export const hiBaseMessaging = {
  messaging: {
    search: 'मैसेजिंग खोजें...',
    statusFilter: { all: 'सभी', bad: 'त्रुटियाँ', good: 'जुड़े हुए', muted: 'निष्क्रिय', warn: 'ध्यान चाहिए' },
    loading: 'मैसेजिंग प्लेटफ़ॉर्म लोड हो रहे हैं...',
    loadFailed: 'मैसेजिंग प्लेटफ़ॉर्म लोड नहीं हुए',
    states: {
      connected: 'जुड़ा हुआ',
      connecting: 'जुड़ रहा है',
      disabled: 'बंद',
      fatal: 'त्रुटि',
      gateway_stopped: 'मैसेजिंग गेटवे रुका हुआ',
      not_configured: 'सेटअप चाहिए',
      pending_restart: 'फिर शुरू करना चाहिए',
      retrying: 'फिर कोशिश',
      startup_failed: 'शुरू करना विफल'
    },
    unknown: 'अज्ञात',
    hintPendingRestart: 'बदलाव लागू करने के लिए स्थिति पट्टी से गेटवे फिर शुरू करें।',
    sharedListenerUrl: 'साझा गेटवे श्रोता पर यहाँ उपलब्ध',
    hintGatewayStopped: 'जुड़ने के लिए स्थिति पट्टी से गेटवे शुरू करें।',
    credentialsSet: 'क्रेडेंशियल सेट',
    needsSetup: 'सेटअप चाहिए',
    gatewayStopped: 'मैसेजिंग गेटवे रुका हुआ',
    getCredentials: 'अपने क्रेडेंशियल पाएँ',
    openSetupGuide: 'सेटअप मार्गदर्शिका खोलें',
    required: 'आवश्यक',
    recommended: 'अनुशंसित',
    advanced: count => `उन्नत (${count})`,
    noTokenNeeded: 'इस प्लेटफ़ॉर्म को यहाँ टोकन नहीं चाहिए। ऊपर की सेटअप मार्गदर्शिका देखें, फिर नीचे चालू करें।',
    enabled: 'चालू',
    disabled: 'बंद',
    unsavedChanges: 'बिना सहेजे बदलाव',
    saving: 'सहेज रहे हैं...',
    saveChanges: 'बदलाव सहेजें',
    saved: 'सहेजा गया',
    replaceValue: 'मौजूदा मान बदलें',
    openDocs: 'दस्तावेज़ खोलें',
    clearField: key => `${key} साफ़ करें`,
    addListEntry: 'दूसरा जोड़ें',
    removeListEntry: 'हटाएँ',
    listEntryPlaceholder: 'ID लिखें',
    enableAria: name => `${name} चालू करें`,
    disableAria: name => `${name} बंद करें`,
    platformEnabled: name => `${name} चालू`,
    platformDisabled: name => `${name} बंद`,
    restartToApply: 'बदलाव गेटवे फिर शुरू होने पर लागू होगा।',
    setupSaved: name => `${name} सेटअप सहेजा गया`,
    restartToReconnect: 'नए क्रेडेंशियल गेटवे फिर शुरू होने पर लागू होंगे।',
    appliedLive: 'चल रहे गेटवे पर लागू हुआ।',
    connectingLive: 'चलता गेटवे नए क्रेडेंशियल से जुड़ रहा है।',
    keyCleared: key => `${key} साफ़ किया गया`,
    setupUpdated: name => `${name} सेटअप अपडेट हुआ।`,
    failedUpdate: name => `${name} अपडेट नहीं हुआ`,
    failedSave: name => `${name} सहेजा नहीं गया`,
    failedClear: key => `${key} साफ़ नहीं हुआ`,
    pendingRequests: count => `लंबित अनुरोध (${count})`,
    pendingAria: count => `जोड़ने के ${count} लंबित ${count === 1 ? 'अनुरोध' : 'अनुरोध'}`,
    approvedUsers: count => `अनुमत उपयोगकर्ता (${count})`,
    approve: 'अनुमति दें',
    approving: 'अनुमति दे रहे हैं...',
    revoke: 'अनुमति वापस लें',
    revoking: 'अनुमति वापस ले रहे हैं...',
    revokeAria: name => `${name} की अनुमति वापस लें`,
    revokeTitle: 'पहुँच की अनुमति वापस लें',
    revokeDesc: (name: string) => `${name} की पहुँच समाप्त होगी और अगले संदेश से उसे पहचाना नहीं जाएगा।`,
    approvedUser: name => `${name} को अनुमति मिली`,
    approvedHint: 'अगले संदेश पर उन्हें अपने आप पहचाना जाएगा।',
    revokedUser: name => `${name} की अनुमति वापस ली गई`,
    failedApprove: name => `${name} को अनुमति नहीं दे सके`,
    failedRevoke: name => `${name} की अनुमति वापस नहीं ले सके`,
    pairingLockedOut: 'बहुत अधिक विफल अनुमति प्रयास — प्लेटफ़ॉर्म लॉक है। बाद में आज़माएँ।',
    waitingSince: minutes => (minutes < 1 ? 'अभी-अभी' : `${minutes}m पहले`),
    restartNeeded: 'सहेजा गया। नई सेटिंग लागू करने के लिए मैसेजिंग गेटवे फिर शुरू करें।',
    restartNow: 'अभी फिर शुरू करें',
    restarting: 'फिर शुरू हो रहा है…',
    restartFailedManual: 'मैसेजिंग सेटिंग लागू करने के लिए {app_name} फिर शुरू नहीं हो सका',
    restartFailedManualDetail: 'फिर शुरू करना दोबारा आज़माएँ; विफल रहे तो लॉग खोलें और निदान भेजें।',
    restartAgain: 'दोबारा शुरू करें',
    openLogs: 'लॉग खोलें',
    relayLink: {
      title: 'टीम गेटवे',
      badge: 'बॉट टोकन नहीं चाहिए',
      intro: (platform: string) =>
        `${platform} साझा ${appText('{app_name}')} बॉट से इस एजेंट तक पहुँचता है। अपना ${platform} खाता जोड़ें और एजेंट से बात करने के लिए बॉट को संदेश भेजें।`,
      link: (platform: string) => `${platform} जोड़ें`,
      linkAnother: (platform: string) => `दूसरा ${platform} खाता जोड़ें`,
      linkedAccounts: 'जुड़े खाते',
      unlink: 'अलग करें',
      unlinkFailed: 'वह खाता अलग नहीं हुआ',
      stepOpen: (platform: string) => `1. फ़ोन से कोड स्कैन करें या ${platform} में बॉट खोलें।`,
      stepSend: '2. जिस खाते को जोड़ना है, उससे बॉट को यह संदेश भेजें:',
      open: (platform: string) => `${platform} खोलें`,
      copy: 'संदेश कॉपी करें',
      copied: 'कॉपी किया गया',
      copyFailed: (command: string) => `कॉपी विफल। इसके बजाय ${command} लिखें।`,
      waiting: 'बॉट के आपका संदेश देखने की प्रतीक्षा। कोड एक बार काम करता है।',
      linked: (platform: string) => `${platform} खाता जुड़ गया। एजेंट से बात करने के लिए बॉट को संदेश भेजें।`,
      expired: 'इस्तेमाल से पहले कोड की वैधता समाप्त। नया कोड लेकर फिर आज़माएँ।',
      refused: (platform: string) => `${platform} ने जोड़ना अस्वीकार किया। नया कोड लेकर फिर आज़माएँ।`,
      qrAlt: (platform: string) => `साझा ${platform} बॉट का QR कोड`,
      managed: 'टीम गेटवे द्वारा प्रबंधित',
      managedNote: (platform: string) =>
        `इस डिप्लॉयमेंट में टीम गेटवे मैसेजिंग संभालता है, इसलिए हर शुरुआत पर गेटवे सीधे ${platform} कनेक्शन को बंद करता है। रिले के साथ चलाने के लिए गेटवे एनवायरनमेंट में GATEWAY_RELAY_ALLOW_DIRECT_PLATFORMS=true रखें (सीधा कनेक्शन इंस्टेंस को शून्य तक स्केल होने से रोकता है और संदेश दो बार पहुँचा सकता है)।`,
      managedIntro: 'इस एजेंट के खाते Nous Portal से जोड़े जाते हैं।',
      openPortal: 'Nous Portal में खाते जोड़ें',
      noNewAccount: (platform: string) =>
        `कोड अब सक्रिय नहीं है और नया खाता नहीं दिखा। आपका ${platform} खाता सूची में न हो तो नया कोड लेकर फिर आज़माएँ।`
    },
    telegramQr: {
      title: 'Telegram बॉट जोड़ने का तरीका चुनें',
      subtitle:
        'दोनों विकल्प आपके नियंत्रण का बॉट जोड़ते हैं और क्रेडेंशियल केवल इस {app_name} इंस्टॉलेशन में सहेजते हैं।',
      quickSetup: 'त्वरित सेटअप',
      recommended: 'अनुशंसित',
      quickHelp:
        'QR कोड स्कैन करें और Telegram में पुष्टि करें। {app_name} बॉट बनाता है और आपका Telegram उपयोगकर्ता ID अपने आप पहचानता है।',
      createWithQr: 'QR से बनाएँ',
      starting: 'शुरू हो रहा है…',
      replaceWarning:
        'Telegram क्रेडेंशियल पहले से कॉन्फ़िगर हैं। सहेजने पर नया QR सेटअप या बॉट टोकन मौजूदा बॉट को बदल देगा।',
      scanHint: 'फ़ोन के Telegram ऐप से स्कैन करें या इस कंप्यूटर पर लिंक खोलें।',
      waiting: 'Telegram की प्रतीक्षा…',
      expiresIn: remaining => `${remaining} में वैधता समाप्त`,
      expired: 'वैधता समाप्त',
      openTelegram: 'Telegram खोलें',
      ready: 'बॉट बनाया गया',
      allowedUsers: 'अनुमत उपयोगकर्ता',
      ownerDetected: 'स्वामी पहचाना गया',
      addAtLeastOne: 'कम-से-कम एक Telegram उपयोगकर्ता ID जोड़ें।',
      userIdPlaceholder: 'Telegram उपयोगकर्ता ID',
      add: 'जोड़ें',
      numericOnly: 'अनुमत Telegram उपयोगकर्ता ID संख्यात्मक होने चाहिए।',
      saveAndRestart: 'सहेजें और फिर शुरू करें',
      applying: 'सहेज रहे हैं…',
      pairingExpired: 'Telegram जोड़ने की वैधता समाप्त। फिर आज़माने के लिए नया QR सेटअप शुरू करें।',
      stillWaiting: detail => `अभी Telegram की प्रतीक्षा है। इसके बाद फिर कोशिश: ${detail}`,
      savedRestarting: 'Telegram सहेजा गया; गेटवे फिर शुरू हो रहा है…',
      savedRestartFailed: detail => `Telegram सहेजा गया; गेटवे फिर शुरू करना विफल${detail}`
    },
    fieldCopy: {
      TELEGRAM_BOT_TOKEN: {
        label: 'बॉट टोकन',
        help: '@BotFather से बॉट बनाएँ, फिर मिला टोकन पेस्ट करें।',
        placeholder: 'Telegram बॉट टोकन पेस्ट करें'
      },
      TELEGRAM_ALLOWED_USERS: {
        label: 'अनुमत Telegram उपयोगकर्ता ID',
        help: 'अनुशंसित। @userinfobot से संख्यात्मक ID, हर बॉक्स में एक। इसके बिना कोई भी बॉट को निजी संदेश भेज सकता है।'
      },
      TELEGRAM_PROXY: { label: 'प्रॉक्सी URL', help: 'केवल Telegram अवरुद्ध करने वाले नेटवर्क पर आवश्यक।' },
      DISCORD_BOT_TOKEN: {
        label: 'बॉट टोकन',
        help: 'Discord Developer Portal में ऐप बनाएँ, बॉट जोड़ें और उसका टोकन पेस्ट करें।'
      },
      DISCORD_ALLOWED_USERS: {
        label: 'अनुमत Discord उपयोगकर्ता ID',
        help: 'अनुशंसित। Discord उपयोगकर्ता ID, हर बॉक्स में एक।'
      },
      DISCORD_REPLY_TO_MODE: { label: 'उत्तर देने का तरीका', help: 'first, all या off।' },
      DISCORD_ALLOW_ALL_USERS: {
        label: 'सभी Discord उपयोगकर्ताओं को अनुमति दें',
        help: 'केवल विकास के लिए। true होने पर अनुमत सूची के बिना कोई भी बॉट को निजी संदेश भेज सकता है।'
      },
      DISCORD_HOME_CHANNEL: {
        label: 'मुख्य चैनल ID',
        help: 'वह चैनल जहाँ बॉट स्वयं संदेश भेजता है (cron आउटपुट, याद दिलाना)।'
      },
      DISCORD_HOME_CHANNEL_NAME: {
        label: 'मुख्य चैनल का नाम',
        help: 'लॉग और स्थिति आउटपुट में मुख्य चैनल का प्रदर्शन नाम।'
      },
      MATTERMOST_ALLOW_ALL_USERS: { label: 'सभी Mattermost उपयोगकर्ताओं को अनुमति दें' },
      MATTERMOST_HOME_CHANNEL: { label: 'मुख्य चैनल' },
      SLACK_BOT_TOKEN: {
        label: 'Slack बॉट टोकन',
        help: 'Slack ऐप इंस्टॉल करने के बाद OAuth & Permissions का बॉट टोकन इस्तेमाल करें।',
        placeholder: 'Slack बॉट टोकन पेस्ट करें'
      },
      SLACK_APP_TOKEN: {
        label: 'Slack ऐप टोकन',
        help: 'Socket Mode के लिए आवश्यक ऐप-स्तरीय टोकन इस्तेमाल करें।',
        placeholder: 'Slack ऐप टोकन पेस्ट करें'
      },
      SLACK_ALLOWED_USERS: {
        label: 'अनुमत Slack उपयोगकर्ता ID',
        help: 'अनुशंसित। Slack उपयोगकर्ता ID, हर बॉक्स में एक।'
      },
      MATTERMOST_URL: { label: 'सर्वर URL', placeholder: 'https://mattermost.example.com' },
      MATTERMOST_TOKEN: { label: 'बॉट टोकन' },
      MATTERMOST_ALLOWED_USERS: {
        label: 'अनुमत उपयोगकर्ता ID',
        help: 'अनुशंसित। Mattermost उपयोगकर्ता ID, हर बॉक्स में एक।'
      },
      SIGNAL_HTTP_URL: {
        label: 'Signal ब्रिज URL',
        placeholder: 'http://127.0.0.1:8080',
        help: 'चल रहे signal-cli REST ब्रिज का URL।'
      },
      SIGNAL_ACCOUNT: { label: 'फ़ोन नंबर', help: 'आपके signal-cli ब्रिज में पंजीकृत नंबर।' },
      SIGNAL_ALLOWED_USERS: { label: 'अनुमत Signal उपयोगकर्ता', help: 'अनुशंसित। Signal पहचान, हर बॉक्स में एक।' },
      WHATSAPP_ENABLED: {
        label: 'WhatsApp ब्रिज चालू करें',
        help: 'नीचे का स्विच अपने आप सेट करता है। ज़रूरत समझे बिना न बदलें।'
      },
      WHATSAPP_MODE: { label: 'ब्रिज मोड' },
      WHATSAPP_ALLOWED_USERS: {
        label: 'अनुमत WhatsApp उपयोगकर्ता',
        help: 'अनुशंसित। फ़ोन नंबर या WhatsApp ID, हर बॉक्स में एक।'
      }
    },
    platformIntro: {}
  },
  webhooks: {
    search: 'वेबहुक खोजें...',
    loading: 'वेबहुक लोड हो रहे हैं...',
    loadFailed: 'वेबहुक लोड नहीं हुए',
    subscriptions: (count: number) => `सब्सक्रिप्शन (${count})`,
    hint: 'रिसीवर चलने पर सब्सक्रिप्शन बदलाव तुरंत फिर लोड होते हैं। बंद सब्सक्रिप्शन आने वाले इवेंट अस्वीकार करते हैं।',
    empty: 'अभी कोई वेबहुक सब्सक्रिप्शन नहीं।',
    disabledTitle: 'वेबहुक रिसीवर बंद',
    disabledBody:
      'वेबहुक अपना अलग गेटवे प्लेटफ़ॉर्म हैं। आने वाले HTTP इवेंट स्वीकार करने के लिए यहाँ चालू करें; चैट चैनल केवल तब चाहिए जब सब्सक्रिप्शन Telegram, Discord, Slack या दूसरे चैनल पर भेजता है।',
    enable: 'वेबहुक चालू करें',
    enabling: 'चालू कर रहे हैं...',
    enabled: (name: string) => `चालू: "${name}"`,
    disabled: (name: string) => `बंद: "${name}"`,
    enableRow: 'चालू करें',
    disableRow: 'बंद करें',
    delete: 'हटाएँ',
    deleting: 'हटा रहे हैं...',
    deleted: 'वेबहुक हटाया गया',
    deleteTitle: 'वेबहुक हटाएँ',
    deleteDescPrefix: 'इसे स्थायी रूप से हटाया जाएगा: ',
    deleteDescSuffix: '। यह पूर्ववत नहीं किया जा सकता।',
    deleteFailed: (name: string) => `"${name}" नहीं हटा`,
    toggleFailed: (name, enabled) => `"${name}" ${enabled ? 'चालू' : 'बंद'} नहीं हुआ`,
    newSubscription: 'नया सब्सक्रिप्शन',
    restarting: 'गेटवे फिर शुरू हो रहा है...',
    restartNeeded: 'वेबहुक चालू हैं, लेकिन रिसीवर के ऑनलाइन आने से पहले गेटवे फिर शुरू करना चाहिए।',
    restartGateway: 'गेटवे फिर शुरू करें',
    restartingGateway: 'फिर शुरू हो रहा है...',
    restartFailed: (detail: string) => `गेटवे फिर शुरू करना विफल${detail}`,
    enabledRestarting: 'वेबहुक चालू; गेटवे फिर शुरू हो रहा है...',
    all: '(सभी)',
    deliverOnly: 'केवल भेजें',
    createdTitle: 'सब्सक्रिप्शन बनाया गया',
    createdSecretHint: 'गोपनीय कुंजी अभी कॉपी करें — केवल एक बार दिखाई जाती है।',
    webhookUrl: 'वेबहुक URL',
    secretOnce: 'गोपनीय कुंजी (एक बार दिखाई जाती है)',
    done: 'पूरा',
    fieldName: 'नाम',
    fieldNamePlaceholder: 'जैसे github-push',
    fieldDescription: 'विवरण',
    fieldDescriptionPlaceholder: 'यह वेबहुक क्या करता है (वैकल्पिक)',
    fieldEvents: 'इवेंट',
    fieldEventsPlaceholder: 'अल्पविराम से अलग करें, सभी के लिए खाली छोड़ें',
    fieldSkills: 'स्किल',
    fieldSkillsPlaceholder: 'अल्पविराम से अलग स्किल नाम (वैकल्पिक)',
    fieldDeliver: 'यहाँ भेजें',
    fieldDeliverOnly: 'केवल पेलोड भेजें',
    fieldPrompt: 'प्रॉम्प्ट',
    fieldPromptPlaceholder: 'वेबहुक चलने पर एजेंट के निर्देश (वैकल्पिक)',
    nameRequired: 'नाम आवश्यक',
    create: 'बनाएँ',
    creating: 'बना रहे हैं...',
    created: 'बनाया गया',
    createFailed: (detail: string) => `बनाना विफल: ${detail}`,
    copy: 'कॉपी करें',
    deliverOptions: {
      log: 'लॉग',
      telegram: 'Telegram',
      discord: 'Discord',
      slack: 'Slack',
      email: 'ईमेल',
      github_comment: 'GitHub टिप्पणी'
    }
  }
} satisfies TranslationOverrides
