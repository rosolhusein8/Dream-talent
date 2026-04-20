/*
 * Fil: components/Header.tsx
 * Syfte: Huvudnavigering högst upp på sidan.
 * Vad koden gör: Visar logotyp, länkar och mobilmeny beroende på skärmstorlek.
 * Lär dig: Bra fil att studera för state, responsiv UI och menyinteraktioner.
 * Felsökning: Kolla länkar, meny-state och scroll-/viewport-logik först.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHashSnapshot() {
  return window.location.hash;
}

function getServerHashSnapshot() {
  return "";
}

const navItems = [
  { href: "/", label: "Hem" },
  { href: "/#jobbsokande", label: "För jobbsökande" },
  { href: "/#foretag", label: "För företag" },
  { href: "/lediga-tjanster", label: "Lediga tjänster" },
  { href: "/#vara-tjanster", label: "Våra tjänster" },
  { href: "/#om-oss", label: "Om oss" },
  { href: "/#kontakt", label: "Kontakt" },
];

// Hjälper headern att markera vilken länk som är aktiv just nu.
function isNavActive(pathname: string, hash: string, href: string) {
  if (href === "/") {
    return pathname === "/" && !hash;
  }
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const headerRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const hashFromWindow = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot
  );
  /** Re-read hash when client route changes (hashchange fires only for # links). */
  const [hashAtPath, setHashAtPath] = useState("");
  useEffect(() => {
    queueMicrotask(() => {
      setHashAtPath(window.location.hash);
    });
  }, [pathname]);

  const hash = pathname === "/" ? hashFromWindow || hashAtPath : "";

  // Close mobile menu when viewport becomes desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Close mobile menu when clicking outside header.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      if (!headerRef.current) return;

      const target = event.target as Node;
      if (!headerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 text-black backdrop-blur"
    >
      {/* Toppraden: logotyp, desktop-länkar, CTA-knapp och mobilknapp. */}
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo1.png"
            alt="Dream Talent"
            width={400}
            height={70}
            priority
            className="h-auto w-[84px] object-contain [filter:contrast(1.2)] sm:w-[104px]"
          />
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs ${
                isNavActive(pathname, hash, item.href)
                  ? "font-semibold text-zinc-900"
                  : "font-medium text-zinc-700 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/lediga-tjanster"
          className="hidden min-h-[36px] items-center rounded-lg bg-[#080b22] px-5 text-xs font-semibold text-white transition hover:bg-[#13183b] lg:inline-flex"
        >
          Se lediga tjänster
        </Link>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 p-2 text-zinc-800 transition hover:bg-zinc-100 xl:hidden"
          aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <span className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-zinc-200 bg-white px-4 py-4 xl:hidden"
        >
          {/* Mobile dropdown menu */}
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  isNavActive(pathname, hash, item.href)
                    ? "bg-zinc-100 font-semibold text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/lediga-tjanster"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[#080b22] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#13183b]"
            >
              Se lediga tjänster
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
