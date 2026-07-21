import { useEffect, useState } from "react";
import { Check, Package, Baby, Heart, Droplet } from "lucide-react";

const STORAGE_KEY = "birth-guide-checklist";

type Category = {
  id: string;
  title: string;
  icon: typeof Package;
  items: string[];
};

const categories: Category[] = [
  {
    id: "delivery",
    title: "חדר הלידה",
    icon: Heart,
    items: [
      "מסמכים / כרטיס מעקב היריון",
      "בקבוק מים עם קש",
      "נישנושים קלים",
      "שמן שקדים",
      "גרביים חמות",
      "מטען לטלפון",
      "תאורת אווירה / שירים שאוהבים",
    ],
  },
  {
    id: "mom",
    title: "לאחרי הלידה (לאמא)",
    icon: Package,
    items: [
      "כלי רחצה",
      "תחתונים חד-פעמיים",
      "פדים קפואים / מגנזיום",
      "בגדים נוחים",
      "כפכפים / נעלי בית",
    ],
  },
  {
    id: "baby",
    title: "לתינוק/ת שלנו",
    icon: Baby,
    items: [
      "בגד ליום השחרור (2 שכבות)",
      "כובע",
      "שמיכה",
      "סל-קל / כיסא בטיחות",
    ],
  },
  {
    id: "nursing",
    title: "להנקה",
    icon: Droplet,
    items: [
      "חזיית הנקה",
      "משחה לפטמות",
      "בגדים נוחים להנקה",
    ],
  },
];

export function PackingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, ready]);

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const overallPct = Math.round((totalChecked / totalItems) * 100);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-card border border-border/60 p-5 shadow-sm">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground">רשימת ציוד ליום הגדול</h2>
          <span className="text-sm text-muted-foreground font-medium">
            {totalChecked} / {totalItems}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          סמנו את הפריטים ככל שהם מוכנים. הרשימה נשמרת אוטומטית במכשיר שלכם.
        </p>
        <ProgressBar pct={overallPct} />
      </div>

      {categories.map((cat) => {
        const Icon = cat.icon;
        const catChecked = cat.items.filter((it) => checked[`${cat.id}:${it}`]).length;
        const pct = Math.round((catChecked / cat.items.length) * 100);
        return (
          <div
            key={cat.id}
            className="rounded-3xl bg-card border border-border/60 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center">
                <Icon className="w-5 h-5 text-foreground/75" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground">{cat.title}</h3>
                <p className="text-[11px] text-muted-foreground">
                  {catChecked} מתוך {cat.items.length} פריטים
                </p>
              </div>
              <span className="text-xs font-semibold text-foreground/70">{pct}%</span>
            </div>
            <ProgressBar pct={pct} />
            <ul className="mt-4 space-y-2">
              {cat.items.map((item) => {
                const key = `${cat.id}:${item}`;
                const isChecked = !!checked[key];
                return (
                  <li key={item}>
                    <button
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-right transition ${
                        isChecked
                          ? "bg-secondary/40 border-secondary/70"
                          : "bg-muted/40 border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border-2 transition ${
                          isChecked
                            ? "bg-primary border-primary"
                            : "bg-background border-border"
                        }`}
                      >
                        {isChecked && (
                          <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                        )}
                      </span>
                      <span
                        className={`text-sm flex-1 ${
                          isChecked
                            ? "text-muted-foreground line-through"
                            : "text-foreground/85"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}