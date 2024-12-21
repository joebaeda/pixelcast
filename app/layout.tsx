import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./providers/Provider";

const pixelifySans = localFont({
  src: "./fonts/PixelifySans-VariableFont.ttf",
  variable: "--font-pixel-sans",
  weight: "100 900",
});

const appUrl = "https://pixelcast.vercel.app";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/og-image.jpg`,
  button: {
    title: "Cast Your Pixel",
    action: {
      type: "launch_frame",
      name: "Pixel Cast",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.svg`,
      splashBackgroundColor: "#ede4ca",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pixel Cast | Everyday Pixel Cast",
    description: "Create and Mint any of your pixel art styles directly on farcaster client",
    openGraph: {
      title: "Pixel Cast | Everyday Pixel Cast",
      description: "Create and Mint any of your pixel art styles directly on farcaster client",
      url: 'https://pixelcast.vercel.app',
      type: 'website',
      images: [
        {
          url: 'https://pixelcast.vercel.app/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Pixel Cast',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Pixel Cast | Everyday Pixel Cast",
      description: "Create and Mint any of your pixel art styles directly on farcaster client",
      images: ['https://pixelcast.vercel.app/og-image.jpg'],
    },
    icons: {
      icon: '/favicon.ico',
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.variable} antialiased`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
