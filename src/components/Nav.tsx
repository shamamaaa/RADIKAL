"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { label: "Müzik", href: "/#muzik" },
  { label: "Kutla", href: "/#kutla" },
  { label: "Oyunlar", href: "/#games" },
  { label: "Mektuplar", href: "/#mektuplar" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm font-semibold tracking-[0.3em] text-ink/70">
            RADIKAL
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menü"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-ink/70 sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/70 bg-paper px-6 py-4 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-mist"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
