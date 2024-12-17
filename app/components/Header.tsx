import Image from "next/image";

interface IHeader {
    username?: string;
    pfp?: string;
}

const Header = ({ username, pfp }: IHeader) => {

    return (
        <div className="fixed rounded-b-2xl mx-auto top-0 left-0 right-0 bg-[#281537] shadow-md p-4">
            <div className="flex bg-[#281537] text-gray-200 mx-auto flex-row justify-between items-center space-x-4">
                <Image className="object-cover w-10 h-10 rounded-full" src="/splash.png" alt="Pixel Cast" width={35} height={35} priority />
                <div className="flex space-x-3 items-center">
                    <Image className="object-cover w-8 h-8 rounded-full" src={pfp as string} alt={username as string} width={35} height={35} priority />
                    <p className="font-bold text-lg">{username}</p>
                </div>
            </div>
        </div>
    );
};

export default Header