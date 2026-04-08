import { redirect } from "next/navigation";

type LegacyExecutivesMemberPageProps = {
  searchParams: Promise<{
    year?: string;
    q?: string;
  }>;
};

export default async function LegacyExecutivesMemberPage({
  searchParams,
}: LegacyExecutivesMemberPageProps) {
  const params = await searchParams;
  const nextParams = new URLSearchParams();

  if (params.year) {
    nextParams.set("year", params.year);
  }

  if (params.q) {
    nextParams.set("q", params.q);
  }

  const query = nextParams.toString();
  redirect(query ? `/executives/members?${query}` : "/executives/members");
}
