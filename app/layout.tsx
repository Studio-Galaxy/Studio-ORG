import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Studio Galaxy is a development studio. Digital products, experiences & intelligent systems — designed and engineered to be worth experiencing.";

export const metadata: Metadata = {
  metadataBase: new URL("https://studiogalaxy.org"),
  title: "Studio Galaxy — We build things worth experiencing.",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Studio Galaxy",
    title: "Studio Galaxy — We build things worth experiencing.",
    description,
  },
  twitter: { card: "summary_large_image", title: "Studio Galaxy", description },
};

export const viewport: Viewport = {
  themeColor: "#f7f0e7",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Studio Galaxy",
  url: "https://studiogalaxy.org",
  email: "hello@studiogalaxy.org",
  description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
