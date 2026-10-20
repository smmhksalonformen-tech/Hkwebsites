"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Container } from "./container";
import { BookButton } from "./book-button";
import { useCart } from "./cart-context";

const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Signatures", href: "/#signatures" },
  { label: "Deals", href: "/deals" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Artists", href: "/artists" },
  { label: "Blog", href: "/blog" },
  { label: "Location", href: "/#location" },
];

export function Header({ menuUrl }: { menuUrl: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();

  const cartLink = (
    <Link href="/cart" className="relative p-2 text-cream/80 hover:text-cream transition-colors" aria-label={`Cart, ${count} items`}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bronze px-1 text-[10px] font-bold text-ink-deep">
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-ink-deep/85 backdrop-blur-md border-b border-ink-line">
      <Container>
        <div className="flex items-center justify-between py-3">
          <a href="/" className="shrink-0">
            <Image
              src="/logo-cream.png"
              alt="Hadiqa Kiani Salon For Men"
              width={160}
              height={70}
              className="h-10 w-auto animate-logo-in"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-cream/80 hover:text-cream transition-colors">
                {n.label}
              </a>
            ))}
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/80 hover:text-cream transition-colors"
            >
              Menu
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {cartLink}
            <BookButton className="rounded-lg bg-bronze px-4 py-2 text-xs font-semibold tracking-wide uppercase text-ink-deep hover:bg-champagne transition-colors">
              Book Appointment
            </BookButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {cartLink}
            <button className="text-cream" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-line bg-ink-deep">
          <Container>
            <div className="py-4 flex flex-col gap-1">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-cream/80 hover:text-cream transition-colors"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-cream/80 hover:text-cream transition-colors"
              >
                Menu
              </a>
              <div className="flex flex-col gap-2 pt-3">
                <BookButton className="rounded-lg bg-bronze px-4 py-2.5 text-center text-xs font-semibold tracking-wide uppercase text-ink-deep">
                  Book Appointment
                </BookButton>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
