import { useState, type ReactNode } from "react";
import { Heart } from "lucide-react";

export type AccessGateCopy = {
  icon?: ReactNode;
  title: string;
  subtitle: string;
  errorMessage: string;
  footer?: string;
};

export function AccessGate({
  code,
  copy,
  onUnlock,
}: {
  code: string;
  copy: AccessGateCopy;
  onUnlock: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === code) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gradient-to-b from-accent/40 via-background to-secondary/30">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-[0_20px_60px_-20px_rgba(180,120,120,0.25)] p-8 sm:p-10 border border-border/60">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center">
              {copy.icon ?? (
                <Heart className="w-8 h-8 text-foreground/70" strokeWidth={1.8} />
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground leading-snug">
            {copy.title}
          </h1>
          <p className="text-center text-muted-foreground mt-3 text-sm leading-relaxed">
            {copy.subtitle}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-foreground mb-2">
                קוד גישה
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="הזינו את הקוד שקיבלתם"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition text-right"
                dir="rtl"
                autoFocus
              />
            </label>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 text-right">
                {copy.errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-primary text-primary-foreground font-semibold py-3.5 text-base shadow-sm hover:opacity-90 active:scale-[0.99] transition"
            >
              כניסה
            </button>
          </form>
        </div>

        {copy.footer && (
          <p className="text-center text-xs text-muted-foreground mt-6">{copy.footer}</p>
        )}
      </div>
    </div>
  );
}
