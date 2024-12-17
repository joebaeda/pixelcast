import Image from "next/image";

interface IHeader {
    username?: string;
    pfp?: string;
}

const Header = ({ username, pfp }: IHeader) => {

    return (
            <div className="absolute p-2 bg-[#4f2d61] rounded-xl flex top-4 right-4 flex-row space-x-2 items-center">
                <Image className="object-cover w-8 h-8 rounded-full" src={pfp as string} alt={username as string} width={35} height={35} priority />
                <p className="font-bold text-lg text-gray-200">{username}</p>
            </div>
    );
};

export default Header