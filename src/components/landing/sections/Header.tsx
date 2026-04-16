"use client";

import { ArrowDown2, Lock, SearchNormal1 } from "iconsax-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import {
  mainNavItems,
  topBarMainLinks,
  topBarSwitches,
} from "@/data/landing-content";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";

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
  const [hasMounted, setHasMounted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [openMobileMegaMenu, setOpenMobileMegaMenu] = useState<string | null>(
    null,
  );
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setOpenMobileMegaMenu(null);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  useEffect(() => {
    if (!isMobileSearchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMobileSearchOpen]);

  const toggleMobileMenu = () => {
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleMobileSearch = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileMegaMenu(null);
    setIsMobileSearchOpen((prev) => !prev);
  };

  const toggleMobileMegaMenu = (label: string) => {
    setOpenMobileMegaMenu((prev) => (prev === label ? null : label));
  };

  const portalTarget = hasMounted ? document.body : null;

  return (
    <header
      id="landing-header"
      className={`sticky top-0 z-50 w-full border-b border-black/10 bg-white transition-transform duration-300 ease-out will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto grid w-full max-w-370 grid-cols-1 lg:grid-cols-[220px_1fr]">
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

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleMobileSearch}
              aria-label="Toggle mobile search"
              aria-expanded={isMobileSearchOpen}
              className="inline-flex h-10 w-10 items-center justify-center border border-black/15 text-black/75 transition hover:border-[#ffb901] hover:text-[#ffb901]"
            >
              <SearchNormal1 size="18" color="currentColor" variant="Linear" />
            </button>
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center border border-black/15 text-black/75 transition hover:border-[#ffb901] hover:text-[#ffb901]"
            >
              {isMobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
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
                className="w-55 border-0 bg-transparent px-3 text-sm outline-none"
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
                    isGroupedColumns(item.columns) ? "w-127 p-6" : "w-56 p-2"
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
      </div>

      {portalTarget
        ? createPortal(
            <>
              <div
                className={`fixed inset-0 z-60 bg-black/45 transition-opacity duration-300 lg:hidden ${
                  isMobileMenuOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <aside
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Menu"
                  className={`ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.22)] transition-transform duration-300 ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
                      Menu
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close mobile menu"
                      className="inline-flex h-9 w-9 items-center justify-center text-black/70 transition hover:text-black"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-5 py-5">
                    <div className="space-y-1">
                      {mainNavItems.map((item) => {
                        if (!item.columns) {
                          return (
                            <Link
                              key={item.label}
                              href={item.link}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileMegaMenu(null);
                              }}
                              className="flex items-center justify-between rounded-sm px-2 py-3 text-[15px] font-semibold text-[#232323] transition hover:bg-black/5 hover:text-[#ffb901]"
                            >
                              <span>{item.label}</span>
                            </Link>
                          );
                        }

                        const isOpen = openMobileMegaMenu === item.label;

                        return (
                          <div key={item.label}>
                            <button
                              type="button"
                              onClick={() => toggleMobileMegaMenu(item.label)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between rounded-sm px-2 py-3 text-left text-[15px] font-semibold text-[#232323] transition hover:bg-black/5"
                            >
                              <span>{item.label}</span>
                              <ArrowDown2
                                size="12"
                                color="currentColor"
                                variant="Linear"
                                className={`transition ${isOpen ? "rotate-180" : "rotate-0"}`}
                              />
                            </button>

                            {isOpen ? (
                              <div className="space-y-3 px-2 pb-2 pt-1">
                                {isGroupedColumns(item.columns) ? (
                                  item.columns.map((column) => (
                                    <div key={column.title}>
                                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-black/45">
                                        {column.title}
                                      </p>
                                      {column.links.length > 0 ? (
                                        <div className="space-y-1">
                                          {column.links.map(
                                            (linkItem, index) => (
                                              <Link
                                                key={index}
                                                href={linkItem.href}
                                                onClick={() => {
                                                  setIsMobileMenuOpen(false);
                                                  setOpenMobileMegaMenu(null);
                                                }}
                                                className="block rounded-sm px-2 py-2 text-sm text-black/80 transition hover:bg-black/5 hover:text-[#ffb901]"
                                              >
                                                {linkItem.label}
                                              </Link>
                                            ),
                                          )}
                                        </div>
                                      ) : (
                                        <p className="px-2 py-1 text-sm text-black/40">
                                          Coming soon
                                        </p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="space-y-1">
                                    {(item.columns as NavDirectSubmenu[]).map(
                                      (submenuItem, index) => (
                                        <Link
                                          key={index}
                                          href={submenuItem.href}
                                          onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setOpenMobileMegaMenu(null);
                                          }}
                                          className="block rounded-sm px-2 py-2 text-sm text-black/80 transition hover:bg-black/5 hover:text-[#ffb901]"
                                        >
                                          {submenuItem.label}
                                        </Link>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </nav>

                  <div className="border-t border-black/10 p-4">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center bg-[#ffc91f] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#ffb901]"
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
                </aside>
              </div>

              <div
                className={`fixed inset-0 z-70 flex items-center justify-center bg-black/45 px-4 transition-opacity duration-300 lg:hidden ${
                  isMobileSearchOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Search"
                  className={`w-full max-w-md rounded-sm bg-white shadow-[0_20px_55px_rgba(0,0,0,0.24)] transition duration-300 ${
                    isMobileSearchOpen
                      ? "translate-y-0 scale-100"
                      : "translate-y-2 scale-[0.98]"
                  }`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
                      Search
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsMobileSearchOpen(false)}
                      aria-label="Close mobile search"
                      className="inline-flex h-8 w-8 items-center justify-center text-black/65 transition hover:text-black"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center rounded-sm border border-black/15 bg-white px-3 py-2">
                      <SearchNormal1
                        size="16"
                        color="currentColor"
                        variant="Linear"
                        className="text-black/50"
                      />
                      <input
                        ref={mobileSearchInputRef}
                        type="text"
                        placeholder="Search here..."
                        className="w-full border-0 bg-transparent px-3 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>,
            portalTarget,
          )
        : null}
    </header>
  );
}
