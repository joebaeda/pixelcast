"use client";

import { useReadContract } from "wagmi";
import Image from "next/image";
import { pixelCastAbi, pixelCastAddress } from "@/lib/contract";
import { use, useCallback, useEffect, useState } from "react";
import sdk from '@farcaster/frame-sdk';
import { ArrowBigLeft } from "lucide-react";
import { useViewer } from "../providers/FrameContextProvider";

const extractImageUrl = (base64Uri: string): string => {
    try {
        const json = JSON.parse(atob(base64Uri.split(",")[1]));
        return json.image || "";
    } catch (error) {
        console.error("Error parsing tokenURI:", error);
        return "";
    }
};


export default function TokenDetails({
    params,
}: {
    params: Promise<{ tokenId: string }>
}) {
    const { tokenId }  = use(params)
    const [tokenURIs, setTokenURIs] = useState("");
    const { username, pfpUrl } = useViewer();

    const { data: tokenURIData } = useReadContract({
        address: pixelCastAddress as `0x${string}`,
        abi: pixelCastAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
    });

    const linkToOpensea = useCallback((tokenId: string) => {
        if (tokenId) {
            sdk.actions.openUrl(`https://opensea.io/assets/base/pixelCastAddress/${tokenId}`);
        }
    }, []);

    useEffect(() => {
        if (tokenURIData) {
            const uris = extractImageUrl(tokenURIData);
            setTokenURIs(uris);
        }
    }, [tokenURIData]);

    const closeFrame = () => {
        sdk.actions.close()
    };

    return (
        <main className="sm:min-h-screen bg-gray-50 min-h-[695px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

            {/* Header section */}
            <div className="w-full bg-[#4f2d61] p-3 rounded-b-2xl flex flex-row justify-between">

                {/* Back */}
                <button
                    onClick={closeFrame}
                    className="disabled:opacity-50"
                >
                    <ArrowBigLeft className="w-10 h-10 text-gray-200" />
                </button>

                {/* Profile */}
                <div className="flex text-white flex-row justify-between items-center gap-2">
                    <Image className="w-10 h-10 object-cover rounded-full" src={pfpUrl as string} alt={username as string} width={50} height={50} priority />
                    <p className="font-bold">{username}</p>
                </div>

            </div>

            {/* Pixel art detail */}
            <div className="w-full p-4 flex flex-col justify-center items-center mx-auto max-w-[384px] space-y-5">
                {tokenURIs ? (
                    <>
                        <Image
                            src={tokenURIs.startsWith("ipfs://")
                                ? `https://gateway.pinata.cloud/ipfs/${tokenURIs.slice(7)}`
                                : tokenURIs}
                            alt={`Scratch Art ${tokenId}`}
                            width={200}
                            height={200}
                            className="w-full max-h-[384px] p-4 bg-white rounded-2xl mx-auto"
                        />


                        <button
                            className="w-full py-4 bg-purple-500 text-white text-2xl rounded-2xl font-semibold hover:bg-purple-600 transition"
                            onClick={() => linkToOpensea(tokenId)}
                        >
                            Make Offer
                        </button>
                    </>
                ) : (
                    <div className="fixed inset-0 flex max-w-[300px] mx-auto justify-center items-center text-gray-500 text-center col-span-3">
                        No Pixel art minted yet. Add your first one!
                    </div>
                )}
            </div>
        </main>
    );
}
