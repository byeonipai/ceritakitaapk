const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Tambahkan ini

module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js',
    sw: './src/service-worker.js', // Tambahkan entry untuk service worker
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js', // Ensure service worker is output as sw.bundle.js
    publicPath: '/', // Ensure correct public path for serving files
    clean: true, // Bersihkan folder dist sebelum build baru
  },
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@models': path.resolve(__dirname, 'src/models/'),
      '@views': path.resolve(__dirname, 'src/views/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource', // Pastikan loader ini ada untuk mendukung impor gambar
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      excludeChunks: ['sw'], // Exclude service worker from being injected into HTML
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }, // Copy assets ke dist/assets
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: false, // Nonaktifkan Hot Module Replacement
    liveReload: false, // Nonaktifkan live reload sepenuhnya
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' },
      ],
    },
    client: {
      overlay: true, // Tetap tampilkan error di browser
      reconnect: false, // Nonaktifkan percobaan reconnect WebSocket
    },
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'], // Pantau hanya folder src dan public
      options: {
        ignored: /node_modules/, // Abaikan node_modules
      },
    },
  },
};
