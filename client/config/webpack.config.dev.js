'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// 앱 제공 URL
const publicPath = '/';

// `publicPath`
const publicUrl = '';

// 환경변수 사용
const env = getClientEnvironment(publicUrl);


module.exports = {
  // 소스맵(변경가능)
  devtool: 'cheap-module-source-map',
  entry: [
    // 기본 폴리필 제공(바벨)
    require.resolve('./polyfills'),
    // 커스텀 데브 서버
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // 앱코드 위치(마지막에 위치해야 컴파일 오류 없다)
    paths.appIndexJs,
  ],
  output: {
    // dev server 충돌방지용 코드
    path: paths.appBuild,
    // 웹팩 주석용 코드 (기능 없음)
    pathinfo: true,
    // devserver 가상 경로
    filename: 'static/js/bundle.js',
    // 코드스플리팅용 경로
    chunkFilename: 'static/js/[name].chunk.js',
    // 앱 제공 URL (개발환경에서는 /)
    publicPath: publicPath,
    // 소스맵 시작점 설정(디스크)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // 노드모듈 위치 설정
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // JSX 지원 확장자
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
    // 리액트 네이티브 지원
      'react-native': 'react-native-web',
    },
    plugins: [
    // /src 또는 node_modules 외 파일 컴파일 방지
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // 표준 아니어서 잠시 닫아둔 기능
      // { parser: { requireEnsure: false } },

      // eslint
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        // 맞는 로더 찾을때까지 웹팩 돌리는 기능
        oneOf: [
          // url 로더
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // 바벨링
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              // 빠른 재빌드 (바벨 기능 아님)
              cacheDirectory: true,
            },
          },
          // "postcss" loade : CSS에 autoprefixer 적용
          // "css" loader : CSS 경로 분석
          // "style" loader : CSS -> JS 삽입
          // 배포할때는 css 파일로 만들지만 개발환경에서는 핫로딩으로 동작
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  // 모듈화 추가
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]"  
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // 외부 css 가져오는데 쓰임
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // 리액트는 IE8 지원 안함
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          // 파일로더
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // 로더 추가하려면 반드시 파일로더 앞에 추가해야 한다
    ],
  },
  plugins: [
    // index.html 에서 환경변수 사용하도록하는 웹팩
    // public URL 을 %PUBLIC_URL% 로 사용할 수 있다.
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(env.raw),
    // index.html에 <script> 삽입해서 내보내기
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // 팩토리함수에 모듈 이름을 붙여서 브라우저 프로파일러에 보여주는 플러그인
    new webpack.NamedModulesPlugin(),
    // JS코드에서 환경변수 사용 가능
    // if (process.env.NODE_ENV === 'development') { ... }. `./env.js'에 설정되어 있음
    new webpack.DefinePlugin(env.stringified),
    // CSS 핫로딩
    new webpack.HotModuleReplacementPlugin(),
    // 이슈 보여주기
    new CaseSensitivePathsPlugin(),
    // NPM INSTALL 까먹은게 있으면 알려준다
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // MOMENT.JS 사용하려면 이 플러그인 필요
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
    // 브라우저에서 사용되지 않는 노드모듈들
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // 쓸데없는 경고니까 끄세요
  performance: {
    hints: false,
  },
};
