import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportLab — Technical Support Workspace",
  description: "Learn, investigate and practice technical support with a free AI coach running on your device.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
