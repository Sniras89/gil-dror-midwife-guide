import { Link } from "@tanstack/react-router";
import { Home, Heart, LifeBuoy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

// כדי להוסיף פריט עתידי (נותני שירות, המלצות של גיל וכו') - פשוט מוסיפים
// שורה כאן. אם יהיו יותר מ-4 פריטים בהמשך, כדאי להפוך את האחרון ל"עוד"
// שפותח תפריט/Bottom Sheet במקום לדחוס עוד אייקונים לשורה.
const navItems: NavItem[] = [
  { to: "/", label: "ראשי", icon: Home },
  { to: "/app", label: "הכנה ללידה", icon: Heart },
  { to: "/er", label: "עזרה ראשונה", icon: LifeBuoy },
];

export function BottomNav() {
  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="ניווט ראשי"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="flex flex-col items-center justify-center gap-1 py-2.5 transition"
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <span
                      className={`w-9 h-8 rounded-xl flex items-center justify-center transition ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** ריווח תחתון קבוע כדי שתוכן לא יוסתר מאחורי ה-Bottom Nav */
export const BOTTOM_NAV_SPACER_CLASS = "pb-24";
