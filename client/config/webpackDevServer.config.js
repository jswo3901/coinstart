'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  return {
    // 커스텀 웹팩데브서버
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    // gzip 압축
    compress: true,
    // 오류로그 숨기기
    clientLogLevel: 'none',
    // `index.html`에서는 % PUBLIC_URL %로 자바 스크립트 코드에서는 `process.env.PUBLIC_URL`을 사용해 `public` 폴더 접근 가능
    // 프로젝트 폴더 전체 배포하지말고 public에 있는 파일들만 서비스 합시다
    contentBase: paths.appPublic,
    // contentBase에 있는 파일들은 지켜보지 않습니다
    watchContentBase: true,
    // 핫로딩기능
    hot: true,
    // 루트패스 설정
    publicPath: config.output.publicPath,
    // 데브서버 로그 끄기
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    // HTTPS 환경변수를 true로 설정할 경우 HTTPS 사용 가능
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    setup(app) {
      // 런타임 오류 생겨도 파일 열도록
      app.use(errorOverlayMiddleware());
      // 포트, 호스트 기억
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
