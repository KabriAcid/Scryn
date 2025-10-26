import { Vote } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-bold">
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <Vote className="h-6 w-6" />
      </div>
      <span className="text-primary dark:text-primary-foreground">ScrynCard</span>
    </div>
  );
}
