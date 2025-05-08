import type { Metadata } from "next";;

export const metadata: Metadata = {
  title: "Fintrax - Finance, ToDo List, Roadmaps",
  description:
    "Fintrax is an all-in-one application which helps you to manage your Finances, ToDo List and Roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <html lang="en">
          <body>
            {children}
          </body>
        </html>
  );
}

