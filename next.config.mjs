/** @type {import('next').NextConfig} */
import {assertLocalHybridReview} from './lib/hybrid/local-review.mjs'

assertLocalHybridReview()

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
