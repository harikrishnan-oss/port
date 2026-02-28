import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MouseTrail from "@/components/MouseTrail";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal Portfolio & Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <MouseTrail />
        {children}
      </body>
    </html>
  );
}
