"use client"

import { useEffect, useState } from 'react';
import Footer from './components/Footer'
import Header from './components/Header'
import PixelCast from './components/PixelCast'
import { Redirect } from './components/Redirect';
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import Loading from './components/Loading';

export default function Home() {

  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext>()

  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      setContext(frameContext);
      if (frameContext) {
        sdk.actions.ready()
        setIsSDKLoaded(true)
        sdk.actions.addFrame()
      }
    }
    load();
  }, []);

  if (!isSDKLoaded) {
    return <Redirect />
  }

  if (!context) {
    return <Loading />
  }

  return (
    <div className="bg-gray-50">
      <header>
        <Header username={context.user.username as string} pfp={context.user.pfpUrl as string} balance={"0"} />
      </header>
      <main className="flex p-4 min-h-screen items-center justify-center">
        <PixelCast fid={context.user.fid as number} username={context.user.username as string} />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}