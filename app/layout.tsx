import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageTransition from './components/page-transitions';


import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dylan In Hebrew",
  description: "Dylan In Hebrew",
  viewport: {
    width: 'device-width',
    initialScale: 1
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className={inter.className}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
