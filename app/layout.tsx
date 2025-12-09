import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";
import "@/styles/watercolor.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tripper - AI Trip Planner",
  description: "Start Your Adventure with AI-powered personalized trip plans",
  keywords: ["trip planner", "travel", "AI", "itinerary", "vacation planning"],
  authors: [{ name: "Tripper" }],
  openGraph: {
    title: "Tripper - AI Trip Planner",
    description: "Start Your Adventure with AI-powered personalized trip plans",
    type: "website",
    siteName: "Tripper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripper - AI Trip Planner",
    description: "Start Your Adventure with AI-powered personalized trip plans",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${caveat.variable} ${nunito.variable}`}>
      <body className="font-body antialiased min-h-screen">
        {/* SVG Filters for watercolor effects */}
        <svg className="watercolor-filter-defs" aria-hidden="true">
          <defs>
            {/* Watercolor edge filter */}
            <filter id="watercolor-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Gradient for map route */}
            <linearGradient id="watercolor-route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#FFA07A" />
              <stop offset="100%" stopColor="#FFD93D" />
            </linearGradient>

            {/* Paper texture filter */}
            <filter id="paper-texture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="desaturatedNoise"
              />
              <feBlend
                in="SourceGraphic"
                in2="desaturatedNoise"
                mode="overlay"
                result="textured"
              />
            </filter>
          </defs>
        </svg>

        {children}
      </body>
    </html>
  );
}
