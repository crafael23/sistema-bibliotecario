"use client";

export default function SeedButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  const pressed = () => {
    void action();
  };
  return (
    <button
      onClick={pressed}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      Sembrar Datos
    </button>
  );
}
