import { motion } from "framer-motion";
import { BookOpen, TrendingUp, PieChart, Shield, Clock, ChevronRight, Play, ExternalLink } from "lucide-react";

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

const youtubeVideos = [
  {
    title: "Stock Market for Beginners",
    channel: "CA Rachana Ranade",
    url: "https://www.youtube.com/watch?v=_yGOcOKF6gA",
    thumbnail: "https://img.youtube.com/vi/_yGOcOKF6gA/mqdefault.jpg",
    duration: "22 min",
  },
  {
    title: "Mutual Funds Explained",
    channel: "Warikoo",
    url: "https://www.youtube.com/watch?v=UyXGwCRpWOQ",
    thumbnail: "https://img.youtube.com/vi/UyXGwCRpWOQ/mqdefault.jpg",
    duration: "18 min",
  },
  {
    title: "How to Invest in Share Market",
    channel: "Pranjal Kamra",
    url: "https://www.youtube.com/watch?v=vP8lRBXEjYQ",
    thumbnail: "https://img.youtube.com/vi/vP8lRBXEjYQ/mqdefault.jpg",
    duration: "15 min",
  },
  {
    title: "SIP Investment Complete Guide",
    channel: "Labour Law Advisor",
    url: "https://www.youtube.com/watch?v=MaUyx85MxSk",
    thumbnail: "https://img.youtube.com/vi/MaUyx85MxSk/mqdefault.jpg",
    duration: "20 min",
  },
  {
    title: "Basics of Stock Market for Beginners",
    channel: "Pushkar Raj Thakur",
    url: "https://www.youtube.com/watch?v=5JQFSx6nmso",
    thumbnail: "https://img.youtube.com/vi/5JQFSx6nmso/mqdefault.jpg",
    duration: "25 min",
  },
  {
    title: "Index Funds vs Mutual Funds",
    channel: "Akshat Shrivastava",
    url: "https://www.youtube.com/watch?v=jzkaEY_e0xg",
    thumbnail: "https://img.youtube.com/vi/jzkaEY_e0xg/mqdefault.jpg",
    duration: "17 min",
  },
];

const Learn = () => (
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
      <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-foreground hover:opacity-80 transition-opacity">
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

    {/* YouTube Videos */}
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">Top YouTube Videos</h2>
        <Play className="h-3.5 w-3.5 text-destructive" />
      </div>
      {youtubeVideos.map((v, i) => (
        <motion.button
          key={v.url}
          onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:shadow-card-hover active:scale-[0.99]"
        >
          <div className="relative h-14 w-22 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <Play className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-medium text-white">
              {v.duration}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{v.title}</h4>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{v.channel}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
        </motion.button>
      ))}
    </div>
  </div>
);

export default Learn;
