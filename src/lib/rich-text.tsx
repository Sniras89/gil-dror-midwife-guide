import type { ReactNode } from "react";

/** ממיר **טקסט** להדגשה מודגשת */
export function renderRich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** מסיר סימוני הדגשה לצורך תצוגת תקציר */
export function stripRich(text: string): string {
  return text.replace(/\*\*/g, "");
}
