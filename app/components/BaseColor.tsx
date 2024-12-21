"use client"

import { useState, useEffect } from "react"
import { useReadContract, useReadContracts } from "wagmi"
import { Address, parseAbi } from "viem"

const BaseColorContract = {
    address: "0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB" as Address, // Base Color
    abi: parseAbi([
        "function currentTokenId() public view returns (uint256)",
        "function ownerOf(uint256 tokenId) public view returns (address)",
        "function tokenIdToColor(uint256 tokenId) public view returns (string)",
    ]),
}

interface BaseColorProps {
    colorOwner: Address | string
}

const BaseColor = ({ colorOwner }: BaseColorProps) => {
    const [colors, setColors] = useState<string[]>([])

    // Fetch total supply of NFTs
    const { data: currentTokenId } = useReadContract({
        address: BaseColorContract.address,
        abi: BaseColorContract.abi,
        functionName: "currentTokenId",
    })

    // Fetch owners and colors for each token ID
    const { data: tokenData } = useReadContracts({
        contracts:
            currentTokenId && currentTokenId > 0
                ? Array.from({ length: Number(currentTokenId) }, (_, i) => ({
                    ...BaseColorContract,
                    functionName: "ownerOf",
                    args: [BigInt(i + 1)],
                }))
                : [],
    })

    const { data: colorData } = useReadContracts({
        contracts:
            currentTokenId && currentTokenId > 0
                ? Array.from({ length: Number(currentTokenId) }, (_, i) => ({
                    ...BaseColorContract,
                    functionName: "tokenIdToColor",
                    args: [BigInt(i + 1)],
                }))
                : [],
    })

    useEffect(() => {
        if (tokenData && colorData && currentTokenId) {
            const ownedColors: string[] = []

            for (let i = 0; i < Number(currentTokenId); i++) {
                const owner = tokenData[i].result
                const color = colorData[i].result
                if (
                    owner &&
                    color &&
                    typeof owner === "string" &&
                    typeof color === "string" &&
                    String(owner).toLowerCase() === colorOwner.toLowerCase()
                ) {
                    ownedColors.push(color)
                }
            }

            setColors(ownedColors)
        }
    }, [tokenData, colorData, currentTokenId, colorOwner])

    return (
        <div className="relative w-full p-4 bg-white rounded-lg shadow-lg border-4 border-dashed border-yellow-500">
            {/* Display colors owned by the connected address */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    )
}

export default BaseColor