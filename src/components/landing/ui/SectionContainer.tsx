import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionContainer({
  children,
  className = "",
}: SectionContainerProps) {
  return (
    <section
      className={`mx-auto w-full max-w-[1200px] px-4 md:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
