import Image from "next/image";
import Ethereum from "./Ethereum";

interface IHeader {
    username: string;
    pfp: string;
    balance: string;
}

const Header = ({ username, pfp, balance }: IHeader) => {
    return (
        <div className="fixed rounded-b-2xl mx-auto top-0 left-0 right-0 bg-[#281537] shadow-md p-4">
            <div className="flex text-gray-200 mx-auto flex-row justify-between items-center space-x-4">
                <div className="flex space-x-2 items-center">
                    <Ethereum className="w-10 h-10" />
                    <p className="font-bold"> {balance}</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Image className="object-cover w-10 h-10 rounded-full" src={pfp} alt={username} width={35} height={35} priority />
                    <p className="font-bold pr-3">{username}</p>
                </div>
            </div>
        </div>
    )
}

export default Header