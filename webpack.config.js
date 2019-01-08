const {resolve, join} = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const OUTPUT_PATHS = {
	SRC: resolve('src'),
	DIST: resolve('dist')
};

const ENV = process.argv.find(arg => arg.includes('NODE_ENV=production')) ? 'production' : 'development';
const IS_DEV_SERVER = process.argv.find(arg => arg.includes('webpack-dev-server'));
const OUTPUT_PATH = IS_DEV_SERVER ? OUTPUT_PATHS.SRC : OUTPUT_PATHS.DIST;

/**
 * Copy static files configuration
 */
const copyStatics = {
  copyWebcomponents: [{
    from: resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/*.js'),
    to: 'node_modules/@webcomponents/webcomponentsjs/[name].[ext]',
    flatten: true
  }],
  copyOthers: [{
    from: resolve('index.html'),
    to: OUTPUT_PATH,
    flatten: true
  }]
};

/**
 * Plugin configuration
 */
const renderHtmlPlugins = () =>
   [
     new HtmlWebpackPlugin({
        filename: resolve(OUTPUT_PATH, 'index.html'),
        template: `!!ejs-loader!${resolve('./index.html')}`,
        minify: ENV === 'production' && {
          collapseWhitespace: true,
          removeScriptTypeAttributes: true,
          removeRedundantAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeComments: true
        },
        inject: false,
        compile: true
      })
   ];

const commonPlugins = [
  //new webpack.DefinePlugin({'process.env': processEnv}), //DefinePlugin set 'process.env' as global variable
  ...renderHtmlPlugins()
];

const devPlugins = [new CopyWebpackPlugin(copyStatics.copyWebcomponents)];

const buildPlugins = [
  new CopyWebpackPlugin(
    [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers)
  ),
  new CleanWebpackPlugin([OUTPUT_PATH], {verbose: true})
];

const plugins = commonPlugins.concat(IS_DEV_SERVER ? devPlugins : buildPlugins);


module.exports = {
  mode: ENV,
  entry: './src/polymer-webpack-app/polymer-webpack-app.js',
  output: {
    path: OUTPUT_PATH,
    filename: 'app.js'
  },
  //devtool: IS_DEV_SERVER ? 'cheap-source-map' : false,
  devtool: 'cheap-source-map',
  module: {
    rules: [{ 
      test: /\.js$/,
      // We need to transpile Polymer itself and other ES6 code
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [[
            '@babel/preset-env',
            {
              targets: {
                "chrome": "41"
              },
              debug: true
            }
          ]],
          plugins: [['@babel/plugin-syntax-object-rest-spread', {useBuiltIns: true}]]
        }
      }
    }]
  },
  plugins
}