import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
            <Logo />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
