import QRCode from "react-qr-code";

export function Redirect() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-block animate-bounce">
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Welcome to Pixel Cast
                    </h1>
                    <p className="text-xl text-purple-200">
                        This Pixel Cast is designed to work only with Farcaster client.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* QR Code Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-2xl">
                        <QRCode
                            value="https://warpcast.com/~/compose?text=Cast%20and%20Mint%20a%20Pixel%20Art%20Using%20Pixel Cast!%20Frame%20by%20@joebaeda&embeds[]=https://pixelcast.vercel.app"
                            className="w-full h-auto"
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        />
                    </div>

                    {/* Instructions Section */}
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-purple-500/20">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <span>How to use</span>
                            </h2>
                            <ol className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                                    <span>Open Warpcast or other Farcaster client on your device</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                                    <span>Scan the QR code or open using the button below</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                                    <span>Open the Pixel Cast frame within Warpcast</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                                    <span>Cast and mint your original Pixel art!</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="max-w-3xl mx-auto my-5">
                    <a href="https://warpcast.com/~/compose?text=Cast%20and%20Mint%20a%20Pixel%20Art%20Using%20Pixel Cast!%20Frame%20by%20@joebaeda&embeds[]=https://pixelcast.vercel.app" target="_blank">
                        <button className="w-full bg-purple-600 p-3 rounded-2xl text-xl font-bold text-white hover:bg-purple-700">Open In Warpcast</button>
                    </a>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-purple-300 text-sm">
                        Having trouble? <a className="font-bold text-purple-600" href="https://warpcast.com/joebaeda" target="_blank">Contact</a> support for more information.
                    </p>
                </div>
            </div>
        </div>
    );
}

