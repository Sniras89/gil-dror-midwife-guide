import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle2, Info, RotateCcw } from "lucide-react";

type WaterAnswer = "none" | "clear" | "meconium";
type ContractionAnswer = "irregular" | "regular";
type BleedingAnswer = "no" | "yes";
type GbsAnswer = "no" | "yes";

export function UrgencyCalculator({ birthType = "first" }: { birthType?: "first" | "repeat" }) {
  const [water, setWater] = useState<WaterAnswer | null>(null);
  const [contractions, setContractions] = useState<ContractionAnswer | null>(null);
  const [bleeding, setBleeding] = useState<BleedingAnswer | null>(null);
  const [gbs, setGbs] = useState<GbsAnswer | null>(null);
  const isRepeat = birthType === "repeat";

  const answered = water && contractions && bleeding && (!isRepeat || gbs);

  const result = (() => {
    if (!answered) return null;
    if (water === "meconium" || bleeding === "yes") {
      return {
        level: "red" as const,
        title: "יש להגיע בהקדם האפשרי לבית החולים!",
        body: "מדובר במצב שדורש בדיקה מיידית. אין להמתין — צאו לדרך עכשיו והתקשרו לחדר לידה בדרך.",
        Icon: AlertTriangle,
      };
    }
    if (isRepeat && gbs === "yes" && (water === "clear" || contractions === "regular")) {
      return {
        level: "red" as const,
        title: "GBS חיובי — יש לצאת לבית החולים עכשיו",
        body: "עם GBS חיובי לא ממתינים בבית: יש להגיע מיד לקבלת אנטיביוטיקה, במיוחד בלידה חוזרת שיכולה להתקדם מהר.",
        Icon: AlertTriangle,
      };
    }
    if (water === "clear") {
      return {
        level: "orange" as const,
        title: "יש להגיע לבית החולים תוך 3-4 שעות",
        body: "לאחר ירידת מים נקיים נהוג להגיע לבדיקה בתוך מספר שעות, גם אם עדיין אין צירים.",
        Icon: Clock,
      };
    }
    if (contractions === "regular") {
      return {
        level: "green" as const,
        title: "זה הזמן לעבור לבית החולים!",
        body: isRepeat
          ? "הלידה הפעילה מתחילה. בלידה חוזרת הקצב מהיר — אל תחכו לרגע האחרון, סדרו את הילדים וצאו לדרך."
          : "הלידה הפעילה מתחילה. ארזו את הציוד, קחו נשימה עמוקה וצאו לדרך ברוגע.",
        Icon: CheckCircle2,
      };
    }
    return {
      level: "blue" as const,
      title: "מומלץ להישאר בסביבה הביתית והמרגיעה",
      body: "בשלב זה עדיף להישאר בבית — לנוח, לאכול, להתקלח חם ולהתחיל להאזין לגוף.",
      Icon: Info,
    };
  })();

  const reset = () => {
    setWater(null);
    setContractions(null);
    setBleeding(null);
    setGbs(null);
  };

  const resultStyles: Record<string, string> = {
    red: "bg-red-50 border-red-300 text-red-900",
    orange: "bg-orange-50 border-orange-300 text-orange-900",
    green: "bg-emerald-50 border-emerald-300 text-emerald-900",
    blue: "bg-sky-50 border-sky-300 text-sky-900",
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-foreground/70" strokeWidth={2} />
        </span>
        <h3 className="text-lg font-bold text-foreground">מתי מגיעים לבית החולים?</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        ענו על {isRepeat ? 4 : 3} שאלות קצרות לקבלת המלצה מותאמת.
      </p>

      <Question
        n={1}
        title="האם חווית ירידת מים?"
        options={[
          { v: "none", label: "לא" },
          { v: "clear", label: "כן - מים נקיים" },
          { v: "meconium", label: "כן - מים מקוניאלים / חומים" },
        ]}
        value={water}
        onChange={(v) => setWater(v as WaterAnswer)}
      />
      <Question
        n={2}
        title="מה תדירות הצירים שלך?"
        options={[
          { v: "irregular", label: "לא סדירים / רחוקים" },
          { v: "regular", label: "סדירים: כל 3 דקות, נמשכים כדקה, כבר שעתיים ברצף" },
        ]}
        value={contractions}
        onChange={(v) => setContractions(v as ContractionAnswer)}
      />
      <Question
        n={3}
        title="האם יש דימום וסת או הפחתה בתנועות עובר?"
        options={[
          { v: "no", label: "לא" },
          { v: "yes", label: "כן" },
        ]}
        value={bleeding}
        onChange={(v) => setBleeding(v as BleedingAnswer)}
      />
      {isRepeat && (
        <Question
          n={4}
          title="האם תוצאת בדיקת ה-GBS חיובית?"
          options={[
            { v: "no", label: "לא / לא ידוע" },
            { v: "yes", label: "כן - GBS חיובי" },
          ]}
          value={gbs}
          onChange={(v) => setGbs(v as GbsAnswer)}
        />
      )}

      {result && (
        <div className={`mt-5 rounded-2xl border-2 p-4 ${resultStyles[result.level]}`}>
          <div className="flex items-start gap-3">
            <result.Icon className="w-6 h-6 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="font-bold text-base leading-snug">{result.title}</p>
              <p className="text-sm mt-1.5 leading-relaxed opacity-90">{result.body}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium bg-white/70 hover:bg-white rounded-full px-3 py-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            אפס שאלון
          </button>
        </div>
      )}
    </div>
  );
}

function Question({
  n,
  title,
  options,
  value,
  onChange,
}: {
  n: number;
  title: string;
  options: { v: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-foreground mb-2">
        <span className="text-muted-foreground font-normal">שאלה {n}. </span>
        {title}
      </p>
      <div className="grid gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              className={`text-right rounded-2xl border px-3.5 py-2.5 text-sm transition ${
                active
                  ? "bg-primary/25 border-primary text-foreground font-semibold"
                  : "bg-muted/50 border-border/60 text-foreground/80 hover:border-primary/50"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}