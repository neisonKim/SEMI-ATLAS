/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's normal Next.js runtime is used so /api/contact can send email.
  // Do not set output:'export' while the server contact API is enabled.
  trailingSlash: true,
  turbopack: {
    // Keep Turbopack scoped to this project even when a parent folder
    // also contains another lockfile.
    root: process.cwd(),
  },
};

export default nextConfig;
