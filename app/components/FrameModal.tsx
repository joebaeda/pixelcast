import Image from "next/image";

interface FrameModalProps {
    username: string
    installFrame: () => void
    uninstallFrame: () => void
}

const FrameModal = ({ username, installFrame, uninstallFrame }: FrameModalProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-[#372441] bg-opacity-80">
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg w-[90%] max-w-[360px] aspect-square p-4 space-y-5">
                <Image
                    src="/splash.png"
                    width={360}
                    height={360}
                    alt={username}
                    className="object-cover rounded-2xl w-full h-full"
                    priority
                />
                <div className="flex flex-row gap-2 w-full">
                    <button
                        className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#2f1b3a] to-[#4f2d61] shadow-lg flex flex-row justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        onClick={() => uninstallFrame()}
                    >
                        Close
                    </button>
                    <button
                        className="w-full sm:w-auto flex-1 p-3 rounded-xl bg-gradient-to-r from-[#4f2d61] to-[#30173d] shadow-lg flex flex-row justify-center items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        onClick={() => installFrame()}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FrameModal;