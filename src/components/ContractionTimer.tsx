import { useEffect, useRef, useState } from "react";
import { X, Timer, Trash2, RotateCcw, ArrowLeft, AlertTriangle } from "lucide-react";

const LOG_KEY = "birth-guide-contractions";

export type Contraction = {
  id: string;
  start: number;
  end: number;
};

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function clockTime(ts: number) {
  return new Date(ts).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function load(): Contraction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ContractionTimerFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="טיימר צירים"
      className="fixed z-40 bottom-5 left-4 flex items-center gap-2 rounded-full bg-primary text-primary-foreground pr-4 pl-3.5 py-3 shadow-[0_14px_34px_-10px_rgba(180,120,120,0.75)] hover:opacity-95 active:scale-95 transition"
    >
      <Timer className="w-5 h-5" strokeWidth={2.2} />
      <span className="text-sm font-bold">טיימר צירים</span>
    </button>
  );
}

export function ContractionTimerSheet({
  open,
  onClose,
  onGoToStage3,
}: {
  open: boolean;
  onClose: () => void;
  onGoToStage3: () => void;
}) {
  const [logs, setLogs] = useState<Contraction[]>([]);
  const [runningStart, setRunningStart] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const loaded = useRef(false);

  useEffect(() => {
    setLogs(load());
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    window.localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sorted = [...logs].sort((a, b) => b.start - a.start);
  const last = sorted[0];

  const currentDuration = runningStart ? now - runningStart : 0;
  const sinceLast = last ? (runningStart ?? now) - last.end : null;

  const intervals: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    intervals.push(sorted[i].start - sorted[i + 1].start);
  }
  const recentIntervals = intervals.slice(0, 4);
  const recentDurations = sorted.slice(0, 4).map((c) => c.end - c.start);
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const avgInterval = avg(recentIntervals);
  const avgDuration = avg(recentDurations);
  const showAlert =
    sorted.length >= 3 &&
    recentIntervals.length >= 2 &&
    avgInterval > 0 &&
    avgInterval <= 5 * 60 * 1000 &&
    avgDuration >= 40 * 1000;

  const toggle = () => {
    if (runningStart) {
      const end = Date.now();
      setLogs((prev) => [
        ...prev,
        { id: `${runningStart}`, start: runningStart, end },
      ]);
      setRunningStart(null);
    } else {
      setRunningStart(Date.now());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-md animate-in fade-in duration-300"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="מחשבון צירים"
        className="relative w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-card border border-border/60 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_-20px_rgba(180,120,120,0.35)] animate-in slide-in-from-bottom-8 sm:zoom-in-95 fade-in duration-300"
      >
        <div className="shrink-0 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border sm:hidden" />
        </div>

        <div className="shrink-0 flex items-center gap-3 px-5 pt-3 pb-4 border-b border-border/60">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-primary/25 flex items-center justify-center">
            <Timer className="w-5 h-5 text-foreground/75" strokeWidth={2} />
          </div>
          <h3 className="flex-1 min-w-0 text-lg font-bold text-foreground leading-snug">
            מחשבון צירים
          </h3>
          <button
            onClick={() => {
              setLogs([]);
              setRunningStart(null);
            }}
            aria-label="איפוס היסטוריה"
            className="flex items-center gap-1 shrink-0 rounded-full bg-muted px-2.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>איפוס</span>
          </button>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-5">
          {showAlert && (
            <div className="rounded-2xl bg-primary/15 border-2 border-primary/60 px-4 py-3.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-foreground/75" strokeWidth={2.2} />
                <p className="text-sm font-semibold leading-relaxed text-foreground/90">
                  הצירים מראים דפוס סדיר! מומלץ לבדוק את מחשבון החירום בלשונית "המעבר לבית החולים".
                </p>
              </div>
              <button
                onClick={() => {
                  onGoToStage3();
                  onClose();
                }}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-2xl bg-primary text-primary-foreground py-2.5 text-sm font-bold hover:opacity-90 active:scale-[0.99] transition"
              >
                מעבר לשלב 3: המעבר לבית החולים
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-secondary/50 border border-border/60 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-muted-foreground">משך הציר הנוכחי</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
                {fmt(currentDuration)}
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/50 border border-border/60 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-muted-foreground">
                {runningStart ? "מהציר הקודם" : "עבר מהציר האחרון"}
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
                {sinceLast === null ? "--:--" : fmt(sinceLast)}
              </p>
            </div>
          </div>

          <button
            onClick={toggle}
            className={`w-full rounded-3xl py-6 text-xl font-extrabold text-white shadow-md active:scale-[0.99] transition ${
              runningStart
                ? "bg-destructive hover:opacity-90"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {runningStart ? "סיום ציר" : "התחל ציר"}
          </button>

          {sorted.length > 0 && (
            <div className="rounded-2xl bg-muted/50 border border-border/60 px-4 py-3 text-center text-xs text-muted-foreground">
              ממוצע 4 אחרונים: משך {fmt(avgDuration)} · תדירות{" "}
              {recentIntervals.length ? fmt(avgInterval) : "--:--"}
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-foreground mb-2">
              היסטוריית צירים ({sorted.length})
            </p>
            {sorted.length === 0 ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                עדיין לא נרשמו צירים. לחצו על "התחל ציר" כשהציר מתחיל, ועל "סיום ציר" כשהוא נגמר.
              </p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto pl-0.5">
                {sorted.map((c, i) => {
                  const next = sorted[i + 1];
                  const interval = next ? c.start - next.start : null;
                  return (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 px-3.5 py-2.5"
                    >
                      <div className="min-w-0 flex-1 grid grid-cols-3 gap-1 text-center">
                        <span className="text-xs text-muted-foreground">
                          שעה
                          <span className="block text-sm font-bold text-foreground tabular-nums">
                            {clockTime(c.start)}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          משך
                          <span className="block text-sm font-bold text-foreground tabular-nums">
                            {fmt(c.end - c.start)}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          תדירות
                          <span className="block text-sm font-bold text-foreground tabular-nums">
                            {interval === null ? "--:--" : fmt(interval)}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => setLogs((prev) => prev.filter((x) => x.id !== c.id))}
                        aria-label="מחיקת ציר"
                        className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            הכלי מיועד למעקב בלבד ואינו מחליף ייעוץ רפואי.
          </p>
        </div>
      </div>
    </div>
  );
}
