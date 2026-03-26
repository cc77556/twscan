"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/alert", label: "注意/處置" },
  { href: "/etf/00981a", label: "00981A" },
  { href: "/podcast", label: "Podcast" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-tw-dark-border dark:border-tw-dark-border border-tw-light-border bg-tw-dark-surface/95 dark:bg-tw-dark-surface/95 bg-tw-light-surface/95 backdrop-blur-sm light:bg-tw-light-surface/95 light:border-tw-light-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-tw-accent">市場雷達</span>
          <span className="text-sm font-normal opacity-60">TWScan</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="選單"
            className="rounded-lg p-2 transition-colors hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-tw-dark-border dark:border-tw-dark-border border-tw-light-border px-4 py-2 md:hidden light:border-tw-light-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
