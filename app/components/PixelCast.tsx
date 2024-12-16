'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PixelGrid from './PixelGrid';
import ToolBar from './ToolBar';
import Header from './Header';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk from '@farcaster/frame-sdk';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

interface IProfile {
  fid: number;
  username: string;
  pfp: string;
}

const PixelCast = ({ fid, username, pfp }: IProfile) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Wagmi hooks
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  

  // Notify user
  const notifyUser = useCallback(async (title: string, body: string) => {
    try {
      const response = await fetch('/api/send-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid, title, body }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Notification failed.');
      }
    } catch (error) {
      console.error("Notification error:", error);
    }
  }, [fid]);

  // Save image to IPFS
  const handleSaveImage = useCallback(async (): Promise<string | undefined> => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL('image/png');
        const blob = await fetch(dataURL).then((res) => res.blob());
        const formData = new FormData();
        formData.append('file', blob, username);

        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        if (response.ok) return data.ipfsHash;
        else throw new Error(data.message || 'Upload failed.');
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }, [username]);

  // Handle casting an image
  const handleCast = useCallback(async () => {
    try {
      const ipfsHash = await handleSaveImage();
      if (ipfsHash) {
        sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=This%20is%20really%20cool%20-%20Frame%20by%20@joebaeda&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
        await notifyUser("Congratulations 🎉", "One pixel cast has been successfully sent to your timeline.");
      } else {
        console.error("Failed to send cast.");
      }
    } catch (error) {
      console.error("Error casting image:", error);
    }
  }, [handleSaveImage, notifyUser]);

  // Handle minting a token
  const handleMint = async () => {
    try {
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

        await notifyUser("Congratulations 🎉", "One Pixel Cast has been minted on the Base Network.");
      } else {
        console.error("Failed to upload drawing to IPFS.");
      }
    } catch (error) {
      console.error("Error minting image:", error);
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

  // Handle color change
  const handleColorChange = (color: string) => setSelectedColor(color);

  return (
    <div className="bg-gray-50">
      <header>
        <Header username={username} pfp={pfp} />
      </header>
      <main className="fixed px-4 inset-0 flex justify-center items-center">
        <PixelGrid
          gridSize={{ width: 48, height: 48 }}
          selectedColor={selectedColor}
          canvasRef={canvasRef}
        />
        <ToolBar
          selectedColor={selectedColor}
          isPending={isPending}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          onColorChange={handleColorChange}
          onClearCanvas={handleClearCanvas}
          onCastImage={handleCast}
          onBaseImage={handleMint}
        />
      </main>
    </div>
  );
};

export default PixelCast;
