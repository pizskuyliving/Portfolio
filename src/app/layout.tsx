import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getProfile } from "@/lib/data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name || "Portofolio";
  return {
    title: { default: `${name} | Portofolio`, template: `%s | ${name}` },
    description: profile?.headline || "Portofolio project dan pengalaman.",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
