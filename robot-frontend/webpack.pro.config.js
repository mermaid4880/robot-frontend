const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const RemoveStrictPlugin = require("./RemoveStrictPlugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');


// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: path.resolve(__dirname, 'build')
  },
  resolveLoader: {
    // 这个是声明你本地loader位置的地方，因为我没有上传npm包，remove-strict.js放在loaders目录下
    modules: [path.join(__dirname, "./loaders/"), "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.HKWS\.js$/,
        //exclude: /node_modules/,
        use: [
          {
            loader: "remove-strict"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader"]
      },
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
      {
        // 在package.json中eslintConfig --> airbnb
        test: [/\.(jsx|js)$/],//test: /\.js$/,
        exclude: [/node_modules/, /HKWS/],//exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: false //HJJ
        }
      },
      {
        test: [/\.(jsx|js)$/],
        exclude: [/node_modules/, /HKWS/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-transform-react-jsx",
                "@babel/transform-runtime",
                "transform-remove-strict-mode",
                new RemoveStrictPlugin()
              ]
            }
          },
          {
            loader: "remove-strict"
          }
        ]
      },
      {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'},
      {
        test: /\.(jpg|png|gif)/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'imgs',
          esModule: false
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebPackPlugin({
      titel: "react app",
      filename: "index.html",
      template: "./public/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new RemoveStrictPlugin() 
  ],
  mode: 'production'
};