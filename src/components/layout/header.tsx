import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <span className="text-bg-primary font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-text-primary">ETS RetroBoard</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
