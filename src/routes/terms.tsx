import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ChevronRight } from "lucide-react";
import { BottomNav, BOTTOM_NAV_SPACER_CLASS } from "@/components/BottomNav";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "תקנון ותנאי שימוש - ליווי דיגיטלי ללידה" },
      {
        name: "description",
        content:
          "תקנון, תנאי שימוש ומדיניות פרטיות של המדריך הדיגיטלי ללידה ולעזרה ראשונה ליילודים מאת גיל דרור-אסטמקר.",
      },
      { property: "og:title", content: "תקנון ותנאי שימוש - ליווי דיגיטלי ללידה" },
      {
        property: "og:description",
        content: "תנאי השימוש ומדיניות הפרטיות של המדריך הדיגיטלי ללידה ולעזרה ראשונה.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

type Section = {
  title: string;
  paragraphs: string[];
};

// טיוטה זמנית - יוחלף בנוסח הסופי שיישלח על ידי גיל.
// בעת ההחלפה: לעדכן גם TERMS_VERSION ב-src/lib/access-gate.tsx כדי לתעד הסכמה מחדש.
const sections: Section[] = [
  {
    title: "כללי",
    paragraphs: [
      "מדריך דיגיטלי זה נוצר ומופעל על ידי גיל דרור-אסטמקר, מיילדת, אחות פגיה ויועצת הנקה. השימוש במדריך מהווה הסכמה לתנאים המפורטים בעמוד זה.",
      "התכנים מיועדים לליווי ולהעשרת ידע בלבד, כהשלמה לקורס ההכנה ללידה ולהדרכות עזרה ראשונה.",
    ],
  },
  {
    title: "הסתייגות רפואית",
    paragraphs: [
      "התכנים במדריך הם המלצה כללית ואינם תחליף לייעוץ, אבחון או טיפול רפואי אישי. בכל מצב של ספק, חשש או מצוקה - יש לפנות לצוות הרפואי המטפל, למוקד מיון או למגן דוד אדום.",
      "קריאת חומר בנושא עזרה ראשונה והחייאה אינה מהווה תרגול של מיומנות אמיתית. מומלץ מאוד להצטרף להדרכה מעשית.",
    ],
  },
  {
    title: "שימוש בתוכן וזכויות יוצרים",
    paragraphs: [
      "כל התכנים, הטקסטים, האיורים והתמונות במדריך הם קניינה של גיל דרור-אסטמקר ומוגנים בזכויות יוצרים.",
      "השימוש במדריך הוא אישי ופרטי. אין להעתיק, להפיץ, לשתף, לפרסם או להעביר את התכנים או את קוד הגישה לצדדים שלישיים, בתשלום או בחינם, ללא אישור בכתב.",
    ],
  },
  {
    title: "פרטיות ושמירת מידע",
    paragraphs: [
      "המדריך אינו דורש הרשמה ואינו אוסף פרטים מזהים. אין מסירת שם, טלפון או כתובת דואר אלקטרוני.",
      "מידע שנוצר בזמן השימוש - קוד גישה שאושר, סוג לידה שנבחר, רשימת הציוד, יומן הצירים ותיעוד ההסכמה לתקנון - נשמר מקומית בדפדפן שלכם בלבד (localStorage) ואינו נשלח לשרת ואינו נגיש לאף אחד אחר.",
      "ניקוי היסטוריית הדפדפן או נתוני האתר ימחק מידע זה לצמיתות.",
    ],
  },
  {
    title: "שינויים בתקנון",
    paragraphs: [
      "ייתכנו עדכונים בתקנון ובתכנים מעת לעת. הנוסח המעודכן יופיע בעמוד זה ויחול מרגע פרסומו.",
    ],
  },
  {
    title: "יצירת קשר",
    paragraphs: [
      "לשאלות בנוגע לתקנון, לתכנים או לקורסים - אתם מוזמנים ליצור קשר דרך אתר יצירת הקשר המקושר במסך הפתיחה.",
    ],
  },
];

function TermsPage() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-accent/40 via-background to-secondary/30 px-6 py-10 ${BOTTOM_NAV_SPACER_CLASS}`}
    >
      <main className="max-w-2xl mx-auto">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/30 flex items-center justify-center">
            <FileText className="w-7 h-7 text-foreground/70" strokeWidth={1.8} />
          </div>
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-center text-foreground leading-snug">
          תקנון ותנאי שימוש
        </h1>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          כולל מדיניות פרטיות
        </p>

        <div className="mt-6 rounded-2xl bg-muted/70 border border-border/60 px-5 py-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            שימו לב: זהו נוסח טיוטה זמני להצגה בלבד, עד לפרסום הנוסח הסופי.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-3xl bg-card border border-border/60 shadow-[0_20px_60px_-30px_rgba(180,120,120,0.35)] p-6 sm:p-7"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mt-3 text-sm leading-relaxed text-foreground/85"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <Link
          to="/"
          className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-card border border-border/60 px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:border-primary active:scale-[0.99] transition"
        >
          <ChevronRight className="w-4 h-4 text-foreground/60" strokeWidth={2.5} />
          חזרה למסך הראשי
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}
