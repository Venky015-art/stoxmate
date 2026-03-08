import { motion } from "framer-motion";
import { BookOpen, TrendingUp, PieChart, Shield, Clock, ChevronRight, Play, ExternalLink } from "lucide-react";

const topics = [
  {
    icon: TrendingUp,
    title: "Stock Market Basics",
    desc: "Learn what stocks are and how the market works",
    duration: "5 min read",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: PieChart,
    title: "Mutual Funds 101",
    desc: "Understand how mutual funds pool money for investing",
    duration: "4 min read",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Risk Management",
    desc: "How to protect your investments from big losses",
    duration: "6 min read",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: BookOpen,
    title: "Power of Diversification",
    desc: "Why putting all eggs in one basket is risky",
    duration: "3 min read",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Clock,
    title: "SIP: The Smart Way",
    desc: "How systematic investing builds wealth over time",
    duration: "4 min read",
    color: "text-primary",
    bg: "bg-primary/10",
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
  <div className="space-y-5 px-5 pb-4 pt-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Learn</h1>
      <p className="text-sm text-muted-foreground">Build your financial knowledge</p>
    </div>

    {/* Featured */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-primary overflow-hidden rounded-2xl p-5 shadow-card"
    >
      <span className="rounded-lg bg-primary-foreground/20 px-2 py-1 text-[10px] font-semibold text-primary-foreground">
        Featured
      </span>
      <h3 className="mt-3 font-display text-lg font-bold text-primary-foreground">
        Investing for Beginners
      </h3>
      <p className="mt-1 text-sm text-primary-foreground/70">
        A complete guide to start your investment journey with just ₹500.
      </p>
      <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-foreground">
        Start Learning <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>

    {/* Topics */}
    <div className="space-y-3">
      {topics.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.button
            key={t.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className={`rounded-xl p-2.5 ${t.bg}`}>
              <Icon className={`h-5 w-5 ${t.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{t.duration}</span>
            </div>
          </motion.button>
        );
      })}
    </div>

    {/* YouTube Videos */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-foreground">Top YouTube Videos</h2>
        <Play className="h-4 w-4 text-destructive" />
      </div>
      {youtubeVideos.map((v, i) => (
        <motion.a
          key={v.url}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-card transition-shadow hover:shadow-card-hover"
        >
          <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
              {v.duration}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground line-clamp-2">{v.title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{v.channel}</p>
          </div>
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </motion.a>
      ))}
    </div>
  </div>
);

export default Learn;
