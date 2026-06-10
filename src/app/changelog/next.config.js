/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This tells Next.js to copy these files to the standalone output
    // directory, making them available in your deployed serverless functions.
    outputFileTracingIncludes: {
      '/*': ['./CHANGELOG.md', './package.json'],
    },
  },
};

module.exports = nextConfig;
