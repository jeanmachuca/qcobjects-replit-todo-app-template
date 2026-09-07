import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[hsl(var(--background))] px-6 text-[hsl(var(--foreground))]">
      <div className="w-full max-w-md rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-[0_16px_45px_hsl(236_25%_19%_/_0.08)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/0.3)] text-[hsl(var(--primary))]">
          <Compass size={29} strokeWidth={1.7} />
        </div>
        <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--primary))]">
          Wrong turn
        </p>
        <h1 className="mt-2 font-[family-name:var(--app-font-serif)] text-3xl font-bold tracking-[-0.06em]">
          This page is not on the list.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          The destination you asked for does not exist in this cockpit.
        </p>
        <Link
          href="/"
          data-testid="link-return-to-todos"
          className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft size={15} />
          Return to your list
        </Link>
      </div>
    </div>
  );
}
