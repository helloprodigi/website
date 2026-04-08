import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { footerColumns, socialLinks } from "@/data/landing-content";

import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";

const socialIconMap = {
  GitHub: FaGithub,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
} as const;

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0f1012] py-14 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_90%_85%,rgba(255,201,31,0.08),transparent_52%)]" />
      <SectionContainer className="relative z-10 max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 border-b border-white/15 pb-8">
          <div className="space-y-2 text-sm text-white/80 font-bold">
            <p>WE ARE OPEN!</p>
            <p>Reach us to know more about us.</p>
          </div>
          <button
            type="button"
            className="rounded-sm bg-[#ffc91f] px-5 py-3 text-sm font-semibold text-black"
          >
            CONTACT US
          </button>
        </div>

        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <Image
              src="/images/logo-white.png"
              alt="PRODIGI Logo"
              width={150}
              height={30}
              className="object-contain"
            />
            <p className="mt-5 text-white/90">
              PRODIGI is a community of competitive & innovative student in
              Faculty of Informatics, under Digital Talent Centre (DTC)
              Laboratory.
            </p>
          </div>
          <div>
            <p className="mb-3 text-white/70 font-bold">Address</p>
            <p className="mb-3 text-white/90">
              Program Development and Innovation Group of Informatics,
              Laboratorium Digital Talent Centre, Faculty of Informatics
            </p>
            <p className="mb-3 text-white/90">
              Telkom University Landmark Tower (TULT) Building, 15 Floor, Room
              1508, Telekomunikasi Street No.1, Bandung - 40257
            </p>
          </div>
          <div>
            <p className="mb-3 text-white/70 font-bold">Resources</p>
            <ul className="space-y-2 text-white/90">
              {footerColumns.resources.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-white/70 font-bold">Follow Us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon =
                  socialIconMap[item.name as keyof typeof socialIconMap];

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/25 text-white/90 transition hover:border-white hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
