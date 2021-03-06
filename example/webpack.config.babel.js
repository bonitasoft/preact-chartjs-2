import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';

const inExamples = loc => path.resolve(__dirname, loc);

const env = process.env.NODE_ENV || 'development';
const __DEV__ = env === 'development';

const config = {
  entry: {
    app: [
      inExamples('src/index.js'),
      inExamples('src/example.css')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2016', 'es2017', 'preact', 'stage-0']
          }
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  resolve: {
    alias: {
      'preact-chartjs-2': '../../../src'
    }
  },
  output: {
    path: inExamples('dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      },
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: __DEV__
    }),
    new HtmlWebpackPlugin({
      template: inExamples('src/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 8000,
    stats: {
      cached: false
    }
  }
};

if (__DEV__) {
  config.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
}
else {
  config.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new MinifyPlugin()
  );
}

export default config;
