import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";

export default function Research() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-20">
      <div className="absolute inset-0 -bottom-40 bg-[radial-gradient(circle_at_12%_78%,rgba(255,201,31,0.14),transparent_36%)]" />

      <SectionContainer className="relative z-10">
        <h3 className="mb-8 font-serif text-4xl text-[#1d1d1d]">
          Research and Publication
        </h3>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <article className="grid rounded-sm border border-black/10 bg-white p-3 md:grid-cols-2">
            <div className="relative min-h-52 overflow-hidden rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?auto=format&fit=crop&w=1000&q=80"
                alt="Research feature"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#f7931d]">
                Research
              </p>
              <h4 className="mt-3 font-serif text-2xl leading-tight text-[#1f1f1f]">
                Nanostructured TiO2, thin films for solar cell applications.
              </h4>
            </div>
          </article>

          <article className="overflow-hidden rounded-sm bg-[#0b1131] text-white">
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#8adce5]">
                Research
              </p>
              <h4 className="mt-3 font-serif text-3xl">
                Explore more research and publication
              </h4>
            </div>
            <div className="flex justify-end px-6 pb-6">
              <button
                type="button"
                className="rounded-sm border border-white/25 px-4 py-2 text-sm"
              >
                View all articles
              </button>
            </div>
          </article>
        </div>
      </SectionContainer>
    </section>
  );
}
