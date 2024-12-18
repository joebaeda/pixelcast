import Image from "next/image";

interface IHeader {
    username: string;
    pfp: string;
}

const Header = ({ username, pfp }: IHeader) => {

    return (
        <div className="flex bg-[#4f2d61] text-white rounded-2xl flex-row justify-between items-center gap-2">
            <Image className="object-cover rounded-l-2xl" src={pfp as string} alt={username as string} width={50} height={50} priority />
            <p className="font-bold pr-3">{username}</p>
        </div>
    );
};

export default Header