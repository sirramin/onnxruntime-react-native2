"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _onnxruntimeCommon = require("onnxruntime-common");

Object.keys(_onnxruntimeCommon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _onnxruntimeCommon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _onnxruntimeCommon[key];
    }
  });
});

var _reactNative = require("react-native");

var _backend = require("./backend");

var _version = require("./version");

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
(0, _onnxruntimeCommon.registerBackend)('cpu', _backend.onnxruntimeBackend, 1);
(0, _onnxruntimeCommon.registerBackend)('xnnpack', _backend.onnxruntimeBackend, 1);

if (_reactNative.Platform.OS === 'android') {
  (0, _onnxruntimeCommon.registerBackend)('nnapi', _backend.onnxruntimeBackend, 1);
} else if (_reactNative.Platform.OS === 'ios') {
  (0, _onnxruntimeCommon.registerBackend)('coreml', _backend.onnxruntimeBackend, 1);
}

_onnxruntimeCommon.env.versions['react-native'] = _version.version;
//# sourceMappingURL=index.js.map