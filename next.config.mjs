/** @type {import('next').NextConfig} */
import {assertLocalHybridReview} from './lib/hybrid/local-review.mjs'
import {buildDeterministicBuildId} from './lib/release/build-id.mjs'

assertLocalHybridReview()

const isOpenNextBuild = process.env.POXIOL_OPENNEXT_BUILD === "1";

const nextConfig = {
  ...(isOpenNextBuild ? {} : { output: "export" }),
  generateBuildId: async () => buildDeterministicBuildId({
    root: process.cwd(),
    paths: [
      'app',
      'components',
      'construction/route-release.json',
      'construction/sanity-read-audit.json',
      'content',
      'lib',
      'next.config.mjs',
      'package-lock.json',
      'package.json',
      'postcss.config.js',
      'public',
      'tailwind.config.ts',
      'tsconfig.json',
    ],
  }),
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
