const Footer = () => {
    return (
        <p className="text-center text-sm font-semibold">
            &copy; {new Date().getFullYear()} Built with ❤ By{" "}
            <span><a target="_blank" href="https://warpcast.com/joebaeda" className="text-blue-600">Joebada</a></span>
        </p>
    )
}

export default Footer