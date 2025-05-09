"use client";

import { useState } from "react";

interface SendCastProps {
    castText: string;
    castMentions: number;
    getIPFSHash: () => Promise<string>;
}

const SendCastButton = ({ castText, castMentions, getIPFSHash }: SendCastProps) => {
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const sendCast = async () => {
        if (!castText) return;

        setIsSending(true);

        try {
            const ipfsHash = await getIPFSHash();
            const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            const message = { castText, castMentions, imageUrl };

            const response = await fetch("/api/send-cast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                setIsSuccess(true)
            } else {
                setIsSuccess(false)
                throw new Error("Failed to send cast.")
            }

            await response.json();
        } catch (error: unknown) {
            console.error("Error sending cast:", (error as Error).message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <button
            disabled={!castText || isSending || isSuccess}
            onClick={sendCast}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-[#2f1b3a] to-[#4f2d61] shadow-lg disabled:cursor-not-allowed"
        >
            <p className="text-white font-semibold">
                {isSending ? "Casting..." : isSuccess ? "Congratulations 🎉" : "Make a Cast"}
            </p>
        </button>
    );
};

export default SendCastButton;
