"use client"

import Image from "next/image";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from 'viem';
import Ethereum from "./Ethereum";

interface IHeader {
    username?: string;
    pfp?: string;
}

const Header = ({ username, pfp }: IHeader) => {
    const chainId = useChainId();
    const { address } = useAccount();
    const balance = useBalance({
        address: address,
        chainId: chainId,
    })
  
    return (
        <div className="fixed rounded-b-2xl mx-auto top-0 left-0 right-0 bg-[#281537] shadow-md p-4">
        <div className="flex text-gray-200 mx-auto flex-row justify-between items-center space-x-4">
            <div className="flex space-x-2 items-center">
                <Ethereum className="w-10 h-10" />
                <p className="font-bold"> {address ? parseFloat(formatEther(balance.data?.value as bigint)).toFixed(4) : "0"}</p>
            </div>
            <div className="flex space-x-2 items-center">
                <Image className="object-cover w-10 h-10 rounded-full" src={pfp as string} alt={username as string} width={35} height={35} priority />
                <p className="font-bold pr-3">{username}</p>
            </div>
        </div>
    </div>
    );
  };

export default Header