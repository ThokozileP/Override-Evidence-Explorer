import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decision Control Gap",
  description: "Regulated AI · Human override audit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {/* Privacy-friendly analytics by Plausible */}
      <Script
        src="https://plausible.io/js/pa-PxUFHo3uPnsk21OI4qaPp.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">{`
        window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};
        plausible.init=plausible.init||function(i){plausible.o=i||{}};
        plausible.init();
      `}</Script>
    </html>
  );
}
