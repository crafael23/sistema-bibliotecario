import type React from "react"
import { Sidebar } from "~/components/sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#61cee2] to-[#f34638]">
      <Sidebar>{children}</Sidebar>
    </div>
  )
}

