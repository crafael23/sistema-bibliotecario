import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema bibliotecario",
  description: "Sistema bibliotecario multiusuario",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="esp" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
