/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true, // Known issue -- causes double __NEXT_REDUX_WRAPPER_HYDRATE__ dispatch but this ONLY affects development : https://github.com/kirill-konshin/next-redux-wrapper/issues/422
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
};
