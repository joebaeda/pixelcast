import { Trash2, Palette, } from 'lucide-react'
import BaseButton from './BaseButton'
import { useEffect, useState } from 'react'
import { SketchPicker } from "react-color";
import CastButton from './CastButton';

interface ToolBarProps {
  selectedColor: string
  chainId: number
  baseId: number
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  onColorChange: (color: string) => void
  onClearCanvas: () => void
  onCastImage: () => void
  onBaseImage: () => void
}

const ToolBar = ({
  selectedColor,
  chainId,
  baseId,
  isPending,
  isConfirming,
  isConfirmed,
  onColorChange,
  onClearCanvas,
  onCastImage,
  onBaseImage
}: ToolBarProps) => {
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

  return (
    <>
      {showColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
          <div className="flex space-y-4 flex-col bg-white p-4 rounded-md shadow-lg">
            <SketchPicker
              color={selectedColor}
              onChange={(color) => onColorChange(color.hex)}
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

      <div className="fixed rounded-t-2xl mx-auto bottom-0 left-0 right-0 bg-[#281537] shadow-md p-4">
        <div className="flex mx-auto flex-row justify-between items-center space-x-4">

          <div className="flex flex-col space-y-1 items-center">
            <button
              disabled={chainId !== baseId || isPending}
              onClick={() => setShowColorPicker(true)}
              className="rounded-full disabled:opacity-50"
            >
              <Palette className="w-6 h-6 text-gray-200" />
            </button>
            <p className="text-gray-200 text-sm font-bold">Color</p>
          </div>

          <div className="flex flex-col space-y-1 items-center">
            <button
              disabled={chainId !== baseId || isPending}
              onClick={() => onCastImage()}
              className="rounded-full disabled:opacity-50"
            >
              <CastButton className="w-6 h-6" />
            </button>
            <p className="text-gray-200 text-sm font-bold">Cast</p>
          </div>

          <div className="flex flex-col space-y-1 items-center">
            <button
              disabled={chainId !== baseId || isPending}
              onClick={() => onBaseImage()}
              className="rounded-full disabled:opacity-50"
            >
              <BaseButton className="w-6 h-6" />
            </button>
            <p className="text-gray-200 text-sm font-bold">Mint</p>
          </div>

          <div className="flex flex-col space-y-1 items-center">
            <button
              disabled={chainId !== baseId || isPending}
              onClick={onClearCanvas}
              className="rounded-full disabled:opacity-50"
            >
              <Trash2 className="w-6 h-6 text-gray-200" />
            </button>
            <p className="text-gray-200 text-sm font-bold">Delete</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default ToolBar