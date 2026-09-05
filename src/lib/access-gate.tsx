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
