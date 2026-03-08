import { motion } from "framer-motion";
import { BookOpen, TrendingUp, PieChart, Shield, Clock, ChevronRight } from "lucide-react";

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
  </div>
);

export default Learn;
