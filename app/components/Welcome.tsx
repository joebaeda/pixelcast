"use client";

import { useState, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import Image from "next/image";
import { pixelCastAbi, pixelCastAddress } from "@/lib/contract";
import PixelCastLogo from "./PixelCastLogo";

const extractImageUrl = (base64Uri: string): string => {
  try {
    const json = JSON.parse(atob(base64Uri.split(",")[1]));
    return json.image || "";
  } catch (error) {
    console.error("Error parsing tokenURI:", error);
    return "";
  }
};

const Welcome = () => {
  const [tokenURIs, setTokenURIs] = useState<string[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of NFTs per page

  // Fetch total supply of NFTs
  const { data: totalSupply } = useReadContract({
    address: pixelCastAddress as `0x${string}`,
    abi: pixelCastAbi,
    functionName: "totalSupply",
  });

  // Prepare contracts for batch reading
  const tokenIds = totalSupply ? Array.from({ length: Number(totalSupply) }, (_, i) => i + 1) : [];
  const contracts = tokenIds.map((tokenId) => ({
    address: pixelCastAddress as `0x${string}`,
    abi: pixelCastAbi,
    functionName: "tokenURI",
    args: [tokenId],
  }));

  const ownerContracts = tokenIds.map((tokenId) => ({
    address: pixelCastAddress as `0x${string}`,
    abi: pixelCastAbi,
    functionName: "ownerOf",
    args: [tokenId],
  }));

  // Batch read all tokenURIs
  const { data: tokenURIData } = useReadContracts({
    contracts,
  });
  const { data: ownerData } = useReadContracts({ contracts: ownerContracts });

  useEffect(() => {
    if (tokenURIData) {
      const uris = tokenURIData.map((result) => {
        if (result.status === "success") {
          const base64Uri = result.result as string;
          return extractImageUrl(base64Uri);
        }
        return "";
      });
      setTokenURIs(uris);
    }
  }, [tokenURIData]);

  // Extract and set owners
  useEffect(() => {
    if (ownerData) {
      const extractedOwners = ownerData.map((result) => {
        if (result.status === "success") return result.result as string;
        return "";
      });
      setOwners(extractedOwners);
    }
  }, [ownerData]);

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tokenURIs.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(tokenURIs.length / itemsPerPage);

  return (
    <div className="min-h-screen p-4 my-5 mx-auto max-w-4xl w-full">
      {/* Hero content */}
      <div className="flex flex-row justify-between items-center">
        <PixelCastLogo className="-ml-4 w-24 h-24" />
        <a href="https://warpcast.com/joebaeda" className="bg-[#9f6478] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#633846] transition-all duration-300 font-bold">
          Cast your Pixel
        </a>
      </div>
      <div className="flex my-10 flex-col space-y-2 max-w-lg justify-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow-md">
          Welcome to <span className="text-[#9f6478]">Pixel Cast!</span>
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Original pixel art that can only be created in the Farcaster client. There will only be
          10,000 pieces of pixel art that can be placed in this collection.
        </p>
      </div>

      {/* NFT Gallery */}
      <div className="relative mx-auto max-w-4xl w-full p-4 bg-white rounded-lg shadow-lg border-4 border-dashed border-yellow-500">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentData.length > 0 ? (
            currentData.map((uri, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 justify-center items-center p-4 bg-yellow-100 rounded-lg border border-yellow-400 text-center"
                >
                  <Image
                    src={
                      uri.startsWith("ipfs://")
                        ? `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}`
                        : uri
                    }
                    alt={`Scratch Art ${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-700 mt-2 font-bold">
                    {owners[index].slice(0, 6) + "..." + owners[index].slice(-4)}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No pixel art minted yet. Add your first one!
            </p>
          )}
        </div>

        {/* Pagination */}
        {tokenURIs.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#9f6478] text-white hover:bg-[#774556]"
                }`}
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#9f6478] text-white hover:bg-[#774556]"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
