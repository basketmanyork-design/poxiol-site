/** @type {import('next').NextConfig} */
const isOpenNextBuild = process.env.POXIOL_OPENNEXT_BUILD === "1";

const nextConfig = {
  ...(isOpenNextBuild ? {} : { output: "export" }),
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
