import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";
import AuthWrapper from "@/app/components/AuthWrapper";

const pfDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: "Chess with Mom",
  description: "A chess game for me and my mom",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body
        className={`${pfDisplay.className} flex antialiased bg-bg-dark font-bold text-fg max-h-screen`}
      >
        <AuthWrapper>
          <Sidebar />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
