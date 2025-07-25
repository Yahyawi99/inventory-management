import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import MainLayout from "@/layouts/main/layout";
import "@/config/fontawesome";
import "./globals.css";

const JosefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: "400", // Optional: adjust as needed
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={JosefinSans.className}>
      <body className="text-[1.1rem] bg-(--accent)">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
