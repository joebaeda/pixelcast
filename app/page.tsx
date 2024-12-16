"use client"

import { useEffect, useState } from 'react';
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
      <PixelCast fid={context.user.fid as number} username={context.user.username as string} pfp={context.user.pfpUrl as string} />
  )
}