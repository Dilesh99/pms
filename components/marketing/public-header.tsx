"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/#features", label: "Services" },
  { href: "/#security", label: "Security" },
  { href: "/#access", label: "Accessibility" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Button key={l.href} variant="ghost" size="sm" render={<Link href={l.href} />}>
              {l.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" render={<Link href="/register" />}>
            Register
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo href="/" />
                </SheetTitle>
                <SheetDescription>Navigate the CareBridge patient portal.</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {links.map((l) => (
                  <SheetClose
                    key={l.href}
                    render={
                      <Link
                        href={l.href}
                        className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                      />
                    }
                  >
                    {l.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <SheetClose
                  render={
                    <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))} />
                  }
                >
                  Log in
                </SheetClose>
                <SheetClose
                  render={<Link href="/register" className={cn(buttonVariants({ size: "lg" }))} />}
                >
                  Register
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
