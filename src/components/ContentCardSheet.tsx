import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { ContentCard } from "../lib/stage-content";
import { cardIconFor } from "../lib/card-icons";
import { renderRich } from "../lib/rich-text";

export function ContentCardSheet({
  card,
  onClose,
}: {
  card: ContentCard | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [card, onClose]);

  if (!card) return null;
  const Icon = cardIconFor(card.tag);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-md animate-in fade-in duration-300"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        className="relative w-full sm:max-w-lg max-h-[88vh] flex flex-col bg-card border border-border/60 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_-20px_rgba(180,120,120,0.35)] animate-in slide-in-from-bottom-8 sm:zoom-in-95 fade-in duration-300"
      >
        <div className="shrink-0 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border sm:hidden" />
        </div>

        <div className="shrink-0 flex items-start gap-3 px-6 pt-3 pb-4 border-b border-border/60">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-secondary/60 flex items-center justify-center">
            <Icon className="w-5 h-5 text-foreground/75" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            {card.tag && (
              <p className="text-[11px] font-semibold text-muted-foreground mb-0.5">{card.tag}</p>
            )}
            <h3 className="text-lg font-bold text-foreground leading-snug">{card.title}</h3>
            {card.subtitle && (
              <p className="mt-1 text-sm font-medium text-primary/80">{card.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {card.highlight && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-primary/10 border border-primary/50 px-4 py-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-foreground/70" strokeWidth={2} />
              <p className="text-sm font-semibold leading-relaxed text-foreground/90">
                חשוב לשים לב לכרטיס הזה - הוא נוגע לבטיחות ולתזמון.
              </p>
            </div>
          )}

          <p className="text-[15px] leading-relaxed text-foreground/85 whitespace-pre-line">
            {renderRich(card.body)}
          </p>

          {card.bullets && (
            <ul className="space-y-2 pr-4 list-disc marker:text-primary/70">
              {card.bullets.map((b) => (
                <li key={b} className="text-[15px] leading-relaxed text-foreground/85">
                  {renderRich(b)}
                </li>
              ))}
            </ul>
          )}

          {card.tip && (
            <div className="rounded-2xl bg-secondary/50 border border-border/60 px-4 py-3">
              <p className="text-xs font-bold text-foreground/70 mb-1">טיפ</p>
              <p className="text-sm leading-relaxed text-foreground/85">{card.tip}</p>
            </div>
          )}

          {card.image && (
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
              <img src={card.image.url} alt={card.image.alt} className="w-full h-auto block" loading="lazy" />
            </div>
          )}

          {card.images && card.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {card.images.map((img) => (
                <div
                  key={img.url}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
                >
                  <img src={img.url} alt={img.alt} className="w-full h-auto block" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 pb-6 pt-3 border-t border-border/60">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            סגירה
          </button>
        </div>
      </div>
    </div>
  );
}
