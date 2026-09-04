import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuickActionChipsProps {
  onSelectQuery: (query: string) => void;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelectQuery }) => {
  const { language } = useLanguage();

  const getChips = () => {
    if (language === 'ta') {
      return [
        { label: '☂️ இன்று மழை பெய்யுமா?', query: 'இன்று மழை பெய்யுமா? நான் குடை எடுத்துச் செல்ல வேண்டுமா?' },
        { label: '🌡️ வெப்பம் அதிகமாக உள்ளதா?', query: 'இன்று வெப்பம் அதிகமாக உள்ளதா? வெயில் எப்படி இருக்கும்?' },
        { label: '🚗 பயணம் செய்வது பாதுகாப்பானதா?', query: 'இன்று பயணம் செய்வது பாதுகாப்பானதா? வழியில் ஏதேனும் ஆபத்து உள்ளதா?' },
        { label: '🌾 விவசாய நீர்ப்பாசன ஆலோசனை', query: 'விவசாயத்திற்கான நீர்ப்பாசனம் மற்றும் மருந்து தெளிப்பு ஆலோசனைகள் என்ன?' },
        { label: '🏃 கிரிக்கெட் விளையாடலாமா?', query: 'இன்று வெளியில் கிரிக்கெட் விளையாட அல்லது உடற்பயிற்சி செய்ய உகந்ததா?' },
        { label: '⚠️ தீவிர எச்சரிக்கைகள் ஏதேனும் உள்ளதா?', query: 'எனது பகுதிக்கு அதிகாரப்பூர்வ வானிலை எச்சரிக்கை ஏதேனும் உள்ளதா?' },
        { label: '🌪️ புயல் அல்லது காற்று ஆபத்து?', query: 'இங்கு புயல் அல்லது பலத்த காற்று வீசும் ஆபத்து உள்ளதா?' },
        { label: '📅 வார இறுதி வானிலை எப்படி?', query: 'இந்த வார இறுதியில் வானிலை நிலவரம் எவ்வாறு இருக்கும்?' },
      ];
    }

    if (language === 'hi') {
      return [
        { label: '☂️ क्या आज बारिश होगी?', query: 'क्या आज बारिश होगी? क्या मुझे छाता ले जाना चाहिए?' },
        { label: '🌡️ क्या बहुत गर्मी है?', query: 'क्या आज अत्यधिक गर्मी या लू का प्रकोप रहेगा?' },
        { label: '🚗 क्या यात्रा करना सुरक्षित है?', query: 'क्या आज यात्रा करना सुरक्षित है? सड़क पर क्या जोखिम है?' },
        { label: '🌾 कृषि मौसम एवं सिंचाई सलाह', query: 'किसानों के लिए सिंचाई और कीटनाशक छिड़काव की क्या सलाह है?' },
        { label: '🏃 क्या आज क्रिकेट खेल सकते हैं?', query: 'क्या आज बाहर क्रिकेट खेलना या दौड़ना उपयुक्त है?' },
        { label: '⚠️ क्या कोई चेतावनी जारी है?', query: 'क्या मेरे क्षेत्र के लिए कोई आधिकारिक मौसम चेतावनी है?' },
        { label: '🌪️ आंधी-तूफान का क्या जोखिम है?', query: 'क्या चक्रवात या आंधी-तूफान का कोई खतरा है?' },
        { label: '📅 सप्ताहांत का मौसम कैसा रहेगा?', query: 'इस वीकेंड का मौसम पूर्वानुमान क्या है?' },
      ];
    }

    // Default English
    return [
      { label: '☂️ Will it rain today?', query: 'Will it rain today? Should I carry an umbrella?' },
      { label: '🌡️ Is it too hot outside?', query: 'Is it too hot outside? What is the thermal risk?' },
      { label: '🚗 Is travel safe right now?', query: 'Is travel safe right now? Any road hazards or delays?' },
      { label: '🌾 Agriculture & Spraying Advice', query: 'What is the irrigation and pesticide spraying guidance for farmers today?' },
      { label: '🏏 Can I play cricket today?', query: 'Can I go play cricket or outdoor sports today?' },
      { label: '⚠️ Any official warnings active?', query: 'Are there any official IMD weather warnings for my area?' },
      { label: '🌪️ Any cyclone or storm risk?', query: 'Is there any cyclone, severe wind, or lightning risk?' },
      { label: '📅 Weekend forecast details', query: 'What is the weather outlook for this weekend?' },
    ];
  };

  const chips = getChips();

  return (
    <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Quick WeatherGPT Inquiries
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">• Click to ask instantly</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuery(chip.query)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-brand-500/40 text-xs font-medium transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
