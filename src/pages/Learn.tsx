import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, PieChart, Shield, Clock, ChevronRight, ExternalLink, Star, Globe } from "lucide-react";

const topics = [
  {
    icon: TrendingUp,
    title: "Stock Market Basics",
    desc: "Learn what stocks are and how the market works",
    duration: "5 min read",
  },
  {
    icon: PieChart,
    title: "Mutual Funds 101",
    desc: "Understand how mutual funds pool money for investing",
    duration: "4 min read",
  },
  {
    icon: Shield,
    title: "Risk Management",
    desc: "How to protect your investments from big losses",
    duration: "6 min read",
  },
  {
    icon: BookOpen,
    title: "Power of Diversification",
    desc: "Why putting all eggs in one basket is risky",
    duration: "3 min read",
  },
  {
    icon: Clock,
    title: "SIP: The Smart Way",
    desc: "How systematic investing builds wealth over time",
    duration: "4 min read",
  },
];

const topResources = [
  {
    title: "Investopedia",
    desc: "World's leading financial education website",
    url: "https://www.investopedia.com",
    rating: "4.9",
    tag: "Best Overall",
  },
  {
    title: "Varsity by Zerodha",
    desc: "Free comprehensive stock market courses for Indians",
    url: "https://zerodha.com/varsity",
    rating: "4.8",
    tag: "Top Rated",
  },
  {
    title: "Moneycontrol",
    desc: "India's #1 financial platform for news & analysis",
    url: "https://www.moneycontrol.com",
    rating: "4.7",
    tag: "Popular",
  },
  {
    title: "ET Money Learn",
    desc: "Simplified guides on mutual funds & investing",
    url: "https://www.etmoney.com/learn",
    rating: "4.6",
    tag: "Beginner Friendly",
  },
  {
    title: "Groww Learn",
    desc: "Easy-to-understand articles on stocks & MFs",
    url: "https://groww.in/blog",
    rating: "4.5",
    tag: "Trending",
  },
  {
    title: "Value Research",
    desc: "India's best mutual fund research & ratings",
    url: "https://www.valueresearchonline.com",
    rating: "4.7",
    tag: "Expert Pick",
  },
];

const Learn = () => {
  const navigate = useNavigate();
  return (
  <div className="space-y-7 px-5 pb-4 pt-8">
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Learn</h1>
      <p className="text-xs text-muted-foreground mt-0.5">Build your financial knowledge</p>
    </div>

    {/* Featured */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-primary overflow-hidden rounded-2xl p-6"
    >
      <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
        Featured
      </span>
      <h3 className="mt-3 font-display text-lg font-bold text-primary-foreground">
        Investing for Beginners
      </h3>
      <p className="mt-1.5 text-sm text-primary-foreground/50">
        A complete guide to start your investment journey with just ₹500.
      </p>
      <button onClick={() => navigate("/ai-advisor")} className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-foreground hover:opacity-80 transition-opacity">
        Start Learning <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>

    {/* Topics */}
    <div className="space-y-2">
      {topics.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.button
            key={t.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate("/ai-advisor")}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:shadow-card-hover active:scale-[0.99]"
          >
            <div className="rounded-xl bg-secondary p-2.5">
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[10px] text-muted-foreground">{t.duration}</span>
            </div>
          </motion.button>
        );
      })}
    </div>

    {/* Top Resources */}
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">Top Rated Resources</h2>
        <Globe className="h-3.5 w-3.5 text-accent" />
      </div>
      {topResources.map((r, i) => (
        <motion.button
          key={r.url}
          onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:shadow-card-hover active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Globe className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                {r.tag}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{r.desc}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-[10px] font-semibold text-foreground">{r.rating}</span>
            </div>
          </div>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
        </motion.button>
      ))}
    </div>
  </div>
  );
};

export default Learn;
