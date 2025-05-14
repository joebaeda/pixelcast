export async function GET() {

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjk0NjUzMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDAwMTAyODZBMzMxM0U0RjNCNzE5MGJlZWFGYjZmMGU3NTlmMTM0OUIifQ",
      payload: "eyJkb21haW4iOiJwaXhlbGNhc3QudmVyY2VsLmFwcCJ9",
      signature: "MHg3NGU1ODZkOGVjOGM1MjA2NjM2OGU1OTlkYTFlYTJmY2FmMWQwNzE1MzgwYmE4NGMyYTQ0MTA0MDhhMDYzYTA2MTJjYjA3ZGY3MDIwOTdlY2YxYTYwNmRjYWM2ZTdmMzIwZjZjYThjNGI1MGY0MjI2YmU0ZWM4ZTkwMTBhNGMxNzFj"
    },
    frame: {
      version: "1",
      name: "Pixel Cast",
      iconUrl: "https://pixelcast.vercel.app/splash.png",
      homeUrl: "https://pixelcast.vercel.app",
      imageUrl: "https://pixelcast.vercel.app/og-image.jpg",
      buttonTitle: "Cast your Pixel!",
      splashImageUrl: "https://pixelcast.vercel.app/splash.svg",
      splashBackgroundColor: "#ede4ca",
      webhookUrl: "https://pixelcast.vercel.app/api/webhook"
    },
  };

  return Response.json(config);
}