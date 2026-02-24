
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/Toast/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineBanner from "@/components/OfflineBanner";
import ThemeProvider from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import ThemeScript from "@/components/ThemeScript";

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('theme');
                  if (!theme) {
                    const stored = localStorage.getItem('preferences-storage');
                    if (stored) {
                      const parsed = JSON.parse(stored);
                      theme = parsed.state?.preferences?.theme;
                    }
                  }
                  theme = theme || 'light';
                  const root = document.documentElement;

                  // Remove both classes first to avoid conflicts
                  root.classList.remove('light', 'dark');

                  if (theme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.classList.add(prefersDark ? 'dark' : 'light');
                  } else {
                    root.classList.add(theme === 'dark' ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeScript />
        <QueryProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <OfflineBanner />
              {children}
              <ToastProvider />
            </ErrorBoundary>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
