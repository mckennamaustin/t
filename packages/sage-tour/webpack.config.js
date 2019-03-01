const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const modeConfig = env => require(`./build-scripts/webpack.${env.mode}`);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  return webpackMerge(
    {
      mode: mode,
      entry: {
        'sage-tour': './src/index.ts',
        'sage-tour.min': './src/index.ts'
      },
      output: {
        path: path.join(__dirname),
        filename: './[name].js',
        libraryTarget: 'umd',
        library: 'sage-tour',
        umdNamedDefine: true
      },
      devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true
      },
      devtool: 'source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },

      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader'
              }
            ]
          },
          { test: /\.js$/, use: 'babel-loader' },
          { test: /\.glsl$/, use: 'raw-loader' },
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
      plugins: [/*new HtmlWebpackPlugin(),*/ new webpack.ProgressPlugin()]
    },
    modeConfig({ mode, presets })
  );
};
