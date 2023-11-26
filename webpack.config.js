const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ProvidePlugin, DefinePlugin } = require("webpack");
require("dotenv").config(); // Load environment variables from .env file
console.log(process.env); //ANDREW

module.exports = {
  entry: "./src/index.js", // Your entry point
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output filename
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel for JavaScript transpilation
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ["style-loader", "css-loader"], // Use style-loader and css-loader for handling CSS
      },
      // Add more loaders for other asset types as needed
    ],
  },
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"), // Polyfill for 'stream' module
      buffer: require.resolve("buffer/"), // Polyfill for 'buffer' module
      path: require.resolve("path-browserify"), // Polyfill for 'path' module
      os: require.resolve("os-browserify/browser"), // Polyfill for 'os' module
      crypto: require.resolve("crypto-browserify"), // Polyfill for 'crypto' module
      // Add other polyfills as needed
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Path to your HTML template
      filename: "index.html", // Output HTML filename
    }),
    new ProvidePlugin({
      process: "process/browser", // Provide a 'process' global variable
    }),
    new DefinePlugin({
      env: JSON.stringify(process.env),
    }), // ANDEW
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve files from the 'dist' directory
    },
    hot: true, // Enable Hot Module Replacement (HMR)
    port: 8080, // Port for development server
  },
  mode: "development", // Set mode to 'development'
};
