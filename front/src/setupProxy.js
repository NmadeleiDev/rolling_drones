const createProxyMiddleware = require("http-proxy-middleware");
const ip = "192.168.99.100";
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const host = dev ? ip : process.env.REACT_APP_PROJECT_HOST;
const port = 80;

const url = dev ? `http://${host}:${port}` : `https://${host}`;

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: url,
      pathRewrite: { "^/api": "" },
      changeOrigin: true,
    })
  );
};
