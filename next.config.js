/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        }
    },
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: "/categoria",
                destination: "/categorias",
                permanent: true,
            },
            {
                source: "/page",
                destination: "/",
                permanent: true,
            },
            {
                source: "/",
                destination: "/home",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
