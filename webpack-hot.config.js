const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { resolve } = require('path');
const stats = {
  assets: true,
  children: false,
  chunks: false,
  hash: false,
  modules: false,
  publicPath: false,
  timings: true,
  version: false,
  warnings: true,
  colors: {
    green: '\u001b[32m',
  },
};
module.exports = {
  context: resolve(__dirname, 'app'),
  devtool: 'inline-source-map',
  resolve: {
    modules: [
      resolve(__dirname, 'components'),
      resolve(__dirname, 'app'),
      resolve(__dirname, 'node_modules/kendo-ui/css/web'),
      resolve(__dirname, 'node_modules/kendo-ui/css/mobile'),
      'node_modules'
    ]
  },
  entry: [
    'react-hot-loader/patch',
        // activate HMR for React
    'webpack-dev-server/client?http://localhost:8090',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
    'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
    './main.js'
        // the entry point of our app
  ],
  output: {
    filename: '[name]-[hash:8].js',
        // the output bundle
    path: __dirname,
    publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
  },
  devServer: {
    hot: true,
        // enable HMR on the server
    contentBase: __dirname,
        // match the output path
    publicPath: '/',
        // match the output `publicPath`
    compress: true,
    historyApiFallback: false,
    stats: stats,
    port: 8090,
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use:
        {
          loader: 'babel-loader',
          options:
          {
            plugins: [require('react-hot-loader/babel')]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      {
        test: /\.(eot|svg|jpe?g|png|gif|ttf|woff2?)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',

      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].js.map',
    //   exclude: ['vendor.js']
    // }),
    new HtmlWebpackPlugin({
      template: '../build/template/index.html',
      hash: true
    })
    // ,
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: 'web.html',
    //   statsFilename: 'boa-one-office-stats.json',
    //   openAnalyzer: true
    // })
  ]
};
