import type { Metadata } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "QuiloVolt Global Pay",
  description:
    "MVP demonstravel de pagamentos instantaneos para mobilidade eletrica com infraestrutura Stellar Global Rails.",
  applicationName: "QuiloVolt Global Pay"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
