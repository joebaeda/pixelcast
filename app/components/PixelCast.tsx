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
import { Ellipsis, Palette, Trash2 } from 'lucide-react';
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

    if (modalMessage) {
      const timer = setTimeout(() => {
        setShowTransactionModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPending, isConfirming, isConfirmed, modalMessage]);


  // Notify user
  const notifyUser = useCallback(async (title: string, body: string) => {
    try {
      const response = await fetch('/api/send-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Notification failed.');
      }
    } catch (error) {
      console.error("Notification error:", error);
    }
  }, []);

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
    <>
      <header>
        <Header username={username} pfp={pfp} />
      </header>
      <main>
        <PixelGrid
          gridSize={{ width: 48, height: 48 }}
          selectedColor={selectedColor}
          canvasRef={canvasRef}
        />
        {showColorPicker && (
          <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
            <div className="flex space-y-4 flex-col bg-white p-4 rounded-md shadow-lg">
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
          <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-bold">{modalMessage}</p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 rounded-t-2xl mx-auto bottom-0 left-0 right-0 bg-[#281537] shadow-md p-4 z-50">
          <div className="flex mx-auto flex-row justify-between items-center space-x-4">

            <div className="flex flex-col space-y-1 items-center">
              <button
                disabled={isConfirming || isPending}
                onClick={() => setShowColorPicker(true)}
                className="rounded-full disabled:opacity-50"
              >
                <Palette className="w-6 h-6 text-gray-200" />
              </button>
              <p className="text-gray-200 text-sm font-bold">Color</p>
            </div>

            <div className="flex flex-col space-y-1 items-center">
              <button
                disabled={isConfirming || isPending}
                onClick={handleCast}
                className="rounded-full disabled:opacity-50"
              >
                {isConfirming || isPending ? (
                  <Ellipsis className="w-6 h-6 text-gray-200 animate-bounce" />
                ) : (
                  <CastButton className="w-6 h-6" />
                )}
              </button>
              <p className="text-gray-200 text-sm font-bold">Cast</p>
            </div>

            <div className="flex flex-col space-y-1 items-center">
              <button
                disabled={isConfirming || isPending}
                onClick={handleMint}
                className="rounded-full disabled:opacity-50"
              >
                {isConfirming || isPending ? (
                  <Ellipsis className="w-6 h-6 text-gray-200 animate-bounce" />
                ) : (
                  <BaseButton className="w-6 h-6" />
                )}
              </button>
              <p className="text-gray-200 text-sm font-bold">Mint</p>
            </div>

            <div className="flex flex-col space-y-1 items-center">
              <button
                disabled={isConfirming || isPending}
                onClick={handleClearCanvas}
                className="rounded-full disabled:opacity-50"
              >
                <Trash2 className="w-6 h-6 text-gray-200" />
              </button>
              <p className="text-gray-200 text-sm font-bold">Delete</p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default PixelCast;

