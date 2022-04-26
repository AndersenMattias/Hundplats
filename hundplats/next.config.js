module.exports = {
  env: {
    mongodburl: process.env.MONGODB_URI,
  },
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};
