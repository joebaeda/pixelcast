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
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <Redirect />
  }

  return (
    <>
      {context?.client.added ?
        <PixelCast username={context.user.username as string} pfp={context.user.pfpUrl as string} />
        : <Loading />
      }
      {/*<PixelCast username={"Joe bae"} pfp={"/splash.png"} />*/}
    </>
  )
}