import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/landing/sections/Header";
import type { ReactNode } from "react";

type AdmissionLayoutProps = {
  children: ReactNode;
};

export default function AdmissionLayout({ children }: AdmissionLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f6f6] text-[#1f1f1f]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
