import LoadingAnimation from "../icons/LoadingAnimation"

const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col space-y-3 items-center justify-center z-10 bg-yellow-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <LoadingAnimation className="w-48 h-48" />
        </div>
    )
}

export default Loading