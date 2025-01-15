'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PixelGrid from './components/PixelGrid';
import Image from "next/image";
import { useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk from '@farcaster/frame-sdk';
import { useViewer } from './providers/FrameContextProvider';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';
import { SketchPicker } from 'react-color';
import { Palette, Trash2 } from 'lucide-react';
import SendCastButton from './components/sendCast';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [embedHash, setEmbedHash] = useState("");
  const { fid, username, pfpUrl, url, token, added } = useViewer();

  // Wagmi
  const chainId = useChainId();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Fetch tokenId
  const { data: tokenId } = useReadContract({
    address: pixelCastAddress as `0x${string}`,
    abi: pixelCastAbi,
    functionName: "totalSupply",
  });

  // Basescan
  const linkToBaseScan = useCallback((hash?: string) => {
    if (hash) {
      sdk.actions.openUrl(`https://basescan.org/tx/${hash}`);
    }
  }, []);

  // Warpcast
  const linkToWarpcast = useCallback((tokenId: string) => {
    if (tokenId) {
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=this%20is%20really%20cool%20-%20just%20minted%20one!&embeds[]=https://pixelcast.vercel.app/${tokenId}`);
    }
  }, []);

  // Open Add Frame dialog
  useEffect(() => {
    if (!added) {
      sdk.actions.addFrame()
    }
  })

  // Mint Notif
  useEffect(() => {
    if (isConfirmed) {
      // Notify user
      async function mintNotif() {
        try {
            await fetch('/api/send-notify', {
              method: 'POST',
              mode: 'same-origin',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fid: 891914,
                notificationDetails: { url, token },
                title: "New Pixel Art Minted!",
                body: `@${username} has minted pixel art on @base network`,
                targetUrl: `https://pixelcast.vercel.app/${String(tokenId)}`,
              }),
            })
        } catch (error) {
          console.error("Notification error:", error);
        }
      };
      mintNotif();
    }

  }, [isConfirmed, token, tokenId, url, username])

  // Load saved art on mount
  useEffect(() => {
    const savedArt = localStorage.getItem('pixelArt');
    if (savedArt && canvasRef.current) {
      const imgElement = new window.Image(); // Avoid conflict by explicitly using window.Image
      imgElement.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.drawImage(imgElement, 0, 0);
      };
      imgElement.src = savedArt;
    }
  }, []);

  // Save image to IPFS
  const handleSaveImage = async () => {
    const canvas = canvasRef.current
    if (canvas) {
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/png');

      // Convert data URL to Blob
      const blob = await fetch(dataURL).then(res => res.blob());

      // Create FormData for Pinata upload
      const formData = new FormData();
      formData.append('file', blob, `pixelcast-${fid}.png`);
      try {

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          return data.ipfsHash; // Set the IPFS hash on success
        } else {
          console.log({ message: 'Something went wrong', type: 'error' });
        }
      } catch (err) {
        console.log({ message: 'Error uploading file', type: 'error', error: err });
      }
    }
  };

  // Handle Color
  const handleColorChange = (color: string) => setSelectedColor(color);

  // Handle Mint
  const handleMint = async () => {
    try {
      // Show a loading state
      console.log("Saving image to IPFS...");

      // Save the image and retrieve the IPFS hash
      const ipfsHash = await handleSaveImage();

      if (ipfsHash) {
        console.log("IPFS hash received:", ipfsHash);
        setEmbedHash(ipfsHash)

        writeContract({
          abi: pixelCastAbi,
          chainId: base.id,
          address: pixelCastAddress as `0x${string}`,
          functionName: "mint",
          value: parseEther("0.001"),
          args: [`ipfs://${ipfsHash}`],
        });

      } else {
        console.error("Failed to upload drawing to IPFS.");
      }
    } catch (error) {
      console.error("Error during the cast process:", error);
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      localStorage.removeItem('pixelArt');
    }
  };


  return (
    <main className="sm:min-h-screen bg-gray-50 min-h-[695px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

      {/* Header Section */}
      <div className="w-full bg-[#4f2d61] p-3 rounded-b-2xl flex flex-row justify-between">


        <div className="flex flex-row space-x-4">
          {/* Delete Pixel */}
          <button
            disabled={isConfirming || isPending}
            onClick={handleClearCanvas}
            className="disabled:opacity-50"
          >
            <Trash2 className="w-10 h-10 text-gray-200" />
          </button>
        </div>

        {/* Color picker & Profile */}
        <div className="flex flex-row space-x-4">
          <button
            disabled={isConfirming || isPending}
            onClick={() => setShowColorPicker(true)}
            className="disabled:opacity-50"
          >
            <Palette className="w-10 h-10 text-gray-200" />
          </button>
          <div className="flex text-white flex-row justify-between items-center gap-2">
            <Image className="w-10 h-10 object-cover rounded-full" src={pfpUrl as string} alt={username as string} width={50} height={50} priority />
            <p className="font-bold">{username}</p>
          </div>
        </div>

      </div>

      {/* Canvas Section */}
      <div className="w-full p-4 flex-1 flex mx-auto items-center justify-center">

        {/* Canvas */}
        <PixelGrid
          gridSize={{ width: 24, height: 24 }}
          selectedColor={selectedColor}
          canvasRef={canvasRef}
        />

      </div>

      {/* Mint Pixel Cast and Send notif to Dev */}
      <div className="w-full sm:p-0 px-4 max-w-[384px] mx-auto">
        <div className="flex flex-col w-full md:flex-row gap-4 justify-center items-center">
          <SendCastButton castText={`New masterpiece of pixel art by `} getIPFSHash={() => handleSaveImage()} castMentions={fid} />
          <button
            disabled={chainId !== base.id || isConfirming || isPending}
            onClick={handleMint}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-[#2f1b3a] to-[#4f2d61] shadow-lg disabled:cursor-not-allowed"
          >
            <p className="text-white font-semibold">
              {isPending ? "Confirming..." : isConfirming ? "Waiting..." : "Mint to Base"}
            </p>
          </button>
        </div>
      </div>


      {showColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col space-y-4 bg-white p-4 rounded-md shadow-lg">
            <SketchPicker
              color={selectedColor}
              onChange={(color) => handleColorChange(color.hex)}
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full py-2 rounded-2xl bg-gradient-to-r from-[#4f2d61] to-[#2f1b3a] text-white text-2xl font-semibold hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Success */}
      {isConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg w-[90%] max-w-[360px] aspect-square p-4 space-y-5">
            <Image
              src={`https://gateway.pinata.cloud/ipfs/${embedHash}`}
              width={360}
              height={360}
              alt={`Pixel Art by ${username}`}
              className="object-cover border border-gray-300 rounded-2xl w-full h-full"
              priority
            />
            <div className="flex flex-row gap-2 w-full">
              <button
                className="w-full py-4 bg-blue-500 text-white text-2xl font-semibold hover:bg-blue-600 transition"
                onClick={() => linkToBaseScan(hash)}
              >
                Proof
              </button>
              <button
                className="w-full py-4 bg-purple-500 text-white text-2xl font-semibold hover:bg-purple-600 transition"
                onClick={() => linkToWarpcast(String(tokenId))}
              >
                Cast
              </button>
            </div>
          </div>
        </div>
      )}

    </main>

  );
};