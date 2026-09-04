import { SupportedLanguage } from '../types/user';
import { TranslationKeys } from './types';
import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string; // Native name
  englishName: string;
  speechCode: string; // BCP-47 for Web Speech API
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', englishName: 'English', speechCode: 'en-IN' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', speechCode: 'hi-IN' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', speechCode: 'ta-IN' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', speechCode: 'te-IN' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', speechCode: 'bn-IN' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', speechCode: 'mr-IN' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', speechCode: 'kn-IN' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', speechCode: 'ml-IN' },
  { code: 'or', name: 'ଓଡ଼ିଆ', englishName: 'Odia', speechCode: 'or-IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', speechCode: 'pa-IN' },
];

// Helper to create language dictionary with English defaults
const createLocale = (overrides: Partial<TranslationKeys>): TranslationKeys => ({
  ...en,
  ...overrides,
  nav: { ...en.nav, ...(overrides.nav || {}) },
  sources: { ...en.sources, ...(overrides.sources || {}) },
  riskLevels: { ...en.riskLevels, ...(overrides.riskLevels || {}) },
  dashboard: { ...en.dashboard, ...(overrides.dashboard || {}) },
  emergency: { ...en.emergency, ...(overrides.emergency || {}) },
  agriculture: { ...en.agriculture, ...(overrides.agriculture || {}) },
  travel: { ...en.travel, ...(overrides.travel || {}) },
  weathergpt: { ...en.weathergpt, ...(overrides.weathergpt || {}) },
  demoMode: { ...en.demoMode, ...(overrides.demoMode || {}) },
  offline: { ...en.offline, ...(overrides.offline || {}) },
});

// Telugu (తెలుగు)
const te = createLocale({
  appName: "WeatherGPT (వెదర్‌జిపిటి)",
  tagline: "వాతావరణాన్ని అర్థం చేసుకోండి. ప్రమాదాన్ని అంచనా వేయండి. సురక్షితంగా ఉండండి.",
  nav: {
    dashboard: "డాష్‌బోర్డ్",
    weathergpt: "వెదర్‌జిపిటి AI",
    forecast: "వాతావరణ సూచన",
    alerts: "హెచ్చరికలు",
    map: "వాతావరణ పటం",
    history: "చరిత్ర పోకడలు",
    agriculture: "వ్యవసాయ సలహా",
    travel: "ప్రయాణ వాతావరణం",
    emergency: "🚨 అత్యవసర సహాయం",
    analytics: "విశ్లేషణలు",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్‌లు"
  },
  emergency: {
    title: "🚨 అత్యవసర విపత్తు ప్రతిస్పందన",
    sosHeader: "తీవ్రమైన వాతావరణ అత్యవసర ప్రోటోకాల్",
    subtitle: "ధృవీకరించబడిన అత్యవసర నంబర్లు మరియు GPS స్థాన భాగస్వామ్యం.",
    callEmergencyServices: "అత్యవసర కాల్ (112)",
    shareLocation: "నా GPS లొకేషన్ పంచుకోండి",
    locationSharedCopied: "GPS స్థానం కాపీ చేయబడింది!",
    helplinesTitle: "అధికారిక హెల్ప్‌లైన్ నంబర్లు",
    preparednessChecklists: "భద్రతా తనిఖీ జాబితా",
    sheltersTitle: "సహాయ పునరావాస కేంద్రాలు",
    ndrfHelpline: "NDRF విపత్తు సహాయం: 1078",
    police: "పోలీస్: 100 / 112",
    ambulance: "అంబులెన్స్: 108",
    fireService: "అగ్నిమాపక దళం: 101",
    stateDisasterHelpline: "రాష్ట్ర విపత్తు నిర్వహణ: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI అసిస్టెంట్",
    assistantTagline: "అధికారిక IMD వాతావరణ ఆధారిత సహాయకుడు.",
    quickPromptsTitle: "శీఘ్ర ప్రశ్నలు",
    askPlaceholder: "తెలుగులో లేదా ఇంగ్లీషులో అడగండి...",
    sendButton: "అడగండి",
    voiceButton: "వాయిస్ ఇన్‌పుట్",
    summary: "వాతావరణ సారాంశం",
    confidence: "విశ్వసనీయత",
    risk: "ప్రమాద స్థాయి",
    recommendation: "సూచనలు",
    location: "ప్రదేశం",
    validTime: "చెల్లుబాటు సమయం",
    source: "మూలం",
    listening: "వింటోంది... మాట్లాడండి",
    speechNotSupported: "వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు."
  }
});

// Bengali (বাংলা)
const bn = createLocale({
  appName: "WeatherGPT (ওয়েদারজিপিটি)",
  tagline: "আবহাওয়া বুঝুন। ঝুঁকি পূর্বাভাস করুন। নিরাপদে থাকুন।",
  nav: {
    dashboard: "ড্যাশবোর্ড",
    weathergpt: "ওয়েদারজিপিটি AI",
    forecast: "আবহাওয়ার পূর্বাভাস",
    alerts: "সতর্কবার্তা",
    map: "আবহাওয়া মানচিত্র",
    history: "পূর্ববর্তী রেকর্ড",
    agriculture: "কৃষি আবহাওয়া পরামর্শ",
    travel: "ভ্রমণ আবহাওয়া",
    emergency: "🚨 জরুরি সহায়তা (SOS)",
    analytics: "পরিসংখ্যান",
    profile: "প্রোফাইল",
    settings: "সেটিংস"
  },
  emergency: {
    title: "🚨 জরুরি দুর্যোগ প্রতিক্রিয়া পোর্টাল",
    sosHeader: "জরুরি আবহাওয়া সুরক্ষা প্রোটোকল",
    subtitle: "যাচাইকৃত হেল্পলাইন নম্বর এবং তাৎক্ষণিক GPS অবস্থান শেয়ার।",
    callEmergencyServices: "জরুরি সেবা কল করুন (112)",
    shareLocation: "আমার GPS অবস্থান শেয়ার করুন",
    locationSharedCopied: "GPS অবস্থান কপি করা হয়েছে!",
    helplinesTitle: "অফিসিয়াল জরুরি নম্বর",
    preparednessChecklists: "দুর্যোগ প্রস্তুতি তালিকা",
    sheltersTitle: "নিকটবর্তী আশ্রয় কেন্দ্র",
    ndrfHelpline: "NDRF দুর্যোগ উদ্ধার: 1078",
    police: "পুলিশ: 100 / 112",
    ambulance: "অ্যাম্বুলেন্স: 108",
    fireService: "দমকল বাহিনী: 101",
    stateDisasterHelpline: "রাজ্য দুর্যোগ ব্যবস্থাপনা: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI সহকারী",
    assistantTagline: "সরকারি IMD তথ্য এবং লাইভ পূর্বাভাসের উপর ভিত্তি করে।",
    quickPromptsTitle: "দ্রুত আবহাওয়া প্রশ্ন",
    askPlaceholder: "বাংলায় বা ইংরেজিতে জিজ্ঞাসা করুন...",
    sendButton: "জিজ্ঞাসা করুন",
    voiceButton: "ভয়েস ইনপুট",
    summary: "আবহাওয়া সারসংক্ষেপ",
    confidence: "নির্ভরযোগ্যতা",
    risk: "ঝুঁকির মাত্রা",
    recommendation: "প্রয়োজনীয় সতর্কতা",
    location: "অবস্থান",
    validTime: "সময়সীমা",
    source: "উৎস",
    listening: "শুনছি... বলুন",
    speechNotSupported: "ভয়েস সমর্থন নেই।"
  }
});

// Marathi (मराठी)
const mr = createLocale({
  appName: "WeatherGPT (वेदरजीपीटी)",
  tagline: "हवामान समजून घ्या. जोखमीचा अंदाज लावा. सुरक्षित राहा.",
  nav: {
    dashboard: "डॅशबोर्ड",
    weathergpt: "वेदरजीपीटी AI",
    forecast: "हवामान अंदाज",
    alerts: "इशारे व चेतावणी",
    map: "हवामान नकाशा",
    history: "मागील कल",
    agriculture: "कृषी हवामान सल्ला",
    travel: "प्रवास हवामान",
    emergency: "🚨 आपत्कालीन मदत (SOS)",
    analytics: "विश्लेषण",
    profile: "प्रोफाइल",
    settings: "सेटिंग्ज"
  },
  emergency: {
    title: "🚨 आपत्कालीन निवारण कक्ष",
    sosHeader: "गंभीर हवामान आपत्कालीन सुरक्षा प्रोटोकॉल",
    subtitle: "अधिकृत आपत्कालीन संपर्क आणि त्वरित जीपीएस स्थान शेअरिंग.",
    callEmergencyServices: "आपत्कालीन कॉल करा (112)",
    shareLocation: "माझे GPS स्थान शेअर करा",
    locationSharedCopied: "स्थान कॉपी केले!",
    helplinesTitle: "अधिकृत आपत्कालीन क्रमांक",
    preparednessChecklists: "सुरक्षा चेकलिस्ट",
    sheltersTitle: "जवळचे निवारा केंद्र",
    ndrfHelpline: "NDRF आपत्ती निवारण: 1078",
    police: "पोलीस: 100 / 112",
    ambulance: "रुग्णवाहिका: 108",
    fireService: "अग्निशामक दल: 101",
    stateDisasterHelpline: "राज्य आपत्ती व्यवस्थापन: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI सहाय्यक",
    assistantTagline: "IMD आणि लाईव्ह हवामान डेटावर आधारित.",
    quickPromptsTitle: "हवामान प्रश्न",
    askPlaceholder: "मराठीत किंवा इंग्रजीत विचारा...",
    sendButton: "विचारा",
    voiceButton: "आवाज",
    summary: "हवामान सारांश",
    confidence: "अंदाजाची खात्री",
    risk: "धोका पातळी",
    recommendation: "सुरक्षा उपाय",
    location: "स्थान",
    validTime: "वेळ",
    source: "स्रोत",
    listening: "ऐकत आहे... बोला",
    speechNotSupported: "व्हॉइस उपलब्ध नाही."
  }
});

// Gujarati (ગુજરાતી)
const gu = createLocale({
  appName: "WeatherGPT (વેધરજીપીટી)",
  tagline: "હવામાન સમજો. જોખમની આગાહી કરો. સુરક્ષિત રહો.",
  nav: {
    dashboard: "ડેશબોર્ડ",
    weathergpt: "વેધરજીપીટી AI",
    forecast: "હવામાન આગાહી",
    alerts: "ચેતવણીઓ",
    map: "હવામાન નકશો",
    history: "ઇતિહાસ",
    agriculture: "કૃષિ હવામાન માર્ગદર્શન",
    travel: "મુસાફરી હવામાન",
    emergency: "🚨 કટોકટી સહાય",
    analytics: "વિશ્લેષણ",
    profile: "પ્રોફાઇલ",
    settings: "સેટિંગ્સ"
  },
  emergency: {
    title: "🚨 કટોકટી આપત્તિ રાહત પોર્ટલ",
    sosHeader: "ગંભીર હવામાન કટોકટી પ્રોટોકોલ",
    subtitle: "ચકાસાયેલ કટોકટી સંપર્કો અને જીપીએસ લોકેશન શેરિંગ.",
    callEmergencyServices: "કટોકટી કૉલ કરો (112)",
    shareLocation: "મારું GPS લોકેશન શેર કરો",
    locationSharedCopied: "સ્થાન કૉપિ કર્યું!",
    helplinesTitle: "સત્તાવાર હેલ્પલાઇન નંબરો",
    preparednessChecklists: "સુરક્ષા ચેકલિસ્ટ",
    sheltersTitle: "નજીકના રાહત આશ્રયસ્થાનો",
    ndrfHelpline: "NDRF આપત્તિ રાહત: 1078",
    police: "પોલીસ: 100 / 112",
    ambulance: "એમ્બ્યુલન્સ: 108",
    fireService: "ફાયર બ્રિગેડ: 101",
    stateDisasterHelpline: "રાજ્ય આપત્તિ વ્યવસ્થાપન: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI સહાયક",
    assistantTagline: "IMD અને લાઇવ હવામાન ડેટા પર આધારિત.",
    quickPromptsTitle: "હવામાન પ્રશ્નો",
    askPlaceholder: "ગુજરાતી અથવા અંગ્રેજીમાં પૂછો...",
    sendButton: "પૂછો",
    voiceButton: "અવાજ ઇનપુટ",
    summary: "હવામાન સારાંશ",
    confidence: "વિશ્વસનીયતા",
    risk: "જોખમ સ્તર",
    recommendation: "સાવચેતીનાં પગલાં",
    location: "સ્થાન",
    validTime: "સમયગાળો",
    source: "સ્ત્રોત",
    listening: "સાંભળી રહ્યા છીએ... બોલો",
    speechNotSupported: "વોઇસ સપોર્ટ નથી."
  }
});

// Kannada (ಕನ್ನಡ)
const kn = createLocale({
  appName: "WeatherGPT (ವೆದರ್‌ಜಿಪಿಟಿ)",
  tagline: "ಹವಾಮಾನವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಅಪಾಯವನ್ನು ಊಹಿಸಿ. ಸುರಕ್ಷಿತವಾಗಿರಿ.",
  nav: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    weathergpt: "ವೆದರ್‌ಜಿಪಿಟಿ AI",
    forecast: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    alerts: "ಎಚ್ಚರಿಕೆಗಳು",
    map: "ಹವಾಮಾನ ನಕ್ಷೆ",
    history: "ಹಿಂದಿನ ಪ್ರವೃತ್ತಿಗಳು",
    agriculture: "ಕೃಷಿ ಹವಾಮಾನ ಸಲಹೆ",
    travel: "ಪ್ರಯಾಣ ಹವಾಮಾನ",
    emergency: "🚨 ತುರ್ತು ನೆರವು (SOS)",
    analytics: "ವಿಶ್ಲೇಷಣೆ",
    profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"
  },
  emergency: {
    title: "🚨 ತುರ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಪೋರ್ಟಲ್",
    sosHeader: "ತೀವ್ರ ಹವಾಮಾನ ತುರ್ತು ಸುರಕ್ಷತಾ ಪ್ರೋಟೋಕಾಲ್",
    subtitle: "ದೃಢೀಕರಿಸಿದ ತುರ್ತು ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಜಿಪಿಎಸ್ ಸ್ಥಳ ಹಂಚಿಕೆ.",
    callEmergencyServices: "ತುರ್ತು ಕರೆ ಮಾಡಿ (112)",
    shareLocation: "ನನ್ನ GPS ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ",
    locationSharedCopied: "ಸ್ಥಳ ನಕಲಿಸಲಾಗಿದೆ!",
    helplinesTitle: "ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಗಳು",
    preparednessChecklists: "ಸುರಕ್ಷತಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    sheltersTitle: "ಹತ್ತಿರದ ಆಶ್ರಯ ತಾಣಗಳು",
    ndrfHelpline: "NDRF ವಿಪತ್ತು ರಕ್ಷಣೆ: 1078",
    police: "ಪೊಲೀಸ್: 100 / 112",
    ambulance: "ಆಂಬ್ಯುಲೆನ್ಸ್: 108",
    fireService: "ಅಗ್ನಿಶಾಮಕ ದಳ: 101",
    stateDisasterHelpline: "ರಾಜ್ಯ ವಿಪತ್ತು ನಿರ್ವಹಣೆ: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI ಸಹಾಯಕ",
    assistantTagline: "IMD ಮತ್ತು ನೇರ ಹವಾಮಾನ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ.",
    quickPromptsTitle: "ತ್ವರಿತ ಹವಾಮಾನ ಪ್ರಶ್ನೆಗಳು",
    askPlaceholder: "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ...",
    sendButton: "ಕೇಳಿ",
    voiceButton: "ಧ್ವನಿ ಇನ್ಪುಟ್",
    summary: "ಹವಾಮಾನ ಸಾರಾಂಶ",
    confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    risk: "ಅಪಾಯ ಮಟ್ಟ",
    recommendation: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು",
    location: "ಸ್ಥಳ",
    validTime: "ಮಾನ್ಯ ಸಮಯ",
    source: "ಮೂಲ",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    speechNotSupported: "ಧ್ವನಿ ಬೆಂಬಲ ಲಭ್ಯವಿಲ್ಲ."
  }
});

// Malayalam (മലയാളം)
const ml = createLocale({
  appName: "WeatherGPT (വെതർജിപിടി)",
  tagline: "കാലാവസ്ഥ മനസ്സിലാക്കുക. അപകടം മുൻകൂട്ടി കാണുക. സുരക്ഷിതരായിരിക്കുക.",
  nav: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    weathergpt: "വെതർജിപിടി AI",
    forecast: "കാലാവസ്ഥാ പ്രവചനം",
    alerts: "മുന്നറിയിപ്പുകൾ",
    map: "കാലാവസ്ഥാ ഭൂപടം",
    history: "ചരിത്ര രേഖകൾ",
    agriculture: "കാർഷിക കാലാവസ്ഥാ നിർദ്ദേശങ്ങൾ",
    travel: "യാത്രാ കാലാവസ്ഥ",
    emergency: "🚨 അടിയന്തര സഹായം (SOS)",
    analytics: "സ്ഥിതിവിവരക്കണക്കുകൾ",
    profile: "പ്രൊഫൈൽ",
    settings: "ക്രമീകരണങ്ങൾ"
  },
  emergency: {
    title: "🚨 അടിയന്തര ദുരന്ത നിവാരണ പോർട്ടൽ",
    sosHeader: "തീവ്ര കാലാവസ്ഥാ അടിയന്തര സുരക്ഷാ പ്രോട്ടോക്കോൾ",
    subtitle: "ഔദ്യോഗിക അടിയന്തര നമ്പറുകളും ജി.പി.എസ് ലൊക്കേഷൻ പങ്കിടലും.",
    callEmergencyServices: "അടിയന്തര സേവനങ്ങളെ വിളിക്കുക (112)",
    shareLocation: "എന്റെ GPS ലൊക്കേഷൻ പങ്കിടുക",
    locationSharedCopied: "ലൊക്കേഷൻ കോപ്പി ചെയ്തു!",
    helplinesTitle: "ഔദ്യോഗിക ഹെൽപ്പ്‌ലൈൻ നമ്പറുകൾ",
    preparednessChecklists: "സുരക്ഷാ ചെക്ക്‌ലിസ്റ്റ്",
    sheltersTitle: "സമീപ ദുരിതാശ്വാസ ക്യാമ്പുകൾ",
    ndrfHelpline: "NDRF ദുരന്ത നിവാരണം: 1078",
    police: "പോലീസ്: 100 / 112",
    ambulance: "ആംബുലൻസ്: 108",
    fireService: "ഫയർ ഫോഴ്സ്: 101",
    stateDisasterHelpline: "സംസ്ഥാന ദുരന്ത നിവാരണം: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI സഹായി",
    assistantTagline: "ഔദ്യോഗിക കാലാവസ്ഥാ നിരീക്ഷണ കേന്ദ്രം (IMD) അടിസ്ഥാനമാക്കിയത്.",
    quickPromptsTitle: "കാലാവസ്ഥാ ചോദ്യങ്ങൾ",
    askPlaceholder: "മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ചോദിക്കൂ...",
    sendButton: "ചോദിക്കൂ",
    voiceButton: "വോയ്‌സ് ഇൻപുട്ട്",
    summary: "കാലാവസ്ഥാ സംഗ്രഹം",
    confidence: "കൃത്യത",
    risk: "അപകട നില",
    recommendation: "മുൻകരുതലുകൾ",
    location: "സ്ഥലം",
    validTime: "സാധുതയുള്ള സമയം",
    source: "ഉറവിടം",
    listening: "കേൾക്കുന്നു... സംസാരിക്കൂ",
    speechNotSupported: "വോയ്‌സ് പിന്തുണ ലഭ്യമല്ല."
  }
});

// Odia (ଓଡ଼ିଆ)
const orLocale = createLocale({
  appName: "WeatherGPT (ୱେଦରଜିପିଟି)",
  tagline: "ପାଣିପାଗ ବୁଝନ୍ତୁ। ବିପଦ ପୂର୍ବାନୁମାନ କରନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।",
  nav: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    weathergpt: "ୱେଦରଜିପିଟି AI",
    forecast: "ପାଣିପାଗ ପୂର୍ବାନୁମାନ",
    alerts: "ସତର୍କତା ସୂଚନା",
    map: "ପାଣିପାଗ ମାନଚିତ୍ର",
    history: "ପୂର୍ବ ତଥ୍ୟ",
    agriculture: "କୃଷି ପାଣିପାଗ ପରାମର୍ଶ",
    travel: "ଯାତ୍ରା ପାଣିପାଗ",
    emergency: "🚨 ଜରୁରୀକାଳୀନ ସହାୟତା",
    analytics: "ବିଶ୍ଳେଷଣ",
    profile: "ପ୍ରୋଫାଇଲ",
    settings: "ସେଟିଙ୍ଗ୍ସ"
  },
  emergency: {
    title: "🚨 ଜରୁରୀକାଳୀନ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପୋର୍ଟାଲ",
    sosHeader: "ତୀବ୍ର ପାଣିପାଗ ସୁରକ୍ଷା ନିୟମାବଳୀ",
    subtitle: "ଯାଞ୍ଚ ହୋଇଥିବା ଜରୁରୀକାଳୀନ ନମ୍ବର ଏବଂ GPS ଲୋକେସନ ସେୟାର।",
    callEmergencyServices: "ଜରୁରୀକାଳୀନ କଲ୍ କରନ୍ତୁ (112)",
    shareLocation: "ମୋ GPS ଲୋକେସନ ସେୟାର କରନ୍ତୁ",
    locationSharedCopied: "GPS କପି ହୋଇଛି!",
    helplinesTitle: "ଅଫିସିଆଲ୍ ହେଲ୍ପଲାଇନ୍ ନମ୍ବର",
    preparednessChecklists: "ସୁରକ୍ଷା ଚେକଲିଷ୍ଟ",
    sheltersTitle: "ନିକଟସ୍ଥ ବାତ୍ୟା ଓ ବନ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀ",
    ndrfHelpline: "NDRF ବିପର୍ଯ୍ୟୟ ଉଦ୍ଧାର: 1078",
    police: "ପୋଲିସ: 100 / 112",
    ambulance: "ଆମ୍ବୁଲାନ୍ସ: 108",
    fireService: "ଅଗ୍ନିଶମ ବାହିନୀ: 101",
    stateDisasterHelpline: "ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI ସହାୟକ",
    assistantTagline: "IMD ତଥ୍ୟ ଏବଂ ଲାଇଭ ପାଣିପାଗ ଉପରେ ଆଧାରିତ।",
    quickPromptsTitle: "ପାଣିପାଗ ପ୍ରଶ୍ନ",
    askPlaceholder: "ଓଡ଼ିଆ କିମ୍ବା ଇଂରାଜୀରେ ପଚାରନ୍ତୁ...",
    sendButton: "ପଚାରନ୍ତୁ",
    voiceButton: "ଭଏସ୍ ଇନପୁଟ୍",
    summary: "ପାଣିପାଗ ସାରାଂଶ",
    confidence: "ବିଶ୍ୱସନୀୟତା",
    risk: "ବିପଦ ସ୍ତର",
    recommendation: "ପଦକ୍ଷେପ",
    location: "ସ୍ଥାନ",
    validTime: "ସମୟ",
    source: "ଉତ୍ସ",
    listening: "ଶୁଣୁଛି... କୁହନ୍ତୁ",
    speechNotSupported: "ଭଏସ୍ ସମର୍ଥିତ ନୁହେଁ।"
  }
});

// Punjabi (ਪੰਜਾਬੀ)
const pa = createLocale({
  appName: "WeatherGPT (ਵੈਦਰਜੀਪੀਟੀ)",
  tagline: "ਮੌਸਮ ਨੂੰ ਸਮਝੋ। ਖ਼ਤਰੇ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ। ਸੁਰੱਖਿਅਤ ਰਹੋ।",
  nav: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    weathergpt: "ਵੈਦਰਜੀਪੀਟੀ AI",
    forecast: "ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ",
    alerts: "ਚੇਤਾਵਨੀਆਂ",
    map: "ਮੌਸਮ ਦਾ ਨਕਸ਼ਾ",
    history: "ਪੁਰਾਣੇ ਰਿਕਾਰਡ",
    agriculture: "ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਸਲਾਹ",
    travel: "ਸਫ਼ਰ ਮੌਸਮ",
    emergency: "🚨 ਐਮਰਜੈਂਸੀ ਮਦਦ (SOS)",
    analytics: "ਅੰਕੜੇ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    settings: "ਸੈਟਿੰਗਾਂ"
  },
  emergency: {
    title: "🚨 ਐਮਰਜੈਂਸੀ ਆਫ਼ਤ ਰਾਹਤ ਪੋਰਟਲ",
    sosHeader: "ਗੰਭੀਰ ਮੌਸਮ ਸੁਰੱਖਿਆ ਨਿਯਮ",
    subtitle: "ਅਧਿਕਾਰਤ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ ਅਤੇ ਤੁਰੰਤ GPS ਸਥਿਤੀ ਸ਼ੇਅਰ ਕਰੋ।",
    callEmergencyServices: "ਐਮਰਜੈਂਸੀ ਕਾਲ ਕਰੋ (112)",
    shareLocation: "ਮੇਰੀ GPS ਸਥਿਤੀ ਸਾਂਝੀ ਕਰੋ",
    locationSharedCopied: "GPS ਸਥਿਤੀ ਕਾਪੀ ਹੋ ਗਈ!",
    helplinesTitle: "ਅਧਿਕਾਰਤ ਹੈਲਪਲਾਈਨ ਨੰਬਰ",
    preparednessChecklists: "ਸੁਰੱਖਿਆ ਚੈੱਕਲਿਸਟ",
    sheltersTitle: "ਨੇੜਲੇ ਰਾਹਤ ਕੈਂਪ",
    ndrfHelpline: "NDRF ਆਫ਼ਤ ਰਾਹਤ: 1078",
    police: "ਪੁਲਿਸ: 100 / 112",
    ambulance: "ਐਂਬੂਲੈਂਸ: 108",
    fireService: "ਫਾਇਰ ਬ੍ਰਿਗੇਡ: 101",
    stateDisasterHelpline: "ਰਾਜ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ: 1070"
  },
  weathergpt: {
    assistantTitle: "WeatherGPT AI ਸਹਾਇਕ",
    assistantTagline: "ਸਰਕਾਰੀ IMD ਮੌਸਮ ਵਿਭਾਗ ਦੇ ਅੰਕੜਿਆਂ 'ਤੇ ਅਧਾਰਤ।",
    quickPromptsTitle: "ਮੌਸਮ ਦੇ ਸਵਾਲ",
    askPlaceholder: "ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੁੱਛੋ...",
    sendButton: "ਪੁੱਛੋ",
    voiceButton: "ਆਵਾਜ਼ ਇਨਪੁਟ",
    summary: "ਮੌਸਮ ਸਾਰ",
    confidence: "ਭਰੋਸੇਯੋਗਤਾ",
    risk: "ਖ਼ਤਰਾ ਪੱਧਰ",
    recommendation: "ਸਾਵਧਾਨੀਆਂ",
    location: "ਸਥਾਨ",
    validTime: "ਵੈਧ ਸਮਾਂ",
    source: "ਸਰੋਤ",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਬੋਲੋ",
    speechNotSupported: "ਵਾਇਸ ਸਹਾਇਤਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।"
  }
});

export const translations: Record<SupportedLanguage, TranslationKeys> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
  gu,
  kn,
  ml,
  or: orLocale,
  pa,
};

export function getTranslation(lang: SupportedLanguage): TranslationKeys {
  return translations[lang] || en;
}
