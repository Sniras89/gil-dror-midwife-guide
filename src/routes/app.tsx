import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Home,
  Hospital,
  Activity,
  Sparkles,
  Baby,
  Moon,
  LogOut,
  AlertTriangle,
  ListChecks,
  BookOpen,
  Repeat,
  Sprout,
  RefreshCw,
  Info,
  ChevronLeft,
} from "lucide-react";
import {
  getStageContent,
  cardSummary,
  cardHasDetail,
  type BirthType,
  type ContentCard,
} from "../lib/stage-content";
import { ContentCardSheet } from "../components/ContentCardSheet";
import { renderRich, stripRich } from "../lib/rich-text";
import { cardIconFor } from "../lib/card-icons";
import { PackingChecklist } from "../components/PackingChecklist";
import { UrgencyCalculator } from "../components/UrgencyCalculator";
import { AboutModal } from "../components/AboutModal";
import {
  ContractionTimerFab,
  ContractionTimerSheet,
} from "../components/ContractionTimer";
import { AccessGate } from "../components/AccessGate";
import { useAccessUnlock } from "../lib/access-gate";
import { BottomNav, BOTTOM_NAV_SPACER_CLASS } from "../components/BottomNav";

// TEMP (ספטמבר 2026): אותו storageKey כמו מדריך ה-ER ("/er") - ראו הערה שם.
const STORAGE_KEY = "birth-guide-access";
const ACCESS_CODE = "2026";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "ליווי דיגיטלי ללידה - מדריך 7 שלבי הלידה" },
      {
        name: "description",
        content:
          "מדריך אינטראקטיבי בעברית לזוגות: 7 שלבי הלידה, מחשבון מתי יוצאים לבית החולים ורשימת ציוד - ללידה ראשונה או חוזרת.",
      },
      { property: "og:title", content: "ליווי דיגיטלי ללידה - מדריך 7 שלבי הלידה" },
      {
        property: "og:description",
        content:
          "כלים, תנוחות, נשימות ורשימת ציוד - ליווי מותאם ללידה ראשונה או חוזרת.",
      },
    ],
  }),
  component: Index,
});

const BIRTH_TYPE_KEY = "birth-guide-birth-type";

const birthTypeLabels: Record<BirthType, string> = {
  first: "לידה ראשונה",
  repeat: "לידה חוזרת",
};

const stages = [
  {
    id: 1,
    title: "טרום הלידה",
    intro: "הכנה גופנית ורגשית לקראת היום הגדול - כל מה שחשוב לדעת בשבועות האחרונים.",
    icon: Heart,
  },
  {
    id: 2,
    title: "השלב הלטנטי",
    intro: "הצירים הראשונים מתחילים. איך מזהים, מה עושים בבית, ומתי מתחילים להתארגן.",
    icon: Moon,
  },
  {
    id: 3,
    title: "המעבר לבית החולים",
    intro: "מתי יוצאים, מה לוקחים, ואיך הופכים את הנסיעה לרגועה ובטוחה.",
    icon: Hospital,
  },
  {
    id: 4,
    title: "השלב הפעיל",
    intro: "הצירים מתגברים והלידה מתקדמת. כלים לנשימה, תנוחות ותמיכה של בן/בת הזוג.",
    icon: Activity,
  },
  {
    id: 5,
    title: "לידת השליה",
    intro: "השלב השלישי של הלידה - מה קורה בגוף אחרי הלידה עצמה, וכיצד מלווים אותו.",
    icon: Sparkles,
  },
  {
    id: 6,
    title: "הרגע שאחרי",
    intro: "המפגש הראשון עם התינוק/ת, מגע עור לעור, והנקה ראשונה ברוגע.",
    icon: Baby,
  },
  {
    id: 7,
    title: "משכב לידה",
    intro: "החזרה הביתה, ההחלמה הגופנית והרגשית, ותמיכה בימים ובשבועות הראשונים.",
    icon: Home,
  },
] as const;

function Index() {
  const { unlocked, ready, unlock, lock } = useAccessUnlock(STORAGE_KEY);
  const [birthType, setBirthType] = useState<BirthType | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem(BIRTH_TYPE_KEY);
    return saved === "first" || saved === "repeat" ? saved : null;
  });

  if (!ready) return null;

  if (!unlocked) {
    return (
      <AccessGate
        code={ACCESS_CODE}
        copy={{
          title: "ברוכים הבאים לליווי הדיגיטלי ללידה",
          subtitle: "מרחב שקט ומכיל שילווה אתכם בכל שלב.",
          errorMessage: "קוד גישה שגוי, אנא בדקו את הקוד שקיבלתם בקורס",
          footer: "ליווי חם ומקצועי לזוגות בדרך אל ההורות.",
        }}
        onUnlock={unlock}
      />
    );
  }

  if (!birthType) {
    return (
      <BirthTypeSelect
        onSelect={(t) => {
          window.localStorage.setItem(BIRTH_TYPE_KEY, t);
          setBirthType(t);
        }}
      />
    );
  }

  return (
    <Dashboard
      birthType={birthType}
      onChangeBirthType={() => {
        window.localStorage.removeItem(BIRTH_TYPE_KEY);
        setBirthType(null);
      }}
      onLogout={lock}
    />
  );
}

function BirthTypeSelect({ onSelect }: { onSelect: (t: BirthType) => void }) {
  const options = [
    {
      type: "first" as BirthType,
      icon: Sprout,
      desc: "הפעם הראשונה - נלווה אתכם צעד צעד, מהסימנים המקדימים ועד משכב הלידה.",
    },
    {
      type: "repeat" as BirthType,
      icon: Repeat,
      desc: "כבר עברתם את זה - תוכן מותאם לקצב מהיר עבור לידות חוזרות.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gradient-to-b from-accent/40 via-background to-secondary/30">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/30 flex items-center justify-center">
            <Heart className="w-7 h-7 text-foreground/70" strokeWidth={1.8} />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground leading-snug">
          ברוכים הבאים! באיזו לידה מדובר?
        </h1>
        <p className="text-center text-muted-foreground mt-3 text-sm leading-relaxed">
          נתאים את התוכן במיוחד בשבילכם. תמיד אפשר לשנות.
        </p>

        <div className="mt-8 space-y-4">
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.type}
                onClick={() => onSelect(o.type)}
                className="w-full text-right rounded-3xl bg-card border border-border/60 p-5 shadow-sm hover:border-primary hover:shadow-md active:scale-[0.99] transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/60 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-foreground/75" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-bold text-foreground">
                      {birthTypeLabels[o.type]}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                      {o.desc}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Dashboard({
  birthType,
  onChangeBirthType,
  onLogout,
}: {
  birthType: BirthType;
  onChangeBirthType: () => void;
  onLogout: () => void;
}) {
  const [activeId, setActiveId] = useState<number>(1);
  const [tab, setTab] = useState<"stages" | "checklist" | "urgency">("stages");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [openCard, setOpenCard] = useState<ContentCard | null>(null);
  const active = stages.find((s) => s.id === activeId)!;
  const ActiveIcon = active.icon;
  const content = getStageContent(birthType)[active.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-secondary/20">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center shrink-0">
              <Heart className="w-4.5 h-4.5 text-foreground/70" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground truncate">
                ליווי דיגיטלי ללידה
              </h1>
              <p className="text-[11px] text-muted-foreground truncate">
                {birthTypeLabels[birthType]}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <button
              onClick={() => setAboutOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80 hover:text-foreground bg-secondary/60 hover:bg-secondary rounded-full px-2.5 py-2 transition"
              aria-label="אודות"
            >
              <Info className="w-3.5 h-3.5" />
              <span>אודות</span>
            </button>
            <button
              onClick={onChangeBirthType}
              className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80 hover:text-foreground bg-primary/20 hover:bg-primary/30 rounded-full px-2.5 py-2 transition"
              aria-label="שינוי סוג לידה"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>שינוי: {birthTypeLabels[birthType]}</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted rounded-full px-2.5 py-2 transition"
              aria-label="יציאה"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-3">
          <div className="grid grid-cols-3 gap-1.5 bg-muted/70 rounded-2xl p-1">
            <TabButton active={tab === "stages"} onClick={() => setTab("stages")} icon={BookOpen} label="שלבים" />
            <TabButton active={tab === "urgency"} onClick={() => setTab("urgency")} icon={AlertTriangle} label="מתי יוצאים?" />
            <TabButton active={tab === "checklist"} onClick={() => setTab("checklist")} icon={ListChecks} label="רשימת ציוד" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 pb-16">
        {tab === "checklist" && <PackingChecklist />}

        {tab === "urgency" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              כלי מהיר להערכה - לא מחליף ייעוץ רפואי.
            </p>
            <UrgencyCalculator birthType={birthType} />
          </div>
        )}

        {tab === "stages" && (
          <>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-foreground">שלבי הלידה</h2>
              <span className="text-xs text-muted-foreground">
                {activeId} מתוך {stages.length}
              </span>
            </div>

            <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
              <ol className="flex items-stretch gap-2.5 pb-3 min-w-max" dir="rtl">
                {stages.map((s) => {
                  const Icon = s.icon;
                  const isActive = s.id === activeId;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => setActiveId(s.id)}
                        className={`h-full w-[84px] flex flex-col items-center justify-start gap-1.5 rounded-2xl px-3 py-3 transition border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-card text-foreground/80 border-border/60 hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isActive ? "bg-primary-foreground/20" : "bg-muted"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-semibold">שלב {s.id}</span>
                        <span className="block w-full text-[11px] leading-tight text-center line-clamp-2">
                          {s.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <article className="mt-6 rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-primary/15 to-card shadow-[0_14px_44px_-20px_rgba(180,120,120,0.35)] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/30 flex items-center justify-center">
                  <ActiveIcon className="w-7 h-7 text-foreground/80" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wider text-primary-foreground bg-primary/70 rounded-full px-2 py-0.5 inline-block mb-1.5">
                    שלב {active.id}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                    {active.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-foreground/90">
                {active.intro}
              </p>
            </article>

            {content && (
              <div className="mt-5 space-y-3">
                {content.cards.map((c) => {
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
                          <CardIcon className="w-5 h-5 text-foreground/70" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 flex-1">
                          {c.tag && (
                            <span className="inline-block text-[10px] font-semibold tracking-wider text-primary-foreground bg-primary/70 rounded-full px-2 py-0.5 mb-1.5">
                              {c.tag}
                            </span>
                          )}
                          <h4 className="text-base font-bold text-foreground leading-snug">
                            {c.title}
                          </h4>
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
                {content.extra && <div className="mt-2">{content.extra}</div>}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveId((id) => Math.max(1, id - 1))}
                disabled={activeId === 1}
                className="flex-1 rounded-2xl bg-card border border-border/60 py-3 text-sm font-medium text-foreground/80 disabled:opacity-40 hover:border-primary/50 transition"
              >
                השלב הקודם
              </button>
              <button
                onClick={() => setActiveId((id) => Math.min(stages.length, id + 1))}
                disabled={activeId === stages.length}
                className="flex-1 rounded-2xl bg-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
              >
                השלב הבא
              </button>
            </div>
          </>
        )}
      </main>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ContentCardSheet card={openCard} onClose={() => setOpenCard(null)} />
      {!timerOpen && <ContractionTimerFab onClick={() => setTimerOpen(true)} />}
      <ContractionTimerSheet
        open={timerOpen}
        onClose={() => setTimerOpen(false)}
        onGoToStage3={() => {
          setTab("stages");
          setActiveId(3);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Heart;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
