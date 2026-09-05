import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, LifeBuoy, ArrowRight, LogOut } from "lucide-react";
import { AccessGate } from "../components/AccessGate";
import { useAccessUnlock } from "../lib/access-gate";
import { erSections } from "../lib/er-content";
import { cardHasDetail, cardSummary, type ContentCard } from "../lib/stage-content";
import { ContentCardSheet } from "../components/ContentCardSheet";
import { renderRich, stripRich } from "../lib/rich-text";
import { cardIconFor } from "../lib/card-icons";

// TEMP (ספטמבר 2026): משתמש באותו storageKey כמו דשבורד הלידה ("/app"), כך
// שהזנת הקוד באחד משני המקומות פותחת את שניהם יחד - זו בקשה מפורשת של הלקוח
// לשלב הנוכחי. כשנרצה גייט נפרד למדריך הלידה: מחליפים כאן ל-storageKey ייעודי.
const STORAGE_KEY = "birth-guide-access";
const ACCESS_CODE = "2026";

export const Route = createFileRoute("/er")({
  head: () => ({
    meta: [
      { title: "עזרה ראשונה ליילודים ופעוטות - מדריך חינם | גיל דרור-אסטמקר" },
      {
        name: "description",
        content:
          "מדריך חירום דיגיטלי: חנק מבקבוק, חנק מגוף זר, החייאת תינוק, מניעת מוות בעריסה ומתי לפנות למיון. חינם לכל המשפחות.",
      },
      {
        property: "og:title",
        content: "עזרה ראשונה ליילודים ופעוטות - מדריך חינם",
      },
      {
        property: "og:description",
        content:
          "חנק, החייאת תינוק, מניעת מוות בעריסה ומתי לפנות למיון - מדריך חירום בעברית.",
      },
    ],
  }),
  component: ErPage,
});

function ErPage() {
  const { unlocked, ready, unlock, lock } = useAccessUnlock(STORAGE_KEY);

  if (!ready) return null;

  if (!unlocked) {
    return (
      <AccessGate
        code={ACCESS_CODE}
        onUnlock={unlock}
        copy={{
          icon: <LifeBuoy className="w-8 h-8 text-foreground/70" strokeWidth={1.8} />,
          title: "מדריך עזרה ראשונה ליילודים ופעוטות",
          subtitle:
            "חנק, החייאה, ומתי לפנות למיון - כל מה שרוצים שיהיה זמין לכם בכיס.",
          errorMessage: "קוד גישה שגוי, אנא בדקו את הקוד שקיבלתם.",
        }}
      />
    );
  }

  return <ErGuide onLogout={lock} />;
}

function ErGuide({ onLogout }: { onLogout: () => void }) {
  const [openCard, setOpenCard] = useState<ContentCard | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-secondary/20">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-4.5 h-4.5 text-foreground/70" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground truncate">
                עזרה ראשונה ליילודים
              </h1>
              <p className="text-[11px] text-muted-foreground truncate">
                מדריך חינמי - לא תחליף לתרגול מעשי
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <Link
              to="/app"
              className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80 hover:text-foreground bg-secondary/60 hover:bg-secondary rounded-full px-2.5 py-2 transition"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>הכנה ללידה</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted rounded-full px-2.5 py-2 transition"
              aria-label="יציאה"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 pb-16">
        <div className="rounded-2xl bg-primary/10 border-2 border-primary/50 px-5 py-4">
          <p className="text-sm leading-relaxed text-foreground/85">
            המדריך הזה הוא כלי עזר וסיכום מהיר - הוא אינו תחליף לתרגול מעשי. מיומנות
            אמיתית בעזרה ראשונה נרכשת דרך תרגול מודרך על בובה, עם פידבק בזמן אמת. מומלץ
            מאוד להצטרף להדרכת עזרה ראשונה מעשית.
          </p>
        </div>

        <div className="mt-6 space-y-8">
          {erSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-extrabold text-foreground leading-snug">
                {section.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {section.intro}
              </p>

              <div className="mt-4 space-y-3">
                {section.cards.map((c) => {
                  const CardIcon = cardIconFor(c.tag);
                  const expandable = cardHasDetail(c);
                  const Wrapper = expandable ? "button" : "div";
                  return (
                    <Wrapper
                      key={c.title}
                      {...(expandable
                        ? {
                            type: "button" as const,
                            onClick: () => setOpenCard(c),
                            "aria-label": `${c.title} - לחצו להסבר המלא`,
                          }
                        : {})}
                      className={`w-full text-right rounded-2xl px-5 py-4 shadow-sm transition hover:shadow-md active:scale-[0.995] ${
                        c.highlight
                          ? "bg-primary/10 border-2 border-primary/60"
                          : "bg-card border border-border/60 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/60 flex items-center justify-center">
                          <CardIcon
                            className="w-5 h-5 text-foreground/70"
                            strokeWidth={1.8}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          {c.tag && (
                            <span className="inline-block text-[10px] font-semibold tracking-wider text-primary-foreground bg-primary/70 rounded-full px-2 py-0.5 mb-1.5">
                              {c.tag}
                            </span>
                          )}
                          <h3 className="text-base font-bold text-foreground leading-snug">
                            {c.title}
                          </h3>
                          <p
                            className={`mt-1.5 text-sm leading-relaxed text-foreground/75 whitespace-pre-line ${
                              expandable ? "line-clamp-3" : ""
                            }`}
                          >
                            {expandable ? stripRich(cardSummary(c)) : renderRich(c.body)}
                          </p>
                        </div>
                      </div>
                      {expandable && (
                        <span className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-primary/90">
                          לחצו להסבר המלא
                          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                    </Wrapper>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border/60 bg-card px-6 py-6 text-center">
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            רוצים להתאמן על זה בפועל, עם בובה ותרגול מודרך?
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold px-6 py-3 text-sm shadow-sm hover:opacity-90 active:scale-[0.99] transition"
          >
            לפרטים על הקורס עם גיל
          </Link>
        </div>
      </main>

      <ContentCardSheet card={openCard} onClose={() => setOpenCard(null)} />
    </div>
  );
}
