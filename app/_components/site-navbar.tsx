"use client";

import Image from "next/image";
import Link from "next/link";

type SiteNavbarProps = {
  isVisible?: boolean;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tim", label: "Tim" },
];

export function SiteNavbar({ isVisible = true }: SiteNavbarProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex h-14 w-full items-center justify-between border-b border-[#5f0202] bg-[#9f0000] px-[7%] shadow-[0_12px_32px_rgba(120,0,0,0.26)] md:h-16 md:px-[10%]">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/Logo%20MPL%20ID.png"
            alt="Logo MPL Indonesia"
            width={46}
            height={46}
            className="h-10 w-10 object-contain md:h-11 md:w-11"
          />

          <div className="flex items-center gap-3">
            <Image
              src="/images/We%20Own%20This.png"
              alt="We Own This"
              width={220}
              height={52}
              className="h-7 w-auto object-contain brightness-0 invert md:h-8"
            />

            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="hidden text-[0.72rem] font-black uppercase tracking-[0.14em] text-white md:inline-block md:text-xs"
            >
              MPL Indonesia
            </span>
          </div>
        </Link>

        <nav
          style={{ fontFamily: "var(--font-accent)" }}
          className="flex items-center gap-4 text-[0.74rem] font-bold uppercase tracking-[0.22em] md:gap-6 md:text-[0.8rem]"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="!text-white transition hover:!text-white visited:!text-white active:!text-white"
              style={{ color: "#ffffff" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
