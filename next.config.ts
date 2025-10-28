/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ['api.dicebear.com'], // allowed external image domains
  },
  // experimental: {
  //   optimizeFonts: false
  // },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

