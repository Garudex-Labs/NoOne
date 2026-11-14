import { appText } from '@noone/shared/application-identity'

import type { Translations } from './types'
type ThreadCopy = Translations['assistant']['thread']

// The error card's per-code title and body (lib/error-surface-copy.ts), keyed by error_surface.code.
export const hiErrorCodes: ThreadCopy['errorCodes'] = {
  auth: {
    title: provider => `${provider} ने आपकी API कुंजी अस्वीकार की`,
    body: () => "सहेजी गई कुंजी अमान्य है या रद्द हो गई है। अपडेट करें, फिर संदेश दोबारा भेजें।"
  },
  auth_permanent: {
    title: provider => `${provider} ने आपकी API कुंजी अस्वीकार की`,
    body: () => "सहेजी गई कुंजी अमान्य है या रद्द हो गई है। अपडेट करें, फिर संदेश दोबारा भेजें।"
  },
  billing: {
    title: provider => `${provider} के क्रेडिट समाप्त`,
    body: provider => `${provider} के सशुल्क मॉडल उपयोग करते रहने के लिए क्रेडिट जोड़ें।`
  },
  rate_limit: {
    title: provider => `${provider} अभी व्यस्त है`,
    body: provider => `${provider} की दर सीमा पूरी हो गई। थोड़ा रुकें, फिर कोशिश करें।`
  },
  upstream_rate_limit: {
    title: (_provider, model) => `${model || 'यह मॉडल'} अभी व्यस्त है`,
    body: (provider, model) =>
      `${model || 'यह मॉडल'} पर ${provider} से ऊपर की सेवा में दर सीमा लगी है, आपके खाते पर नहीं। थोड़ी देर में फिर कोशिश करें।`
  },
  overloaded: {
    title: provider => `${provider} अभी व्यस्त है`,
    body: provider => `${provider} पर बहुत अधिक भार है और अनुरोध स्वीकार नहीं कर सका। थोड़ी देर में फिर कोशिश करें।`
  },
  server_error: {
    title: provider => `${provider} में समस्या है`,
    body: provider => `${provider} ने सर्वर त्रुटि लौटाई। थोड़ी देर में फिर कोशिश करें।`
  },
  timeout: {
    title: provider => `${provider} तक नहीं पहुँच सकते`,
    body: provider => `${appText('{app_name}')} ${provider} तक नहीं पहुँच सका। कनेक्शन जाँचें, फिर कोशिश करें।`
  },
  stream_drop: {
    title: "उत्तर बीच में कट गया",
    body: "उत्तर पूरा होने से पहले कनेक्शन टूट गया। फिर भेजने के लिए पुनः प्रयास करें।"
  },
  no_reply: {
    title: "उत्तर नहीं आया",
    body: "{app_name} ने चरण पूरा किया, लेकिन इस विंडो तक उत्तर नहीं पहुँचा। फिर भेजने के लिए पुनः प्रयास करें।"
  },
  upstream_blocked: {
    title: provider => `${provider} ने अनुरोध ब्लॉक किया`,
    body: provider =>
      `${provider} के आगे की फ़ायरवॉल ने मॉडल तक पहुँचने से पहले अनुरोध रोका। प्रदाता बदलें या उसका कस्टम User-Agent सेट करें।`
  },
  ssl_cert_verification: {
    title: provider => `${provider} का कनेक्शन सत्यापित नहीं हो सकता`,
    body: provider =>
      `प्रॉक्सी या पुराने प्रमाणपत्र भंडार ने ${provider} का सुरक्षित कनेक्शन रोका। सेटअप गाइड में सुधार का तरीका है।`
  },
  context_overflow: {
    title: "यह चैट बहुत लंबी है",
    body: (_provider, model) =>
      `बातचीत ${model ? `${model} की` : 'मॉडल की'} संदर्भ सीमा में नहीं समाती। जारी रखने के लिए संपीड़ित करें।`
  },
  payload_too_large: {
    title: "यह संदेश बहुत बड़ा है",
    body: provider =>
      `अटैचमेंट सहित अनुरोध ${provider} की आकार सीमा से बड़ा है। बातचीत संपीड़ित करें या अटैचमेंट हटाएँ।`
  },
  model_not_found: {
    title: (_provider, model) => `${model || 'यह मॉडल'} उपलब्ध नहीं`,
    body: (provider, model) =>
      `${provider} आपके खाते में ${model || 'यह मॉडल'} उपलब्ध नहीं कराता। दूसरा मॉडल चुनें।`
  },
  provider_policy_blocked: {
    title: (provider, model) => `${provider} की सेटिंग्स ${model || 'इस मॉडल'} को रोकती हैं`,
    body: provider =>
      `${provider} की आपकी गोपनीयता सेटिंग्स इस मॉडल के सभी एंडपॉइंट बाहर करती हैं। ${provider} पर बदलें या दूसरा मॉडल चुनें।`
  },
  content_policy_blocked: {
    title: provider => `${provider} ने संदेश अस्वीकार किया`,
    body: provider => `${provider} के सुरक्षा फ़िल्टर ने इसे रोका। संदेश संपादित करके फिर भेजें।`
  },
  format_error: {
    title: provider => `${provider} ने अनुरोध अस्वीकार किया`,
    body: provider =>
      `${provider} इस बातचीत की संरचना स्वीकार नहीं कर सका। प्रदाता बदलें या समस्या बनी रहे तो नई चैट शुरू करें।`
  },
  truncated: {
    title: "उत्तर अधूरा रुक गया",
    body: (_provider, model) =>
      `${model || 'मॉडल'} उत्तर पूरा होने से पहले रुक गया। जहाँ रुका वहाँ से आगे बढ़ने के लिए जारी रखें।`
  },
  invalid_response: {
    title: "उत्तर पढ़ा नहीं जा सका",
    body: provider => `${provider} ने खाली या खराब उत्तर भेजा। थोड़ी देर में फिर कोशिश करें।`
  },
  empty_response: {
    title: "उत्तर नहीं मिल सका",
    body: provider => `${provider} ने इस संदेश का कोई उत्तर नहीं लौटाया। थोड़ी देर में फिर कोशिश करें।`
  },
  loop_error: {
    title: "{app_name} यह चरण पूरा नहीं कर सका",
    body: "उत्तर संभालते समय समस्या हुई। फिर कोशिश करें; दोबारा हो तो विवरण से निदान भेजें।"
  },
  SESSION_OWNER_BUSY: {
    title: "इस चैट में {app_name} व्यस्त है",
    body: "यहाँ दूसरा चरण चल रहा है और संदेश उसकी कतार में नहीं जुड़ सका। कुछ भेजा नहीं गया। चरण समाप्त होने पर फिर कोशिश करें।"
  },
  cron_session_read_only: {
    title: "यह चैट निर्धारित कार्य की है",
    body: "इसमें केवल वही कार्य चलता है, इसलिए आपका संदेश नहीं चला। भेजने के लिए नई चैट शुरू करें।"
  },
  session_read_only: {
    title: "यह चैट केवल पढ़ने योग्य है",
    body: "यह सहेजा इतिहास है जिसे {app_name} दिखा सकता है, आगे नहीं बढ़ा सकता; इसलिए संदेश नहीं चला। भेजने के लिए नई चैट शुरू करें।"
  },
  workspace_unavailable: {
    title: "इस चैट का फ़ोल्डर गायब है",
    body: "चैट का कार्य फ़ोल्डर हटाया या स्थानांतरित हुआ, इसलिए संदेश नहीं चला। फ़ोल्डर फिर बनाएँ या प्रोजेक्ट में ले जाएँ से दूसरा फ़ोल्डर दें, फिर कोशिश करें।"
  },
  launch_credentials_unavailable: {
    title: "इस चैट की API कुंजी बदल गई",
    body: "जिस API कुंजी से चैट शुरू हुई वह बदल गई या हट गई, इसलिए संदेश नहीं भेजा गया। खुली चैट स्वयं दूसरी कुंजी पर नहीं जाती। वर्तमान कुंजी उपयोग करने के लिए नया सत्र शुरू करें।"
  },
  local_runtime_unavailable: {
    title: "स्थानीय मॉडल सर्वर तक नहीं पहुँच सकते",
    body: "स्थानीय मॉडल सर्वर अभी सेवा नहीं दे रहा: शायद शुरू हो रहा हो। थोड़ी देर में फिर कोशिश करें या दूसरा मॉडल चुनें।",
    bodyNoRetry:
      "स्थानीय मॉडल सर्वर बंद है। {app_name} डेस्कटॉप ऐप या टर्मिनल में `noone model` से शुरू करें, या दूसरा मॉडल चुनें।"
  },
  SESSION_OWNER_UNCONFIRMED: {
    title: "आपका संदेश शायद पहले से कतार में हो",
    body: "गेटवे ने समय पर संदेश की पुष्टि नहीं की। कतार में हो तो पिछला चरण समाप्त या हल होने पर चलेगा। फिर भेजने से पहले चैट जाँचें।"
  },
  agent_init_failed: {
    title: "यह चैट शुरू नहीं हो सकी",
    body: provider =>
      `${appText('{app_name}')} इस चैट के लिए ${provider} से जुड़ नहीं सका। फिर कोशिश करें; बार-बार विफल हो तो सेटिंग्स में प्रदाता जाँचें।`
  },
  SESSION_NOT_OWNED: {
    title: "चैट कहीं और खुली है",
    body: "यह चैट दूसरी {app_name} विंडो या टर्मिनल में खुली है। यहाँ नई चैट शुरू करें या पहले वहाँ बंद करें।"
  },
  disk_full: {
    title: "आपकी डिस्क भर गई",
    body: "{app_name} यह बातचीत सहेज नहीं सका। जगह खाली करें, फिर कोशिश करें।"
  },
  // Nous free tier. The body is normally the backend's own sentence (it names the wait
  // and the way forward); these bodies stand in for an older backend that sent none.
  free_tier_disabled: {
    title: "चैट जारी रखने के लिए साइन इन करें",
    body: "चैट जारी रखने के लिए Nous खाते से साइन इन करें, यह मुफ़्त है।"
  },
  free_tier_rate_limited: {
    title: "मुफ़्त कोटा समाप्त",
    body: "जल्दी रीफ़्रेश होगा। बड़े कोटे के लिए Nous खाते से साइन इन करें, यह मुफ़्त है।"
  },
  free_tier_at_capacity: {
    title: "मुफ़्त स्तर व्यस्त है",
    body: "कतार छोड़ने के लिए साइन इन करें, यह मुफ़्त है; या थोड़ी देर में फिर कोशिश करें।"
  },
  free_tier_model_not_free: {
    title: "इस मॉडल के लिए साइन-इन चाहिए",
    body: "अभी {app_name} मुफ़्त मॉडल उपयोग करता है। अधिक मॉडल के लिए Nous खाते से साइन इन करें, यह मुफ़्त है।"
  },
  free_tier_route: {
    title: "मुफ़्त मॉडल तक नहीं पहुँच सकते",
    body: "Nous खाते से साइन इन करें, यह मुफ़्त है, या NOUS_INFERENCE_BASE_URL सेटिंग जाँचें।"
  },
  free_tier_outage: {
    title: "मुफ़्त मॉडल में समस्या है",
    body: "एक मिनट में संदेश फिर भेजें।"
  },
  free_tier_refused: {
    title: "चैट जारी रखने के लिए साइन इन करें",
    body: "Nous खाते से साइन इन करना मुफ़्त है।"
  },
  usage_window: {
    title: "शामिल उपयोग समाप्त",
    body: "रीसेट तक आपकी योजना का शामिल उपयोग समाप्त है। जारी रखने के लिए /topup से क्रेडिट जोड़ें।"
  }
}
