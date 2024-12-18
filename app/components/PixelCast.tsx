'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PixelGrid from './PixelGrid';
import Header from './Header';
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';
import { SketchPicker } from 'react-color';
import { Palette, Trash2 } from 'lucide-react';
import CastButton from './CastButton';
import BaseButton from './BaseButton';
import Loading from './Loading';
import Welcome from './Welcome';
import ConfirmedModal from './ConfirmedModal';

const PixelCast = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [embedHash, setEmbedHash] = useState("");
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  // Wagmi
  const chainId = useChainId();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Basescan
  const linkToBaseScan = useCallback((hash?: string) => {
    if (hash) {
      sdk.actions.openUrl(`https://basescan.org/tx/${hash}`);
    }
  }, []);

  // Warpcast
  const linkToWarpcast = useCallback((ipfs?: string) => {
    if (ipfs) {
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=this%20is%20really%20cool%20-%20just%20minted%20one!&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfs}`);
    }
  }, []);

  // Handle Mint
  const handleMint = async () => {
    const ipfsHash = await handleSaveImage();
    if (ipfsHash) {
      writeContract({
        abi: pixelCastAbi,
        chainId: base.id,
        address: pixelCastAddress,
        functionName: 'mint',
        value: parseEther('0.001'),
        args: [`ipfs://${ipfsHash}`],
      });

      setEmbedHash(ipfsHash)

    } else {
      console.error("Failed to Mint Nft.");
    }
  };

  // Save image to IPFS
  const handleSaveImage = async (): Promise<string | undefined> => {
    if (!canvasRef.current) {
      console.error("Canvas reference is missing.");
      return;
    }
  
    try {
      // Convert the canvas content to a data URL and blob
      const dataURL = canvasRef.current.toDataURL('image/png');
      const blob = await fetch(dataURL).then((res) => res.blob());
  
      // Create FormData and append the file
      const formData = new FormData();
      const username = context?.user?.username || 'pixelcast';
      formData.append('file', blob, username);
  
      // Send the POST request to the /api/upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      // Parse the response
      if (response.ok) {
        const data = await response.json();
        return data.ipfsHash; // Return the IPFS hash if successful
      } else {
        // Handle errors in the response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  

  // Handle Cast
  const handleCast = useCallback(async () => {
    if (!canvasRef.current) {
      console.error("Canvas reference is missing.");
      return;
    }
  
    try {
      // Save image to IPFS
      const dataURL = canvasRef.current.toDataURL("image/png");
      const blob = await fetch(dataURL).then((res) => res.blob());
      const formData = new FormData();
      const username = context?.user?.username || "pixelcast";
      formData.append("file", blob, username);
  
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      let ipfsHash;
      if (response.ok) {
        const data = await response.json();
        ipfsHash = data.ipfsHash;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
  
      if (ipfsHash) {
        sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=This%20is%20really%20cool%20-%20Frame%20by%20@joebaeda&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
      } else {
        console.error("Failed to send cast.");
      }
    } catch (error) {
      console.error("Error handling cast:", error);
    }
  }, [context?.user?.username]);
  

  // Load saved art on mount
  useEffect(() => {
    const savedArt = localStorage.getItem('pixelArt');
    if (savedArt && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      };
      img.src = savedArt;
    }
  }, []);

  // Farcaster
  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      setContext(frameContext);
      await sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const addScratch = useCallback(async () => {
    try {

      await sdk.actions.addFrame();

    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }, []);

  if (!isSDKLoaded) {
    return <Loading />;
  }

  if (isSDKLoaded && !context?.client.added) {
    return <Welcome addScratch={addScratch} />
  }

  // Clear canvas
  const handleClearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      localStorage.removeItem('pixelArt');
    }
  };

  // Handle Color
  const handleColorChange = (color: string) => setSelectedColor(color);

  return (
    <div className="min-h-screen p-4 bg-gray-50 relative">

      {/* Header Section */}
      <div className="w-full flex mb-10 flex-row justify-between">
        <div>
          {/* Delete Pixel */}
          <button
            disabled={isConfirming || isPending}
            onClick={handleClearCanvas}
            className="rounded-xl bg-[#4f2d61] p-2 disabled:opacity-50"
          >
            <Trash2 className="w-8 h-8 text-gray-200" />
          </button>
        </div>
        <div className="flex flex-row space-x-4">
          {/* Color picker */}
          <button
            disabled={isConfirming || isPending}
            onClick={() => setShowColorPicker(true)}
            className="rounded-xl bg-[#4f2d61] p-2 disabled:opacity-50"
          >
            <Palette className="w-8 h-8 text-gray-200" />
          </button>
          <Header username={context?.user.username as string} pfp={context?.user.pfpUrl as string} />
        </div>
      </div>

      {/* Canvas Section */}
      <div className="flex max-w-[384px] mx-auto flex-col mb-10 space-y-6 items-center justify-center">

        {/* Canvas */}
        <div className="flex items-center justify-center">
          <PixelGrid
            gridSize={{ width: 48, height: 48 }}
            selectedColor={selectedColor}
            canvasRef={canvasRef}
          />
        </div>

        {/* Buttons Section */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">

          {/* Make a Cast */}
          <button
            disabled={isPending}
            onClick={handleCast}
            className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#4f2d61] to-[#30173d] shadow-lg flex flex-row sm:justify-start justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <CastButton className="w-8 h-8" />
            <p className="text-white text-lg font-semibold">Cast it Now!</p>
          </button>

          {/* Mint Pixel Cast */}
          <button
            disabled={chainId !== base.id || isPending || isConfirming}
            onClick={handleMint}
            className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#4f2d61] to-[#2f1b3a] shadow-lg flex flex-row sm:justify-start justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {isPending ? "Confirming..." : isConfirming ? "Waiting..." : <>
              <BaseButton className="w-8 h-8" />
              <p className="text-white text-lg font-semibold">Mint it Now!</p>
            </>
            }
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
              className="w-full py-2 rounded-2xl bg-blue-500 text-white text-2xl font-semibold hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Success */}
      {isConfirmed && (
        <ConfirmedModal ipfs={embedHash} username={context?.user.username as string} hash={hash as string} linkToBaseScan={(hash) => linkToBaseScan(hash)} linkToWarpcast={(embedHash) => linkToWarpcast(embedHash)} />
      )}

    </div>

  );
};

export default PixelCast;
