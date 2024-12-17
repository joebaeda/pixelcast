'use client';

import { useState, useRef, useEffect } from 'react';
import PixelGrid from './PixelGrid';
import Header from './Header';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';
import { SketchPicker } from 'react-color';
import { Palette, Trash2 } from 'lucide-react';
import CastButton from './CastButton';
import BaseButton from './BaseButton';
import Loading from './Loading';
import { Redirect } from './Redirect';

const PixelCast = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Frame SDK
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  // Wagmi hooks
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [transactionModalMessage, setTransactionModalMessage] = useState<string | null>(null);

  // Load saved art
  useEffect(() => {
    const savedArt = localStorage.getItem('pixelArt');
    if (savedArt && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        canvasRef.current?.getContext('2d')?.drawImage(img, 0, 0);
      };
      img.src = savedArt;
    }
  }, []);

  // Transaction Modal Handler
  useEffect(() => {
    if (isPending) setTransactionModalMessage('Confirming...');
    else if (isConfirming) setTransactionModalMessage('Waiting...');
    else if (isConfirmed) setTransactionModalMessage('Transaction Confirmed! Success 🎉');
    else setTransactionModalMessage(null);

    const timer = setTimeout(() => setTransactionModalMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [isPending, isConfirming, isConfirmed]);

  // Load SDK
  useEffect(() => {
    const loadSDK = async () => {
      const sdkContext = await sdk.context;
      setContext(sdkContext);
      sdk.actions.ready({});
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      loadSDK();
    }
  }, [isSDKLoaded]);

  // Prevent render if SDK is not loaded
  if (!isSDKLoaded) return <Redirect />;

  // Save image to IPFS
  const handleSaveImage = (async (): Promise<string | undefined> => {
    if (canvasRef.current && context?.user?.username) {
      try {
        const dataURL = canvasRef.current.toDataURL('image/png');
        const blob = await fetch(dataURL).then((res) => res.blob());
        const formData = new FormData();
        formData.append('file', blob, context.user.username);

        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        return response.ok ? data.ipfsHash : undefined;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  });

  // Handle Cast
  const handleCast = (async () => {
    const ipfsHash = await handleSaveImage();
    if (ipfsHash) {
      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=This%20is%20really%20cool%20-%20Frame%20by%20@joebaeda&embeds[]=https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      );
    }
  });

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
    }
  };

  // Handle Clear
  const handleClearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    localStorage.removeItem('pixelArt');
  };

  return context?.user ? (
    <>
      <Header username={context.user.username} pfp={context.user.pfpUrl} />
      <PixelGrid gridSize={{ width: 48, height: 48 }} selectedColor={selectedColor} canvasRef={canvasRef} />

      {/* Color Picker */}
      {showColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
          <SketchPicker color={selectedColor} onChange={(color) => setSelectedColor(color.hex)} />
          <button
            onClick={() => setShowColorPicker(false)}
            className="w-full py-2 bg-blue-500 text-white rounded-2xl"
          >
            Close
          </button>
        </div>
      )}

      {/* Transaction Modal */}
      {transactionModalMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold">{transactionModalMessage}</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute space-x-2 bottom-0 bg-gray-800 p-4 w-full flex justify-around">
        <Palette onClick={() => setShowColorPicker(true)} />
        <CastButton onClick={handleCast} />
        <BaseButton onClick={handleMint} />
        <Trash2 onClick={handleClearCanvas} />
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default PixelCast;
