/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.discordapp.net',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
