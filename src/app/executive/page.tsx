import { redirect } from "next/navigation";

export default function LegacyExecutivePage() {
  redirect("/executives/members");
}
