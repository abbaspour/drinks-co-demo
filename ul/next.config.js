/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "../public/ul",
    cleanDistDir: true,
    productionBrowserSourceMaps: true,
    assetPrefix: "https://drinks-co.vercel.app/ul"
}

module.exports = nextConfig
