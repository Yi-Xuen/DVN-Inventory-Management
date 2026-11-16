import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-montserrat" });

// Follow the OS theme: the design-system tokens switch on [data-theme="dark"].
const themeScript = `(function(){var m=matchMedia("(prefers-color-scheme: dark)");function s(){document.documentElement.dataset.theme=m.matches?"dark":"light"}s();m.addEventListener("change",s)})()`;

export const metadata: Metadata = {
  title: "Fabric Stock · Prototype",
  description: "Clickable prototype of the Divani fabric roll inventory flow (sample data).",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-sync" strategy="beforeInteractive">{themeScript}</Script>
        {children}
      </body>
    </html>
  );
}
