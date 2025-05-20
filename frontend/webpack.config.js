const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all', // Разделяет бандлы для оптимизации загрузки
    },
  };

  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserPlugin(), // для минимизации JavaScript
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['mozjpeg', { quality: 70 }],
              ['pngquant', { quality: [0.7, 0.9] }],
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                    },
                    {
                      name: 'removeAttrs',
                      params: { attrs: '(xmlns)' }, // удаляет атрибут xmlns
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ];
  }

  return config;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './scripts/main.js', // Точка входа
  output: {
    filename: `./scripts/${filename('js')}`,
    path: path.resolve(__dirname, 'app'),
    publicPath: '',
  },
  plugins: [
    new CleanWebpackPlugin(), // Очищает папку app
    new HtmlWebpackPlugin({
      // для автоматической генерации HTML-файла
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd, // Минифицирует html файл
      },
    }),
    new MiniCssExtractPlugin({
      // для извлечения CSS в отдельный файл
      filename: `./style/${filename('css')}`, // создает CSS-файл для каждого JS-файла, который содержит CSS
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src', 'assets'), to: 'assets' },
      ],
    }),
  ],
  module: {
    // Определяет правила обработки файлов.
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Апфусцирует js код
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/'; // добавляет ../ для background изображений
              },
            },
          },
          'css-loader', // интерпретирует @import и url() внутри CSS
          'postcss-loader', // применяет автопрефиксер и линтер к CSS
          'sass-loader', // загружает файлы SCSS и передает компилятору sass, а этот компилирует код в CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // работает так же, как и загрузчик file-loader.
        generator: {
          filename: `images/${filename('[ext]')}`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `fonts/${filename('[ext]')}`,
        },
      },
    ],
  },
  devServer: {
    // Конфигурация для локального сервера разработки.
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'app'),
    },
    open: true, // Автоматическое открытие браузера
    hot: true, // обрабатывает изменения без перезагрузки страницы
    port: 8080,
  },
  devtool: isProd ? false : 'source-map', // остлеживание файлов в devtools
  externalsType: 'script',
  externals: {
      // Вместо YOUR_API_KEY подставить значение настоящего ключа
      ymaps3: ['https://api-maps.yandex.ru/3.0/?apikey=787c01ce-41c0-4504-9ab8-8e1312feaa8d&lang=ru_RU', 'ymaps3']
  },
  optimization: optimization(),
};
