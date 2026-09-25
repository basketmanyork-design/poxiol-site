/** @type {import('next').NextConfig} */
import {assertLocalHybridReview} from './lib/hybrid/local-review.mjs'
import {buildDeterministicBuildId} from './lib/release/build-id.mjs'
import {SANITY_EVIDENCE_BUILD_ID_PATHS} from './lib/release/sanity-build-evidence.mjs'

assertLocalHybridReview()

const isOpenNextBuild = process.env.POXIOL_OPENNEXT_BUILD === "1";

const nextConfig = {
  ...(isOpenNextBuild ? {} : { output: "export" }),
  generateBuildId: async () => buildDeterministicBuildId({
    root: process.cwd(),
    paths: SANITY_EVIDENCE_BUILD_ID_PATHS,
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
