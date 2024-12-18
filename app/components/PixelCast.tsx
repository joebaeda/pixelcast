'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PixelGrid from './PixelGrid';
import Header from './Header';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk from '@farcaster/frame-sdk';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';
import { SketchPicker } from 'react-color';
import { Palette, Trash2 } from 'lucide-react';
import CastButton from './CastButton';
import BaseButton from './BaseButton';

interface IProfile {
  username: string;
  pfp: string;
}

const PixelCast = ({ username, pfp }: IProfile) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Wagmi hooks
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) {
      setModalMessage("Confirming...");
      setShowTransactionModal(true);
    } else if (isConfirming) {
      setModalMessage("Waiting...");
      setShowTransactionModal(true);
    } else if (isConfirmed) {
      setModalMessage("Transaction Confirmed! Success 🎉");
      setShowTransactionModal(true);
    } else {
      setModalMessage(null);
    }
  }, [isPending, isConfirming, isConfirmed, modalMessage]);

  // Save image to IPFS
  const handleSaveImage = async (): Promise<string | undefined> => {
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
  };

  // Handle casting an image
  const handleCast = useCallback(async () => {
    try {
      const ipfsHash = await handleSaveImage();
      if (ipfsHash) {
        sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=This%20is%20really%20cool%20-%20Frame%20by%20@joebaeda&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
      } else {
        console.error("Failed to send cast.");
      }
    } catch (error) {
      console.error("Error casting image:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Header username={username} pfp={pfp} />
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
            disabled={isConfirming || isPending}
            onClick={handleCast}
            className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#4f2d61] to-[#30173d] shadow-lg flex flex-row sm:justify-start justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <CastButton className="w-8 h-8" />
            <p className="text-white text-lg font-semibold">Cast it Now!</p>
          </button>

          {/* Mint Pixel Cast */}
          <button
            disabled={isConfirming || isPending}
            onClick={handleMint}
            className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#4f2d61] to-[#2f1b3a] shadow-lg flex flex-row sm:justify-start justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <BaseButton className="w-8 h-8" />
            <p className="text-white text-lg font-semibold">Mint it Now!</p>
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

      {showTransactionModal && modalMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold">{modalMessage}</p>
          </div>
        </div>
      )}

    </div>

  );
};

export default PixelCast;
