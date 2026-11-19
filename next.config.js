/** @type {import('next').NextConfig} */
const nextConfig = {
  // The order route reads product pictures from disk to send them to PickSpot,
  // so the pictures have to be deployed together with that route.
  outputFileTracingIncludes: {
    '/api/pickspot/create-order': ['./public/assets/images/**/*'],
  },
};

module.exports = nextConfig;
