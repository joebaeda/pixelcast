import Image from "next/image";

interface IConfirmed {
    ipfs: string
    username: string
    hash: string
    linkToBaseScan: (hash: string) => void
    linkToWarpcast: (ipfs: string) => void
}

const Transaction = ({ ipfs, username, hash, linkToBaseScan, linkToWarpcast }: IConfirmed) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg w-[90%] max-w-[360px] aspect-square p-4 space-y-5">
                <Image
                    src={`https://gateway.pinata.cloud/ipfs/${ipfs}`}
                    width={360}
                    height={360}
                    alt={`Scratch Of Art by ${username}`}
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
                        onClick={() => linkToWarpcast(ipfs)}
                    >
                        Cast
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Transaction;