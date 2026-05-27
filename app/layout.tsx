import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollRestoration } from './components/ScrollRestoration';
import { GoogleAnalytics } from '@next/third-parties/google';
import { headers } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tutotuts - The Search Engine for Video Tutorials",
  description: "Search across YouTube, Facebook, and Instagram to find the best video tutorials for any skill.",
};

const EXCLUDED_PATHS = [
  '/admin/create',
  '/admin/archives',
  '/admin/categories',
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';
  const isExcluded = EXCLUDED_PATHS.some(path => pathname.startsWith(path));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollRestoration />
        {children}

        {process.env.NODE_ENV === "production" && !isExcluded && (
          <GoogleAnalytics gaId="G-5FV6QSS2GJ" />
        )}
      </body>
    </html>
  );
}