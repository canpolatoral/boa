const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ProgressPlugin = require('webpack/lib/ProgressPlugin');

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
    './main.js'
  ],
  output: {
    filename: '[name].js',
        // the output bundle
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: 
        { 
          loader: 'babel-loader'
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
    // new ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"development"', TARGET: '"web"'}
    }),
    function()
    {
      this.plugin('done', function(stats)
      {
        if (stats.compilation.errors 
          && stats.compilation.errors.length 
          && process.argv.indexOf('--watch') == -1)
        {
          console.log(stats.compilation.errors);
          process.exit(1);
        }
          // ...
      });
    },
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].js.map',
    //   exclude: ['vendor.js']  
    // }),      
    new HtmlWebpackPlugin({
      template: '../build/template/index.html',
      filename: '../index.html',
      hash: true
    })
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: 'web.html',
    //   statsFilename: 'boa-one-office-stats.json',
    //   openAnalyzer: true
    // })
  ]
};

