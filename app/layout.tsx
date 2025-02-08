import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageTransition from './components/page-transitions';


import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
    <body className={inter.className}>
     <PageTransition>{children}</PageTransition>
    </body>
    </html>
  );
}
