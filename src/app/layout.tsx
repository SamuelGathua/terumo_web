import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Toaster } from "@/components/ui/toaster";
import { PreferencesProvider } from "@/context/PreferencesContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABIS — Adaptive Blood Infrastructure System | Terumo BCT Africa 2026",
  description:
    "Every unit of blood, exactly where it's needed. Intelligent blood-network forecasting, donor intelligence, and end-to-end cold-chain traceability for resilient healthcare systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable} dark antialiased`}
    >
      <body className="bg-[#051510] text-[#e2ece8] min-h-screen selection:bg-[#e02e48] selection:text-white font-sans">
        <PreferencesProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </PreferencesProvider>
      </body>
    </html>
  );
}
