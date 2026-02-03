import type { Metadata } from "next";
import { Sora } from "next/font/google";
import PageTransition from './components/page-transitions';


import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Dylan In Hebrew",
  description: "Dylan In Hebrew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
    <body className={`${sora.className} h-full bg-[#0b0b0f] text-zinc-100 antialiased`}>
      <PageTransition>{children}</PageTransition>
    </body>
    </html>
  );
}
