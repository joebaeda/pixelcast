"use client"

import { useCallback, useEffect, useState } from 'react';
import PixelCast from './components/PixelCast'
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import Loading from './components/Loading';
import Welcome from './components/Welcome';

export default function Home() {

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

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

  const addScratch = useCallback(async () => {
    try {

      await sdk.actions.addFrame();

    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }, []);

  if (!isSDKLoaded) {
    return <Loading />;
  }

  if (isSDKLoaded && !context?.client.added) {
    return <Welcome addScratch={addScratch} />
  }

  return (
    <PixelCast username={context?.user.username as string} pfp={context?.user.pfpUrl as string} />
    //<PixelCast username={"Joe bae"} pfp={"/splash.png"} />

  )
}