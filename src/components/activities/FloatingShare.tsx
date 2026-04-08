"use client";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { useMemo, useState } from "react";

import { Link2 } from "iconsax-react";

type FloatingShareProps = {
  title: string;
};

export default function FloatingShare({ title }: FloatingShareProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const encodedUrl = useMemo(() => encodeURIComponent(pageUrl), [pageUrl]);
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);

  const socialLinks = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: FaXTwitter,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedinIn,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebookF,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: FaWhatsapp,
    },
  ];

  const copyLink = async () => {
    if (!pageUrl) {
      return;
    }

    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <aside className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="rounded-sm border border-black/10 bg-white/95 p-2 shadow-[0_12px_30px_rgba(10,20,40,0.18)] backdrop-blur">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/45">
          Share
        </p>
        <div className="flex flex-col gap-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${item.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-black/10 text-black/70 transition hover:border-[#ffb901] hover:text-[#ffb901]"
              >
                <Icon size={14} />
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyLink}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-black/10 text-black/70 transition hover:border-[#ffb901] hover:text-[#ffb901]"
            aria-label="Copy article link"
            title={copied ? "Link copied" : "Copy link"}
          >
            <Link2 size="15" color="currentColor" variant="Linear" />
          </button>
        </div>
      </div>
    </aside>
  );
}
