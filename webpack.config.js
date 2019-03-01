const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const modeConfig = env => require(`./build-scripts/webpack.${env.mode}`);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  return webpackMerge(
    {
      mode: mode,
      entry: ['babel-polyfill', './src/index.jsx'],
      output: {
        path: path.join(__dirname, './public'),
        filename: './bundle.js',
        publicPath: '/'
      },
      devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        proxy: {
          '/api': {
            target: 'http://localhost:8081',
            secure: false
          }
        }
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts']
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.(s*)css$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            query: { declaration: false }
          }
        ]
      },
      plugins: [
        /*new HtmlWebpackPlugin(),*/ new webpack.ProgressPlugin(),
        new webpack.ProvidePlugin({
          THREE: 'three'
        })
      ]
    },
    modeConfig({ mode, presets })
  );
};
