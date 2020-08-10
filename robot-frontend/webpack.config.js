const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const RemoveStrictPlugin = require("./RemoveStrictPlugin");

module.exports = {
  //entry: './src/index.js',//单页
  entry: {
    main: "./src/index.js",
    videoHD: "./src/videoHD.js",
    videoIR: "./src/videoIR.js",
  },
  output: {
    //filename: 'built.js',//单页
    path: path.resolve(__dirname, "build"),
    filename: "build/[name].bundle.js",
  },
  resolveLoader: {
    // 这个是声明你本地loader位置的地方，因为我没有上传npm包，remove-strict.js放在loaders目录下
    modules: [path.join(__dirname, "./loaders/"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.HKWS\.js$/,
        //exclude: /node_modules/,
        use: [
          {
            loader: "remove-strict",
          },
        ],
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
                new RemoveStrictPlugin(),
              ],
            },
          },
          {
            loader: "remove-strict",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000",
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "url-loader?limit=8192",
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      titel: "react app",
      filename: "index.html",
      template: "./public/index.html",
      chunks: ["vendors", "main"],
    }),
    new HtmlWebPackPlugin({
      titel: "videoHD",
      filename: "videoHD.html",
      template: "./public/videoHD.html",
      chunks: ["vendors", "videoHD"],
    }),
    new HtmlWebPackPlugin({
      titel: "videoIR",
      filename: "videoIR.html",
      template: "./public/videoIR.html",
      chunks: ["vendors", "videoIR"],
    }),
    new RemoveStrictPlugin(),
  ],
  mode: "development",
  // mode:'development',

  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    //启动gzip压缩
    compress: true,
    //解决WDS disconnected的问题
    headers:{
      'Access-Control-Allow-Origin':'*',
    },
    hotOnly:false,
    disableHostCheck:true,
    //端口号
    port: 3000,
    //自动打开浏览器
    open: true,
  },
};
