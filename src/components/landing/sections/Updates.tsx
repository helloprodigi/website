import {
  ACTIVITY_CATEGORIES,
  getLatestActivitiesByCategory,
} from "@/lib/activities";

import SectionContainer from "@/components/landing/ui/SectionContainer";
import UpdatesClient from "@/components/landing/sections/updates/UpdatesClient";

export default function Updates() {
  const postsByCategory = getLatestActivitiesByCategory(3);

  return (
    <section className="relative overflow-hidden bg-[#000000] py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_9%_18%,rgba(0,0,0,0.64),transparent_48%),radial-gradient(circle_at_79%_74%,rgba(0,0,0,0.52),transparent_46%),radial-gradient(circle_at_42%_52%,rgba(15,15,15,0.4),transparent_68%)]" />
      <div className="pointer-events-none absolute -top-10 left-0 whitespace-nowrap text-center text-[58px] font-semibold tracking-tight text-white/8">
        Stay touch with updates • Stay touch with updates • Stay touch with
        updates
      </div>

      <SectionContainer className="relative z-10">
        <h3 className="mb-9 text-center text-5xl font-bold leading-tight text-white md:text-6xl">
          Stay touch with updates
        </h3>

        <UpdatesClient
          categories={[...ACTIVITY_CATEGORIES]}
          postsByCategory={postsByCategory}
        />
      </SectionContainer>
    </section>
  );
}
