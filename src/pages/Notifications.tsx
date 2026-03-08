import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Bell, Sparkles, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
  { icon: Sparkles, title: "AI Insight", desc: "Nifty 50 is up 2.3% this week. Consider adding to your SIP.", time: "2h ago", color: "text-accent", bg: "bg-accent/10" },
  { icon: TrendingUp, title: "Portfolio Update", desc: "Your portfolio grew by ₹1,240 today. Great momentum!", time: "5h ago", color: "text-success", bg: "bg-success/10" },
  { icon: Bell, title: "SIP Reminder", desc: "Your monthly SIP of ₹2,000 is due tomorrow.", time: "1d ago", color: "text-primary", bg: "bg-primary/10" },
  { icon: AlertTriangle, title: "Market Alert", desc: "Bank Nifty dropped 1.5%. No action needed for long-term investors.", time: "1d ago", color: "text-warning", bg: "bg-warning/10" },
  { icon: Sparkles, title: "Weekly Digest", desc: "Your weekly investment summary is ready to review.", time: "3d ago", color: "text-accent", bg: "bg-accent/10" },
];

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className="px-5 pb-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-xl bg-secondary p-2">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="font-display text-xl font-bold text-foreground">Notifications</h1>
      </div>
      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.bg}`}>
                <Icon className={`h-5 w-5 ${n.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
