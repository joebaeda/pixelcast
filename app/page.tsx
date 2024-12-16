"use client"

import { useEffect, useState } from 'react';
import Footer from './components/Footer'
import Header from './components/Header'
import PixelCast from './components/PixelCast'
import { Redirect } from './components/Redirect';
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem'

export default function Home() {

  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext>()

  const { address } = useAccount()
  const balance = useBalance({
    address: address,
  })

  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      setContext(frameContext);
      await sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div></div>;
  }

  return (
    <>
      {address && context?.user.fid ? (
        <div className="bg-gray-50">
          <header>
            <Header username={context.user.username as string} pfp={context.user.pfpUrl as string} balance={parseFloat(formatEther(balance.data?.value as bigint)).toFixed(3)} />
          </header>
          <main className="flex p-4 min-h-screen items-center justify-center">
            <PixelCast fid={context.user.fid} username={context.user.username as string} />
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      ) : (
        <Redirect />
      )}
    </>
  )
}