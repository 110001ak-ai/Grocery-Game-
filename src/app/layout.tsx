import type { Metadata } from "next";
import { Fredoka, Nunito, Bebas_Neue, Orbitron } from "next/font/google";
import "./globals.css";
import { getDarkVars, getLightVars, THEME } from "@/lib/theme";
import ThemeWatcher from "@/components/ThemeWatcher";

const fredoka = Fredoka({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-fredoka",
});
const nunito = Nunito({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
});
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});
const orbitron = Orbitron({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "🛒 The Grocery Game",
  description:
    "15 questions about your kitchen universe. Answer. Earn XP. Unlock your Kitchen Rank.",

  openGraph: {
    title: "🛒 The Grocery Game",
    description:
      "Make your choices, earn XP, and discover your final score in this playful food adventure.",
    siteName: "The Grocery Game",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "The Grocery Game",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "🛒 The Grocery Game",
    description:
      "15 questions about your kitchen universe. Answer. Earn XP. Unlock your Kitchen Rank.",
    images: ["/preview.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

const themeScript = `(function(){
  try {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();`;

const themeStyles = `
  :root { --stripe-gradient: ${THEME.stripe}; }
  @media (prefers-color-scheme: dark)  { :root { ${getDarkVars()}  } }
  @media (prefers-color-scheme: light) { :root { ${getLightVars()} } }
  .dark  { ${getDarkVars()}  }
  .light { ${getLightVars()} }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />{" "}
      </head>

      <body
        className={`${fredoka.variable} ${nunito.variable} ${bebas.variable} ${orbitron.variable}`}
      >
        <div className="app-container">
          <ThemeWatcher />
          {children}
        </div>
      </body>
    </html>
  );
}