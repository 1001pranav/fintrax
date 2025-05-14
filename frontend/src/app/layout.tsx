'use client';

import DynamicNavbar from "@/components/navbar";
import { ScreenContextProvider } from "@/context/general";

// This is a Client Component
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScreenContextProvider>
      <DynamicNavbar />
      {children}
    </ScreenContextProvider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
