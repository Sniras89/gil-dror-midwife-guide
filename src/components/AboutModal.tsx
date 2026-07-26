import { useEffect } from "react";
import { X, Heart } from "lucide-react";

const paragraphs = [
  "שמי גיל דרור-אסטמקר, מתל אביב. שנים שהחלום שלי היה להיות מיילדת, ואחרי שהשתחררתי משירות קבע ארוך בצבא, יצאתי ללימודי הסבה לסיעוד. ידעתי, שלפני שאלך ללמוד מיילדות אני חייבת לעבור בדרך בתינוקיה ובפגיה ולרכוש כלים וידע משמעותי לחיים שלי ושל הסובבים אותי. עבדתי כ-5 שנים במחלקות אלו ובמקביל יצאתי ללימודי מיילדות. מאז אני מגשימה את החלום שלי מדי יום ועובדת בעבודה הכי טובה בעולם במקום שהוא בית, בית החולים ליס.",
  "כשאני לא בעבודה, אני מגיעה לבתים שלכם, ומלמדת אתכם - הכנה ללידה וליום שאחריה, הדרכת עזרה ראשונה לפעוטות ומדריכת הורים לעיסוי תינוקות.",
  "ולאחרונה יצרתי את המדריך הזה בשביל שאוכל להיות הכי קרובה אליכן גם במהלך הלידה.",
];

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-md animate-in fade-in duration-300"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="אודות גיל דרור-אסטמקר"
        className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-card border border-border/60 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_-20px_rgba(180,120,120,0.35)] p-6 sm:p-8 animate-in slide-in-from-bottom-6 sm:zoom-in-95 fade-in duration-300"
      >
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/30 flex items-center justify-center">
            <Heart className="w-6 h-6 text-foreground/70" strokeWidth={1.8} />
          </div>
          <h2 className="text-xl font-bold text-foreground leading-snug">
            אודות גיל דרור-אסטמקר
          </h2>
        </div>

        <div className="space-y-3">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-foreground/85">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}