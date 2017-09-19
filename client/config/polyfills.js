'use strict';

if (typeof Promise === 'undefined') {
  // Promise가 rejection tracking 막지 않게 하기 위함
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// API 호출을 위한 fetch() polyfill
require('whatwg-fetch');

// Object.assign() 사용
Object.assign = require('object-assign');
