import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "te" | "hi";

const translations = {
  // Common
  goodMorning: { en: "Good morning ☀️", te: "శుభోదయం ☀️", hi: "सुप्रभात ☀️" },
  goodAfternoon: { en: "Good afternoon 🌤️", te: "శుభ మధ్యాహ్నం 🌤️", hi: "शुभ दोपहर 🌤️" },
  goodEvening: { en: "Good evening 🌙", te: "శుభ సాయంత్రం 🌙", hi: "शुभ संध्या 🌙" },
  investor: { en: "Investor", te: "పెట్టుబడిదారు", hi: "निवेशक" },

  // Home
  totalPortfolio: { en: "Total Portfolio", te: "మొత్తం పోర్ట్‌ఫోలియో", hi: "कुल पोर्टफोलियो" },
  allTime: { en: "all time", te: "మొత్తం", hi: "कुल समय" },
  todaysMarket: { en: "Today's Market", te: "నేటి మార్కెట్", hi: "आज का बाज़ार" },
  liveRefresh: { en: "Live • Auto-refreshes every minute", te: "లైవ్ • ప్రతి నిమిషం రిఫ్రెష్", hi: "लाइव • हर मिनट रिफ्रेश" },
  smartSuggestions: { en: "Smart Suggestions", te: "స్మార్ట్ సూచనలు", hi: "स्मार्ट सुझाव" },
  goalProgress: { en: "Goal Progress", te: "లక్ష్య పురోగతి", hi: "लक्ष्य प्रगति" },
  emergencyFund: { en: "Emergency Fund", te: "అత్యవసర నిధి", hi: "आपातकालीन निधि" },
  recommended: { en: "Recommended", te: "సిఫార్సు", hi: "अनुशंसित" },
  aiPick: { en: "AI Pick", te: "AI ఎంపిక", hi: "AI चयन" },
  new: { en: "New", te: "కొత్త", hi: "नया" },
  sipSuggestion: { en: "Start a SIP in Nifty 50 Index Fund", te: "నిఫ్టీ 50 ఇండెక్స్ ఫండ్‌లో SIP ప్రారంభించండి", hi: "निफ्टी 50 इंडेक्स फंड में SIP शुरू करें" },
  sipDesc: { en: "Low risk • ₹500/month", te: "తక్కువ రిస్క్ • ₹500/నెల", hi: "कम जोखिम • ₹500/माह" },
  diversifySuggestion: { en: "Diversify with a Flexi-Cap Fund", te: "ఫ్లెక్సీ-క్యాప్ ఫండ్‌తో వైవిధ్యం", hi: "फ्लेक्सी-कैप फंड से विविधता" },
  diversifyDesc: { en: "Medium risk • High growth", te: "మధ్యస్థ రిస్క్ • అధిక వృద్ధి", hi: "मध्यम जोखिम • उच्च वृद्धि" },
  goldSuggestion: { en: "Add Gold ETF to your portfolio", te: "మీ పోర్ట్‌ఫోలియోకు గోల్డ్ ETF జోడించండి", hi: "अपने पोर्टफोलियो में गोल्ड ETF जोड़ें" },
  goldDesc: { en: "Hedge against inflation", te: "ద్రవ్యోల్బణానికి వ్యతిరేకంగా", hi: "मुद्रास्फीति से बचाव" },

  // Invest
  invest: { en: "Invest", te: "పెట్టుబడి", hi: "निवेश" },
  liveMarketData: { en: "Live market data", te: "లైవ్ మార్కెట్ డేటా", hi: "लाइव मार्केट डेटा" },
  searchPlaceholder: { en: "Search stocks, ETFs, mutual funds...", te: "స్టాక్స్, ETFs, మ్యూచువల్ ఫండ్స్ శోధించండి...", hi: "स्टॉक्स, ETFs, म्यूचुअल फंड खोजें..." },
  all: { en: "All", te: "అన్నీ", hi: "सभी" },
  stocks: { en: "Stocks", te: "స్టాక్స్", hi: "स्टॉक्स" },
  etfs: { en: "ETFs", te: "ETFs", hi: "ETFs" },
  mutualFunds: { en: "Mutual Funds", te: "మ్యూచువల్ ఫండ్స్", hi: "म्यूचुअल फंड" },
  noResults: { en: "No results found", te: "ఫలితాలు కనుగొనబడలేదు", hi: "कोई परिणाम नहीं" },
  dataDelayed: { en: "Data may be delayed up to 15 minutes", te: "డేటా 15 నిమిషాల వరకు ఆలస్యం కావచ్చు", hi: "डेटा 15 मिनट तक विलंबित हो सकता है" },

  // Portfolio
  portfolio: { en: "Portfolio", te: "పోర్ట్‌ఫోలియో", hi: "पोर्टफोलियो" },
  investmentOverview: { en: "Your investment overview", te: "మీ పెట్టుబడి అవలోకనం", hi: "आपका निवेश अवलोकन" },
  totalValue: { en: "Total Value", te: "మొత్తం విలువ", hi: "कुल मूल्य" },
  invested: { en: "invested", te: "పెట్టుబడి", hi: "निवेशित" },
  growth: { en: "Growth", te: "వృద్ధి", hi: "वृद्धि" },
  allocation: { en: "Allocation", te: "కేటాయింపు", hi: "आवंटन" },
  holdings: { en: "Holdings", te: "హోల్డింగ్స్", hi: "होल्डिंग्स" },
  indexFunds: { en: "Index Funds", te: "ఇండెక్స్ ఫండ్స్", hi: "इंडेक्स फंड" },
  flexiCap: { en: "Flexi-Cap", te: "ఫ్లెక్సీ-క్యాప్", hi: "फ्लेक्सी-कैप" },
  goldEtf: { en: "Gold ETF", te: "గోల్డ్ ETF", hi: "गोल्ड ETF" },
  debtFunds: { en: "Debt Funds", te: "డెట్ ఫండ్స్", hi: "डेट फंड" },

  // Learn
  learn: { en: "Learn", te: "నేర్చుకోండి", hi: "सीखें" },
  buildKnowledge: { en: "Build your financial knowledge", te: "మీ ఆర్థిక జ్ఞానాన్ని పెంచుకోండి", hi: "अपना वित्तीय ज्ञान बढ़ाएं" },
  featured: { en: "Featured", te: "ఫీచర్డ్", hi: "विशेष" },
  investingBeginners: { en: "Investing for Beginners", te: "ఔత్సాహికుల కోసం పెట్టుబడి", hi: "शुरुआती लोगों के लिए निवेश" },
  beginnerGuide: { en: "A complete guide to start your investment journey with just ₹500.", te: "కేవలం ₹500తో మీ పెట్టుబడి ప్రయాణాన్ని ప్రారంభించడానికి పూర్తి గైడ్.", hi: "सिर्फ ₹500 से अपनी निवेश यात्रा शुरू करने की पूरी गाइड।" },
  startLearning: { en: "Start Learning", te: "నేర్చుకోవడం ప్రారంభించండి", hi: "सीखना शुरू करें" },
  stockBasics: { en: "Stock Market Basics", te: "స్టాక్ మార్కెట్ ప్రాథమికాలు", hi: "शेयर बाज़ार की मूल बातें" },
  stockBasicsDesc: { en: "Learn what stocks are and how the market works", te: "స్టాక్స్ అంటే ఏమిటి, మార్కెట్ ఎలా పనిచేస్తుందో తెలుసుకోండి", hi: "जानें स्टॉक क्या हैं और बाज़ार कैसे काम करता है" },
  mf101: { en: "Mutual Funds 101", te: "మ్యూచువల్ ఫండ్స్ 101", hi: "म्यूचुअल फंड 101" },
  mf101Desc: { en: "Understand how mutual funds pool money for investing", te: "మ్యూచువల్ ఫండ్స్ పెట్టుబడి కోసం డబ్బును ఎలా సేకరిస్తాయో అర్థం చేసుకోండి", hi: "समझें कि म्यूचुअल फंड निवेश के लिए पैसा कैसे जुटाते हैं" },
  riskMgmt: { en: "Risk Management", te: "రిస్క్ నిర్వహణ", hi: "जोखिम प्रबंधन" },
  riskMgmtDesc: { en: "How to protect your investments from big losses", te: "మీ పెట్టుబడులను పెద్ద నష్టాల నుండి ఎలా రక్షించుకోవాలి", hi: "अपने निवेश को बड़े नुकसान से कैसे बचाएं" },
  diversification: { en: "Power of Diversification", te: "వైవిధ్యం యొక్క శక్తి", hi: "विविधीकरण की शक्ति" },
  diversificationDesc: { en: "Why putting all eggs in one basket is risky", te: "అన్ని గుడ్లను ఒకే బుట్టలో ఉంచడం ఎందుకు ప్రమాదకరం", hi: "सभी अंडे एक टोकरी में रखना क्यों जोखिम भरा है" },
  sipWay: { en: "SIP: The Smart Way", te: "SIP: స్మార్ట్ మార్గం", hi: "SIP: स्मार्ट तरीका" },
  sipWayDesc: { en: "How systematic investing builds wealth over time", te: "క్రమబద్ధమైన పెట్టుబడి కాలక్రమేణా సంపదను ఎలా నిర్మిస్తుంది", hi: "व्यवस्थित निवेश समय के साथ संपत्ति कैसे बनाता है" },
  topResources: { en: "Top Rated Resources", te: "అత్యుత్తమ వనరులు", hi: "शीर्ष रेटेड संसाधन" },

  // Profile
  profile: { en: "Profile", te: "ప్రొఫైల్", hi: "प्रोफ़ाइल" },
  language: { en: "Language", te: "భాష", hi: "भाषा" },
  darkMode: { en: "Dark Mode", te: "డార్క్ మోడ్", hi: "डार्क मोड" },
  lightMode: { en: "Light Mode", te: "లైట్ మోడ్", hi: "लाइट मोड" },
  privacySecurity: { en: "Privacy & Security", te: "గోప్యత & భద్రత", hi: "गोपनीयता और सुरक्षा" },
  helpSupport: { en: "Help & Support", te: "సహాయం & మద్దతు", hi: "सहायता और समर्थन" },
  signOut: { en: "Sign Out", te: "సైన్ అవుట్", hi: "साइन आउट" },

  // Notifications
  notifications: { en: "Notifications", te: "నోటిఫికేషన్లు", hi: "सूचनाएं" },

  // AI Advisor
  aiAdvisor: { en: "AI Advisor", te: "AI సలహాదారు", hi: "AI सलाहकार" },
  poweredBy: { en: "Powered by StoxMate AI", te: "StoxMate AI ద్వారా", hi: "StoxMate AI द्वारा" },
  askPlaceholder: { en: "Ask about investing...", te: "పెట్టుబడి గురించి అడగండి...", hi: "निवेश के बारे में पूछें..." },

  // Bottom Nav
  home: { en: "Home", te: "హోమ్", hi: "होम" },

  // Risk
  low: { en: "Low", te: "తక్కువ", hi: "कम" },
  medium: { en: "Medium", te: "మధ్యస్థ", hi: "मध्यम" },
  high: { en: "High", te: "అధిక", hi: "उच्च" },

  // Onboarding
  skip: { en: "Skip", te: "దాటవేయండి", hi: "छोड़ें" },
  continue_: { en: "Continue", te: "కొనసాగించు", hi: "जारी रखें" },
  getStarted: { en: "Get Started", te: "ప్రారంభించండి", hi: "शुरू करें" },
  understandMoney: { en: "Understand your money", te: "మీ డబ్బును అర్థం చేసుకోండి", hi: "अपने पैसे को समझें" },
  understandMoneyDesc: { en: "Get a clear picture of your income, expenses, and savings potential with smart analytics.", te: "స్మార్ట్ అనలిటిక్స్‌తో మీ ఆదాయం, ఖర్చులు మరియు పొదుపు సామర్థ్యం గురించి స్పష్టమైన చిత్రాన్ని పొందండి.", hi: "स्मार्ट एनालिटिक्स से अपनी आय, खर्च और बचत क्षमता की स्पष्ट तस्वीर पाएं।" },
  aiInvesting: { en: "AI-powered investing", te: "AI-ఆధారిత పెట్టుబడి", hi: "AI-संचालित निवेश" },
  aiInvestingDesc: { en: "Our AI assistant analyzes markets and recommends investments tailored to your goals.", te: "మా AI అసిస్టెంట్ మార్కెట్లను విశ్లేషిస్తుంది మరియు మీ లక్ష్యాలకు అనుగుణంగా పెట్టుబడులను సిఫార్సు చేస్తుంది.", hi: "हमारा AI सहायक बाज़ारों का विश्लेषण करता है और आपके लक्ष्यों के अनुसार निवेश की सिफारिश करता है।" },
  buildWealth: { en: "Build wealth step by step", te: "అడుగు అడుగున సంపద నిర్మించండి", hi: "कदम दर कदम संपत्ति बनाएं" },
  buildWealthDesc: { en: "Start small and grow your portfolio gradually with guided, diversified investments.", te: "చిన్నగా ప్రారంభించి, మార్గదర్శక, వైవిధ్యభరితమైన పెట్టుబడులతో మీ పోర్ట్‌ఫోలియోను క్రమంగా పెంచుకోండి.", hi: "छोटी शुरुआत करें और निर्देशित, विविध निवेश से अपने पोर्टफोलियो को धीरे-धीरे बढ़ाएं।" },

  // Auth
  welcomeBack: { en: "Welcome back", te: "తిరిగి స్వాగతం", hi: "वापस स्वागत है" },
  createAccount: { en: "Create account", te: "ఖాతా సృష్టించండి", hi: "खाता बनाएं" },
  signUpToStart: { en: "Sign up to start investing", te: "పెట్టుబడి ప్రారంభించడానికి సైన్ అప్ చేయండి", hi: "निवेश शुरू करने के लिए साइन अप करें" },
  signInToContinue: { en: "Sign in to continue", te: "కొనసాగించడానికి సైన్ ఇన్ చేయండి", hi: "जारी रखने के लिए साइन इन करें" },
  email: { en: "Email", te: "ఇమెయిల్", hi: "ईमेल" },
  password: { en: "Password", te: "పాస్‌వర్డ్", hi: "पासवर्ड" },
  signIn: { en: "Sign In", te: "సైన్ ఇన్", hi: "साइन इन" },
  signUp: { en: "Sign Up", te: "సైన్ అప్", hi: "साइन अप" },
  alreadyHaveAccount: { en: "Already have an account? Sign in", te: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి", hi: "पहले से खाता है? साइन इन करें" },
  noAccount: { en: "Don't have an account? Sign up", te: "ఖాతా లేదా? సైన్ అప్ చేయండి", hi: "खाता नहीं है? साइन अप करें" },
  continueWithGoogle: { en: "Continue with Google", te: "Googleతో కొనసాగించండి", hi: "Google से जारी रखें" },
  or: { en: "or", te: "లేదా", hi: "या" },
  investingSimple: { en: "Investing made simple", te: "పెట్టుబడి సులభంగా", hi: "निवेश आसान बनाया" },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations[key]?.en || key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("stoxmate-lang");
    return (stored as Lang) || "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("stoxmate-lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
