export async function GET() {

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg5MTkxNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRmYzg1YjUzN2FkYzE4RmYzNTRhMzJDNkUxM0JCRGNEZDk0YTZEMDEifQ",
      payload: "eyJkb21haW4iOiJwaXhlbGNhc3QudmVyY2VsLmFwcCJ9",
      signature: "MHhlMmVkOGMzMjMyN2I1NTE3Mzc0NzUzNDc3YWRiNWY0NjY1NGUwMjZjNDM5YmVmOGIyMDM2Zjc1Mzc1NDUzZDA3MjA0ZDVjYzI3ZDQwZTkzYjY0NTBlMDg3MGMwYTMwYmNhNTM4ZmJkNDNkNmI4NzIyNDFmN2RiMzM2YzFjYTI1MjFj"
    },
    frame: {
      version: "0.1.0",
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