'use client';

import { useState, useRef, useEffect } from 'react';
import PixelGrid from './PixelGrid';
import ToolBar from './ToolBar';
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk from '@farcaster/frame-sdk';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

interface IProfile {
  fid: number
  username: string
}

const PixelCast = ({fid, username}: IProfile) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const chainId = useChainId();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Handle casting an image (to Farcaster and notify user)
  const handleCast = async () => {
    const ipfsHash = await handleSaveImage();
    if (ipfsHash) {
      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=This%20is%20really%20cool%20-%20Frame%20by%20@joebaeda&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      );

      await notifyUser("Congratulations 🎉", "One pixel cast has been successfully sent to your timeline.");
    } else {
      console.error("Failed to send cast.");
    }
  };

  // Handle minting a token with an image
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

      await notifyUser("Congratulations 🎉", "One Pixel Cast has been minted on the Base Network.");
    } else {
      console.error("Failed to upload drawing to IPFS.");
    }
  };

  // Notify user via API
  const notifyUser = async (title: string, body: string) => {
    try {
      const response = await fetch('/api/send-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({fid, title, body }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'An error occurred');
      return result;
    } catch (error) {
      console.error("Notification API error:", error);
    }
  };

  // Load saved art on mount
  useEffect(() => {
    const savedArt = localStorage.getItem('pixelArt');
    if (savedArt && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      };
      img.src = savedArt;
    }
  }, []);

  // Handle color selection
  const handleColorChange = (color: string) => setSelectedColor(color);

  // Clear canvas and local storage
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('pixelArt');
  };

  // Save canvas to IPFS
  const handleSaveImage = async (): Promise<string | undefined> => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const blob = await fetch(dataURL).then((res) => res.blob());
      const formData = new FormData();
      formData.append('file', blob, username);

      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        if (response.ok) return data.ipfsHash;
        else console.error('Upload error:', data);
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  return (
    <div className="bg-gray-100">
      <PixelGrid
        gridSize={{ width: 48, height: 48 }}
        selectedColor={selectedColor}
        canvasRef={canvasRef}
      />
      <ToolBar
        selectedColor={selectedColor}
        chainId={chainId}
        baseId={base.id}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        onColorChange={handleColorChange}
        onClearCanvas={handleClearCanvas}
        onCastImage={handleCast}
        onBaseImage={handleMint}
      />
    </div>
  );
};

export default PixelCast;
