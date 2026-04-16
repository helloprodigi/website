import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";
import { successStats } from "@/data/landing-content";

const accentMap: Record<string, string> = {
  black: "bg-[#353638] text-white",
  primary: "bg-[#ffc91f]",
};

export default function SuccessStats() {
  const renderStatCard = (
    stat: (typeof successStats)[number] | undefined,
    spanClass: string,
  ) => {
    if (!stat) {
      return null;
    }

    return (
      <article
        key={stat.label}
        className={`card-rise rounded-sm p-6 ${spanClass} ${accentMap[stat.accent]}`}
      >
        <p className="mb-6 text-4xl font-semibold tracking-tight">
          {stat.value}
        </p>
        <p className="text-sm opacity-90">{stat.label}</p>
      </article>
    );
  };

  return (
    <SectionContainer className="py-14 md:py-16">
      <h2 className="mb-8 text-center font-serif text-4xl text-[#1d1d1d] font-bold">
        Our Success Stories
      </h2>
      <div className="grid gap-3 md:grid-cols-12">
        {renderStatCard(successStats[0], "md:col-span-2")}
        {renderStatCard(successStats[1], "md:col-span-4")}

        <article className="card-rise overflow-hidden rounded-sm md:relative md:col-span-6 md:row-span-2 md:min-h-31.25">
          <Image
            src="/images/adikara-play.png"
            alt="Adikara 2025 competition"
            width={1280}
            height={720}
            loading="lazy"
            sizes="100vw"
            className="block h-auto w-full md:hidden"
          />
          <Image
            src="/images/adikara-play.png"
            alt="Adikara 2025 competition"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="hidden object-cover md:block"
          />
        </article>

        {renderStatCard(successStats[2], "md:col-span-4")}
        {renderStatCard(successStats[3], "md:col-span-2")}
      </div>
    </SectionContainer>
  );
}
