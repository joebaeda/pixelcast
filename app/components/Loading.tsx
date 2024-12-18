import LoadingAnimation from "./LoadingAnimation"

const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col space-y-3 items-center justify-center z-10 bg-yellow-50">
            <LoadingAnimation />
        </div>
    )
}

export default Loading