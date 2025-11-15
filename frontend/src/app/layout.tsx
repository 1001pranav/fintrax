
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
  title: "Fintrax - Manage Your Finances and Projects in One Place",
  description: "All-in-one platform for financial management and project tracking. Track income, expenses, savings, loans, and tasks with beautiful visualizations and insights. Start free today!",
  keywords: "finance tracker, budget app, task management, project management, personal finance, expense tracker, savings goals, loan tracking, financial dashboard",
  authors: [{ name: "Fintrax Team" }],
  openGraph: {
    title: "Fintrax - Manage Your Finances and Projects in One Place",
    description: "All-in-one platform for financial management and project tracking",
    type: "website",
    siteName: "Fintrax",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintrax - Manage Your Finances and Projects in One Place",
    description: "All-in-one platform for financial management and project tracking",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
