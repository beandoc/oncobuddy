import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import "@/env"; // Initialize environment validation

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Oncobuddy | Your Cancer Companion",
  description: "A clinically validated oncology management platform for patient care and rehabilitation.",
  keywords: ["Oncology", "Cancer Care", "Symptom Logging", "PRO-CTCAE", "Rehabilitation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen font-sans selection:bg-secondary/30 selection:text-secondary",
          inter.variable,
          outfit.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Background decoration */}
          <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px]" />
            <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
          </div>
          
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
