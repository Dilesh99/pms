import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <Logo href="/" />
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
        <Search className="size-8" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Error 404</p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          <Home className="size-4" aria-hidden="true" />
          Back to home
        </Link>
        <Button variant="outline" size="lg" render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
      </div>
    </main>
  );
}
