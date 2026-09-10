import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HK Salon For Men | Hadiqa Kiani Salon For Men, Multan",
  description:
    "Modern, precise, and professional grooming for every man. Premium haircuts, beard work, facials and grooming at HK Salon For Men, Flagship, Gulgasht Colony, Multan.",
  metadataBase: new URL("https://hksalonformen.com"),
  openGraph: {
    type: "website",
    siteName: "HK Salon For Men",
    title: "HK Salon For Men | Premium Men's Grooming, Multan",
    description: "Modern, precise, and professional grooming for every man. Flagship salon in Gulgasht Colony, Multan.",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    other: {
      "p:domain_verify": "e1c2eb560dc71ac0376706f2a7364f2d",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ink-deep text-cream">
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
