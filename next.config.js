/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Ensures static export
  distDir: "out",   // Output directory
  basePath: "", // or remove this line entirely
  images: {
    unoptimized: true, // Required if using Next.js images
  },
};

module.exports = nextConfig; 