import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Provider from "../providers/Provider";

const pixelifySans = localFont({
    src: "../fonts/PixelifySans-VariableFont.ttf",
    variable: "--font-pixel-sans",
    weight: "100 900",
});

export const revalidate = 300;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ tokenId: string }>;
}): Promise<Metadata> {
    const { tokenId } = await params;

    // Dynamically set the og-image based on the tokenId
    const ogImageUrl = `https://pixelcast.vercel.app/api/og-image?tokenId=${tokenId}`;

    return {
        title: "Pixel Cast | Everyday Pixel Cast",
        description:
            "Create and Mint any of your pixel art styles directly on farcaster client",
        openGraph: {
            title: `Pixel Cast | Token ${tokenId}`,
            description:
                "Create and Mint any of your pixel art styles directly on farcaster client",
            url: `https://pixelcast.vercel.app/${tokenId}`,
            type: "website",
            images: [
                {
                    url: ogImageUrl, // Use the dynamically generated og-image URL
                    width: 1200,
                    height: 630,
                    alt: `Pixel Art for Token ${tokenId}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `Pixel Cast | Token ${tokenId}`,
            description:
                "Create and Mint any of your pixel art styles directly on farcaster client",
            images: [ogImageUrl], // Use the dynamically generated og-image URL
        },
        icons: {
            icon: "/favicon.ico",
        },
        other: {
            "fc:frame": JSON.stringify({
                version: "next",
                imageUrl: ogImageUrl, // Use the dynamically generated og-image URL
                button: {
                    title: "Make Offer",
                    action: {
                        type: "launch_frame",
                        name: "Pixel Cast",
                        url: `https://pixelcast.vercel.app/${tokenId}`,
                        splashImageUrl:
                            "https://pixelcast.vercel.app/splash.svg",
                        splashBackgroundColor: "#ede4ca",
                    },
                },
            }),
        },
    };
}

export default function TokenDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${pixelifySans.variable} antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
