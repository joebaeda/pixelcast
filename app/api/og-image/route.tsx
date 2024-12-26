import { pixelCastAbi, pixelCastAddress } from '@/lib/contract';
import { ImageResponse } from 'next/og';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const runtime = 'edge';

// Helper to decode Base64 tokenURI and extract the image URL
const extractImageUrl = (base64Uri: string): string => {
  try {
    const json = JSON.parse(atob(base64Uri.split(',')[1])); // Decode Base64 and parse JSON
    return json.image || ''; // Return the image URL from the decoded JSON
  } catch (error) {
    console.error('Error decoding Base64 tokenURI:', error);
    return '';
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get('tokenId');

  // Load the custom font
  const pixelifySansData = await fetch(new URL('../../fonts/PixelifySans-Bold.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  if (!tokenId) {
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#f1f1f1',
          backgroundSize: '30px 30px',
          background: 'radial-gradient(#e8e1b0 10%, transparent 10%)',
        }}>

          {/* Default Image left */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >

            <div
              style={{
                position: 'absolute',
                left: '25%',
                top: '50%',
                transform: 'translate(-25%, -50%)',
                width: '402px',
                height: '420px',
                borderWidth: 10,
                borderColor: '#e8e1b0',
                borderRadius: '5%',
                backgroundColor: '#d1c997',
                backgroundImage: `url('https://pixelcast.vercel.app/splash.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          {/* Title Right */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              right: '25%',
              top: '50%',
              transform: 'translate(25%, -50%)',
              width: '402px',
              height: '392px',
              fontSize: 92,
              fontWeight: '700px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Comic Sans MS',
              color: '#24231d',
              background: 'radial-gradient(#452654 26%, transparent 10%)',
            }}
          >
            <p style={{ margin: 0 }}>Pixel</p>
            <p style={{ marginBottom: 15, marginTop: 15, color: '#f1f1f1' }}>of</p>
            <p style={{ margin: 0 }}>Art</p>
          </div>


        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'PixelifySans',
            data: pixelifySansData,
            style: 'normal',
          },
        ],
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  try {
    const tokenURI: string = await publicClient.readContract({
      address: pixelCastAddress as `0x${string}`,
      abi: pixelCastAbi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    const imageUrl = extractImageUrl(tokenURI);

    if (!imageUrl) {
      throw new Error('Image URL not found in tokenURI');
    }

    const formattedUrl = imageUrl.startsWith('ipfs://')
      ? `https://gateway.pinata.cloud/ipfs/${imageUrl.slice(7)}`
      : imageUrl;

    const pixelImage = new ImageResponse(
      (
        <div style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#f1f1f1',
          backgroundSize: '30px 30px',
          background: 'radial-gradient(#e8e1b0 10%, transparent 10%)',
        }}>

          {/* NFT Image left */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >

            <div
              style={{
                position: 'absolute',
                left: '25%',
                top: '50%',
                transform: 'translate(-25%, -50%)',
                width: '402px',
                height: '420px',
                borderWidth: 10,
                borderColor: '#e8e1b0',
                borderRadius: '5%',
                backgroundColor: '#d1c997',
                backgroundImage: `url(${formattedUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          {/* Title Right */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              right: '25%',
              top: '50%',
              transform: 'translate(25%, -50%)',
              width: '402px',
              height: '392px',
              fontSize: 92,
              fontWeight: '700px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Comic Sans MS',
              color: '#24231d',
              background: 'radial-gradient(#452654 26%, transparent 10%)',
            }}
          >
            <p style={{ margin: 0 }}>Pixel</p>
            <p style={{ marginBottom: 15, marginTop: 15, color: '#f1f1f1' }}>of</p>
            <p style={{ margin: 0 }}>Art</p>
          </div>


        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'PixelifySans',
            data: pixelifySansData,
            style: 'normal',
          },
        ],
      }
    );

    const headers = new Headers(pixelImage.headers);
    headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=59"
    );

    return new Response(pixelImage.body, {
      headers,
      status: pixelImage.status,
      statusText: pixelImage.statusText,
    });

  } catch (error) {
    console.error('Error fetching tokenURI or generating image:', error);

    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#f1f1f1',
          backgroundSize: '30px 30px',
          background: 'radial-gradient(#e8e1b0 10%, transparent 10%)',
        }}>

          {/* Default Image left */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >

            <div
              style={{
                position: 'absolute',
                left: '25%',
                top: '50%',
                transform: 'translate(-25%, -50%)',
                width: '402px',
                height: '420px',
                borderWidth: 10,
                borderColor: '#e8e1b0',
                borderRadius: '5%',
                backgroundColor: '#d1c997',
                backgroundImage: `url('https://pixelcast.vercel.app/splash.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          {/* Title Right */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              right: '25%',
              top: '50%',
              transform: 'translate(25%, -50%)',
              width: '402px',
              height: '392px',
              fontSize: 92,
              fontWeight: '700px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Comic Sans MS',
              color: '#24231d',
            }}
          >
            <p style={{ margin: 0 }}>Pixel</p>
            <p style={{ marginBottom: 15, marginTop: 15, color: '#750c08', fontSize: 102, textDecoration: 'underline' }}>Not</p>
            <p style={{ margin: 0 }}>Found</p>
          </div>


        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'PixelifySans',
            data: pixelifySansData,
            style: 'normal',
          },
        ],
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

