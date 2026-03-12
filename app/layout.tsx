import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Estate Sales Performance Dashboard",
  description:
    "Premium SaaS-style analytics dashboard for real estate sales teams"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground bg-radial-glow">
        {children}
      </body>
    </html>
  );
}

