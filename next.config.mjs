/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "yf4pquysoq.ufs.sh"], 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yf4pquysoq.ufs.sh",
        port: "",
      },
    ],
  },
};

export default nextConfig;
