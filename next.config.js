/** @type {import('next').NextConfig} */
const nextConfig = {
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
        ];
    },
};

module.exports = nextConfig;
