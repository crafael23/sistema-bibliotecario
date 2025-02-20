import { seedData } from "~/server/db/seeding";

function SeedButton({ action }: { action: () => Promise<void> }) {
  "use client";
  return <button onClick={action}>Seed</button>;
}
export default function HomePage() {
  return (
    <>
      <div>
        <h1>hello world</h1>
        <SeedButton action={seedData} />
      </div>
    </>
  );
}
