import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AppHeader from "@/core/app-header";
import { PresentationSettingsProvider } from "@/core/presentation-settings";
import { readPresentationSettingsFromCookieStore } from "@/lib/presentation-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebSlides",
  description: "WebSlides",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialSettings = readPresentationSettingsFromCookieStore(cookieStore);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PresentationSettingsProvider initialSettings={initialSettings}>
          <div className="flex flex-col">
            <AppHeader />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </PresentationSettingsProvider>
      </body>
    </html>
  );
}
