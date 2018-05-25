const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const commonConfig = require('./webpack.config.common');
const parts = require('./webpack.parts');

const extractTextPlugin = new ExtractTextPlugin('[name].[chunkhash].css', {
  allChunks: true,
});

const source = (file) => path.join('js/ssr', file);

const productionConfig = merge([
  parts.setFreeVariable('process.env.NODE_ENV', process.env.NODE_ENV || 'production'),
  parts.setFreeVariable('process.env.IS_SSR', true),
  commonConfig,
  {
    target: 'node',
    // Override common's entry point
    entry: source('server.js'),
    // Don't attempt to continue if there are any errors.
    bail: true,
    output: {
      // The build folder.
      path: parts.PATHS.buildServer,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include: parts.PATHS.styles,
          use: extractTextPlugin.extract({
            use: parts.getCSSConfig(),
            fallback: 'style-loader',
          }),
        },
        {
          test: /\.(css|scss)$/,
          include: parts.PATHS.scripts,
          use: extractTextPlugin.extract({
            use: parts.getCSSConfig({
              options: {
                modules: true,
                localIdentName: '[hash:base64:8]',
              },
            }),
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [
      // SEE: https://medium.com/webpack/brief-introduction-to-scope-hoisting-in-webpack-8435084c171f
      new webpack.optimize.ModuleConcatenationPlugin(),
      extractTextPlugin,
    ],
    // Ensures Webpack will not try to bundle node_modules
    externals: [nodeExternals()],
  },
  // TODO: Uncomment when in development
  // parts.minifyJavascript(),
  parts.loadImages({
    include: parts.PATHS.images,
    options: {
      limit: 15000,
      name: 'img/[name].[hash].[ext]',
    },
  }),
  parts.clean(parts.PATHS.buildServer),
]);

module.exports = productionConfig;