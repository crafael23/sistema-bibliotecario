import SeedButton from "~/components/seed-button";
import { handleAuthRouting } from "~/lib/auth-utils";
import { getLibroWithCopias } from "~/server/db/queries";

export const dynamic = "force-dynamic";
export default async function Home() {
  await handleAuthRouting();

  async function testFunction() {
    "use server";

    const data = await getLibroWithCopias(11);
    console.log(data);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SeedButton action={testFunction} />
    </div>
  );
}
