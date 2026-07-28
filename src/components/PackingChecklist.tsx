import { useEffect, useMemo, useState } from "react";
import { Check, Package, Baby, Heart, Droplet, Trash2, Plus } from "lucide-react";

const STORAGE_KEY = "birth-guide-checklist";
const CUSTOM_KEY = "birth-guide-checklist-custom";
const REMOVED_KEY = "birth-guide-checklist-removed";

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

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function PackingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [custom, setCustom] = useState<Record<string, string[]>>({});
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecked(readJSON<Record<string, boolean>>(STORAGE_KEY, {}));
    setCustom(readJSON<Record<string, string[]>>(CUSTOM_KEY, {}));
    setRemoved(readJSON<Record<string, boolean>>(REMOVED_KEY, {}));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    localStorage.setItem(REMOVED_KEY, JSON.stringify(removed));
  }, [checked, custom, removed, ready]);

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeCategories = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        activeItems: [...cat.items, ...(custom[cat.id] ?? [])].filter(
          (it) => !removed[`${cat.id}:${it}`],
        ),
      })),
    [custom, removed],
  );

  const addItem = (catId: string) => {
    const value = (drafts[catId] ?? "").trim();
    if (!value) return;
    setRemoved((prev) => {
      const next = { ...prev };
      delete next[`${catId}:${value}`];
      return next;
    });
    setCustom((prev) => {
      const list = prev[catId] ?? [];
      const base = categories.find((c) => c.id === catId)!.items;
      if (list.includes(value) || base.includes(value)) return prev;
      return { ...prev, [catId]: [...list, value] };
    });
    setDrafts((prev) => ({ ...prev, [catId]: "" }));
  };

  const removeItem = (catId: string, item: string) => {
    const key = `${catId}:${item}`;
    setCustom((prev) => {
      const list = prev[catId];
      if (!list?.includes(item)) return prev;
      return { ...prev, [catId]: list.filter((i) => i !== item) };
    });
    setRemoved((prev) => ({ ...prev, [key]: true }));
    setChecked((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const totalItems = activeCategories.reduce((n, c) => n + c.activeItems.length, 0);
  const totalChecked = activeCategories.reduce(
    (n, c) => n + c.activeItems.filter((it) => checked[`${c.id}:${it}`]).length,
    0,
  );
  const overallPct = totalItems ? Math.round((totalChecked / totalItems) * 100) : 0;

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
          סמנו את הפריטים ככל שהם מוכנים. אפשר להוסיף ולמחוק פריטים - הרשימה נשמרת אוטומטית במכשיר שלכם.
        </p>
        <ProgressBar pct={overallPct} />
      </div>

      {activeCategories.map((cat) => {
        const Icon = cat.icon;
        const catChecked = cat.activeItems.filter(
          (it) => checked[`${cat.id}:${it}`],
        ).length;
        const pct = cat.activeItems.length
          ? Math.round((catChecked / cat.activeItems.length) * 100)
          : 0;
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
                  {catChecked} מתוך {cat.activeItems.length} פריטים
                </p>
              </div>
              <span className="text-xs font-semibold text-foreground/70">{pct}%</span>
            </div>
            <ProgressBar pct={pct} />
            <ul className="mt-4 space-y-2">
              {cat.activeItems.map((item) => {
                const key = `${cat.id}:${item}`;
                const isChecked = !!checked[key];
                return (
                  <li key={item} className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggle(key)}
                      className={`flex-1 min-w-0 flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-right transition ${
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
                    <button
                      onClick={() => removeItem(cat.id, item)}
                      aria-label={`מחיקת ${item}`}
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addItem(cat.id);
              }}
              className="mt-3 flex items-center gap-2"
            >
              <input
                value={drafts[cat.id] ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [cat.id]: e.target.value }))
                }
                placeholder="הוספת פריט..."
                dir="rtl"
                className="flex-1 min-w-0 rounded-2xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition text-right"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-1 rounded-2xl bg-primary/80 text-primary-foreground text-xs font-semibold px-3 py-2.5 hover:opacity-90 active:scale-[0.98] transition"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>הוספת פריט</span>
              </button>
            </form>
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