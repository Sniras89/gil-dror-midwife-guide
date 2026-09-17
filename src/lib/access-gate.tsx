import { useCallback, useEffect, useState } from "react";

/**
 * מנגנון גישה משותף לכל הגייטים באפליקציה.
 *
 * כרגע (ספטמבר 2026) גם דשבורד "7 שלבי הלידה" וגם מדריך ה-ER חולקים את
 * אותו storageKey ("birth-guide-access") ואת אותו קוד גישה - כלומר הזנת
 * הקוד פעם אחת פותחת את שניהם ביחד. זו החלטת מוצר מכוונת של השלב הנוכחי.
 *
 * כשנרצה גייט נפרד למדריך הלידה בעתיד: מספיק לתת ל-route של ה-ER
 * storageKey שונה (ואולי גם קוד שונה) - שאר הלוגיקה כאן לא צריכה להשתנות.
 */
/** גרסת התקנון - לעדכן כשמפרסמים נוסח חדש, כדי לתעד הסכמה מחדש. */
export const TERMS_VERSION = "2026-08-17";

export const TERMS_CONSENT_STORAGE_KEY = "birth-guide-terms-consent";

/** תיעוד הסכמה לתקנון בדפדפן בלבד (ללא שליחה לשרת). */
export function recordTermsConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TERMS_CONSENT_STORAGE_KEY,
      JSON.stringify({ acceptedAt: new Date().toISOString(), version: TERMS_VERSION }),
    );
  } catch {
    // אם אין גישה ל-localStorage (מצב פרטי וכו') - לא חוסמים את הכניסה.
  }
}

export function useAccessUnlock(storageKey: string) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUnlocked(window.localStorage.getItem(storageKey) === "true");
    setReady(true);
  }, [storageKey]);

  const unlock = useCallback(() => {
    window.localStorage.setItem(storageKey, "true");
    setUnlocked(true);
  }, [storageKey]);

  const lock = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setUnlocked(false);
  }, [storageKey]);

  return { unlocked, ready, unlock, lock };
}
