import type { Metadata } from "next";
import "./globals.css";
import Provider from "./providers/Provider";

const frame = {
  version: "next",
  imageUrl: "https://pixelcast.vercel.app/og-image.jpg",
  button: {
    title: "Cast Your Pixel",
    action: {
      type: "launch_frame",
      name: "Pixel Cast",
      url: "https://pixelcast.vercel.app/og-image.jpg",
      splashImageUrl: "https://pixelcast.vercel.app/splash.png",
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
      <body className="font-sans antialiased">
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
