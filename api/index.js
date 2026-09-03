// Vercel zero-config serverless function.
// Vercel treats every file in /api as a function with no dashboard config.
// All routes are rewritten here, and the original URL (/api/users/search, ...)
// is passed through to the Nest handler.
const main = require('../dist/main.js');

const handler = main.default || main.handler || main;

module.exports = async (req, res) => {
  await handler(req, res);
};
