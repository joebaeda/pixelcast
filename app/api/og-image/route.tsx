import { ImageResponse } from 'next/og';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { pixelCastAbi, pixelCastAddress } from '@/lib/contract'; // Update with your actual contract details

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

  if (!tokenId) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            color: 'white',
            background: 'linear-gradient(to bottom right, #4f2d61, #2f1b3a)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Pixel Art Project
        </div>
      ),
      {
        width: 384,
        height: 384,
      }
    );
  }

  // Initialize the public client with viem
  const publicClient = createPublicClient({
    chain: base, // Use the correct chain for your project
    transport: http(),
  });

  try {
    // Fetch the Base64 tokenURI from the smart contract
    const tokenURI: string = await publicClient.readContract({
      address: pixelCastAddress as `0x${string}`,
      abi: pixelCastAbi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)], // Pass the tokenId as a BigInt
    });

    // Decode the Base64 tokenURI and extract the image URL
    const imageUrl = extractImageUrl(tokenURI);

    if (!imageUrl) {
      throw new Error('Image URL not found in tokenURI');
    }

    // Format the image URL if it's an IPFS URI
    const formattedUrl = imageUrl.startsWith('ipfs://')
      ? `https://gateway.pinata.cloud/ipfs/${imageUrl.slice(7)}`
      : imageUrl;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            color: 'white',
            justifyItems: 'center',
            background: 'linear-gradient(to bottom right, #4f2d61, #2f1b3a)',
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${formattedUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(1.2)',
            }}
          />
        </div>
      ),
      {
        width: 384,
        height: 384,
      }
    );
  } catch (error) {
    console.error('Error fetching tokenURI or generating image:', error);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            color: 'white',
            background: 'linear-gradient(to bottom right, #4f2d61, #2f1b3a)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Error Loading Token
        </div>
      ),
      {
        width: 384,
        height: 384,
      }
    );
  }
}
