/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  turbopack: {
    // Keep Turbopack scoped to this project even when a parent folder
    // (for example D:\\코딩) also contains a package-lock.json.
    root: process.cwd(),
  },
};

export default nextConfig;
