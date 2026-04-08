"use client";

import { ArrowDown2, Lock, SearchNormal1 } from "iconsax-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {
  mainNavItems,
  topBarMainLinks,
  topBarSwitches,
} from "@/data/landing-content";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

const socialIconMap = {
  GitHub: FaGithub,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
} as const;

type NavGroupedColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

type NavDirectSubmenu = {
  label: string;
  href: string;
};

function isGroupedColumns(columns: unknown[]): columns is NavGroupedColumn[] {
  return columns.every(
    (column) =>
      typeof column === "object" &&
      column !== null &&
      "title" in column &&
      "links" in column,
  );
}

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY <= 12) {
        setIsHidden(false);
        lastScrollYRef.current = currentY;
        return;
      }

      if (currentY > lastY + 6) {
        setIsHidden(true);
      } else if (currentY < lastY - 6) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      id="landing-header"
      className={`sticky top-0 z-50 w-full border-b border-black/10 bg-white transition-transform duration-300 ease-out will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 lg:grid-cols-[220px_1fr]">
        <div className="flex items-center gap-3 border-r border-b border-black/10 px-5 py-4 lg:row-span-2 lg:border-b-0">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="IIUD logo"
              width={180}
              height={32}
              loading="lazy"
            />
          </Link>
        </div>

        <div className="hidden items-center justify-between border-b border-black/10 lg:flex">
          <div className="flex items-center px-3">
            {topBarMainLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`px-3 py-4 text-sm text-black/80 transition hover:text-[#ffb901] hover:font-medium ${
                  index < topBarMainLinks.length - 1
                    ? ""
                    : "border-r border-black/10 pr-6"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 ml-5">
              {topBarSwitches.map((item) => {
                const Icon =
                  socialIconMap[item.name as keyof typeof socialIconMap];
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-black/80 transition hover:bg-black/15 hover:text-black "
                  >
                    <Icon size={15} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex h-13 items-center border-l border-r border-black/10 px-4 text-black/45 bg-gray-100">
              <SearchNormal1 size="16" color="currentColor" variant="Linear" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-[220px] border-0 bg-transparent px-3 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              className="flex h-13 items-center bg-[#ffc91f] px-7 text-sm font-bold text-black transition hover:bg-[#ffb901] cursor-pointer"
            >
              <Lock
                size="14"
                color="currentColor"
                variant="Linear"
                className="mr-2"
              />
              <span>DTC Mobile</span>
            </button>
          </div>
        </div>

        <nav className="hidden items-center px-2 lg:flex">
          {mainNavItems.map((item) => (
            <div key={item.label} className="nav-item group relative">
              {item.columns ? (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-4 text-[15px] text-[#232323] transition hover:text-[#ffb901] cursor-pointer hover:font-medium"
                >
                  <span>{item.label}</span>
                  <ArrowDown2 size="12" color="currentColor" variant="Linear" />
                </button>
              ) : (
                <Link
                  href={item.link}
                  className="flex items-center gap-2 px-4 py-4 text-[15px] text-[#232323] transition hover:text-[#ffb901] hover:font-medium"
                >
                  <span>{item.label}</span>
                </Link>
              )}

              {item.columns && (
                <div
                  className={`nav-mega invisible absolute left-0 top-full z-50 translate-y-1 rounded-b-sm border border-black/10 bg-white opacity-0 shadow-[0_22px_50px_rgba(18,24,50,0.14)] transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                    isGroupedColumns(item.columns)
                      ? "w-[508px] p-6"
                      : "w-56 p-2"
                  }`}
                >
                  {isGroupedColumns(item.columns) ? (
                    <div className="grid grid-cols-2 gap-6">
                      {item.columns.map((column) => (
                        <div key={column.title}>
                          <p className="mb-3 border-b border-black/10 pb-2 text-sm font-semibold text-[#2e2e2e]">
                            {column.title}
                          </p>
                          <ul className="space-y-1 text-sm text-black/80">
                            {column.links.map((linkItem, index) => (
                              <li key={index}>
                                <Link
                                  href={linkItem.href}
                                  className="block px-3 py-2 transition hover:bg-black/5 hover:text-[#ffb901]"
                                >
                                  {linkItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-1 text-sm text-black/80">
                      {(item.columns as NavDirectSubmenu[]).map(
                        (submenuItem, index) => (
                          <li key={index}>
                            <Link
                              href={submenuItem.href}
                              className="block px-3 py-2 transition hover:bg-black/5 hover:text-[#ffb901]"
                            >
                              {submenuItem.label}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 lg:hidden">
          <button type="button" className="text-sm font-semibold">
            Menu
          </button>
          <button
            type="button"
            className="text-sm font-semibold text-[#ffb901]"
          >
            Log in
          </button>
        </div>

        <div className="flex items-center border-t border-black/10 px-4 py-3 lg:hidden">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full rounded-sm border border-black/15 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </header>
  );
}
