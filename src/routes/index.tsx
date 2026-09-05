import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, LifeBuoy, ChevronLeft, Info } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "גיל דרור-אסטמקר - ליווי דיגיטלי ללידה" },
      {
        name: "description",
        content:
          "ליווי דיגיטלי ללידה ומדריך עזרה ראשונה חינמי ליילודים, מאת גיל דרור-אסטמקר - מיילדת, אחות פגיה ויועצת הנקה.",
      },
      { property: "og:title", content: "גיל דרור-אסטמקר - ליווי דיגיטלי ללידה" },
      {
        property: "og:description",
        content: "ליווי דיגיטלי ללידה ומדריך עזרה ראשונה חינמי ליילודים.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const paragraphs = [
  "שמי גיל דרור-אסטמקר, מתל אביב. שנים שהחלום שלי היה להיות מיילדת, ואחרי שהשתחררתי משירות קבע ארוך בצבא, יצאתי ללימודי הסבה לסיעוד. עבדתי כ-5 שנים במחלקות תינוקיה ופגיה ובמקביל יצאתי ללימודי מיילדות. מאז אני מגשימה את החלום שלי מדי יום ועובדת במקום שהוא בית - בית החולים ליס.",
  "כשאני לא בעבודה, אני מגיעה לבתים שלכם ומלמדת אתכם: הכנה ללידה וליום שאחריה, הדרכת עזרה ראשונה לפעוטות, ומדריכת הורים לעיסוי תינוקות.",
  "ולאחרונה יצרתי את המדריך הדיגיטלי הזה בשביל שאוכל להיות הכי קרובה אליכן גם במהלך הלידה.",
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/40 via-background to-secondary/30 px-6 py-10">
      <main className="max-w-2xl mx-auto">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center">
            <Heart className="w-8 h-8 text-foreground/70" strokeWidth={1.8} />
          </div>
        </div>

        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold text-center text-foreground leading-snug">
          גיל דרור-אסטמקר
        </h1>
        <p className="mt-2 text-center text-sm sm:text-base text-muted-foreground">
          מיילדת | אחות פגיה | יועצת הנקה
        </p>

        <section className="mt-8 rounded-3xl bg-card border border-border/60 shadow-[0_20px_60px_-30px_rgba(180,120,120,0.35)] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-foreground/70" strokeWidth={2} />
            <h2 className="text-lg font-bold text-foreground">קצת עליי</h2>
          </div>
          {paragraphs.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mt-4 text-sm sm:text-[15px] leading-relaxed text-foreground/85"
            >
              {p}
            </p>
          ))}
        </section>

        <section className="mt-6 rounded-3xl bg-primary/10 border-2 border-primary/50 p-6 text-center">
          <p className="text-base font-bold text-foreground leading-snug">
            רוצים לקבוע קורס הכנה ללידה או קורס עזרה ראשונה?
          </p>
          <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
            אשמח ללוות אתכם גם באופן אישי, בבית שלכם.
          </p>
          <a
            href="https://gil-dror-midwife.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold px-6 py-3 text-sm shadow-sm hover:opacity-90 active:scale-[0.99] transition"
          >
            ליצירת קשר ופרטים נוספים
          </a>
        </section>

        <section className="mt-6 rounded-2xl bg-muted/70 border border-border/60 px-5 py-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            שימו לב: התכנים באפליקציה זו הם המלצה כללית ואינם תחליף לייעוץ רפואי אישי.
            קריאת חומר, במיוחד בנושא עזרה ראשונה והחייאה, אינה מהווה תרגול של מיומנות
            אמיתית - מומלץ מאוד להצטרף להדרכה מעשית.
          </p>
        </section>

        <nav className="mt-8 space-y-4">
          <Link
            to="/app"
            className="block rounded-3xl bg-card border border-border/60 p-5 shadow-sm hover:border-primary hover:shadow-md active:scale-[0.99] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/60 flex items-center justify-center">
                <Heart className="w-6 h-6 text-foreground/75" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-foreground">
                  הכנה ללידה
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  ליווי דיגיטלי מלא - למי שיש קוד גישה
                </span>
              </span>
              <ChevronLeft className="w-5 h-5 shrink-0 text-foreground/50" strokeWidth={2.5} />
            </div>
          </Link>

          <Link
            to="/er"
            className="block rounded-3xl bg-card border border-border/60 p-5 shadow-sm hover:border-primary hover:shadow-md active:scale-[0.99] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/60 flex items-center justify-center">
                <LifeBuoy className="w-6 h-6 text-foreground/75" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-foreground">
                  עזרה ראשונה ליילודים
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  מדריך חירום - למי שיש קוד גישה
                </span>
              </span>
              <ChevronLeft className="w-5 h-5 shrink-0 text-foreground/50" strokeWidth={2.5} />
            </div>
          </Link>
        </nav>
      </main>
    </div>
  );
}
