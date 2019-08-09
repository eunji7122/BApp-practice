const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist')   
  },
  plugins: [   
    new webpack.DefinePlugin({
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
    }),
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html"},
      { from: "./src/js", to: "js"},
      { from: "./src/real-estate.json", to: "real-estate.json"},
      { from: "./src/images", to: "images"},
      { from: "./src/css", to: "css"},
      { from: "./src/fonts", to: "fonts"},
      { from: "./src/item.html", to: "item.html"},
      { from: "./src/main_page.html", to: "main_page.html"},
      { from: "./src/login.html", to: "login.html"},
      { from: "./src/item_detail.html", to: "item_detail.html"},
      // { from: "./build/contracts/RealEstate.json", to: "RealEstate.json"},
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
}