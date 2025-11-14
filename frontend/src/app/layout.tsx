
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/Toast/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineBanner from "@/components/OfflineBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fintrax - Task Management, Finance & Budgeting, Goal Tracking, and More",
  description: "Fintrax is your all-in-one solution for task management, finance tracking, budgeting, goal setting, and more. Simplify your life with our intuitive platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>
          <OfflineBanner />
          {children}
          <ToastProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
