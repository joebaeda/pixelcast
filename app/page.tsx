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
      if (frameContext) {
        setContext(frameContext);
        sdk.actions.ready({});
        setIsSDKLoaded(true);
      }
    }
    load();
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <Loading />
  }

  return (
    <>
      {context?.client.added ?
        <PixelCast fid={context.user.fid as number} username={context.user.username as string} pfp={context.user.pfpUrl as string} />
        : <Redirect />
      }
    </>
  )
}