import type React from "react";
import { Sidebar } from "~/components/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
