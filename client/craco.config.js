const CracoLessPlugin = require("craco-less");
const path = require("path");
const fs = require("fs");

const { whenDev } = require("@craco/craco");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#2abdd2" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: whenDev(() => ({
    https: true,
    // pfx: fs.readFileSync(path.resolve("./localhost.pfx")),
    // pfxPassphrase: "temp123!"
  }))
};
