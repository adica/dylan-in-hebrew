/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'https://dylan-in-hebrew-35410n2bc-adis-projects-77e4c7d4.vercel.app'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
