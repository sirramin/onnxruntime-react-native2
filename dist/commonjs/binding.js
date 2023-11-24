"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsiHelper = exports.binding = void 0;

var _reactNative = require("react-native");

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export native binding
const {
  Onnxruntime,
  OnnxruntimeJSIHelper
} = _reactNative.NativeModules;
const binding = Onnxruntime; // install JSI helper global functions

exports.binding = binding;
OnnxruntimeJSIHelper.install();
const jsiHelper = {
  storeArrayBuffer: globalThis.jsiOnnxruntimeStoreArrayBuffer || (() => {
    throw new Error('jsiOnnxruntimeStoreArrayBuffer is not found, ' + 'please make sure OnnxruntimeJSIHelper installation is successful.');
  }),
  resolveArrayBuffer: globalThis.jsiOnnxruntimeResolveArrayBuffer || (() => {
    throw new Error('jsiOnnxruntimeResolveArrayBuffer is not found, ' + 'please make sure OnnxruntimeJSIHelper installation is successful.');
  })
}; // Remove global functions after installation

exports.jsiHelper = jsiHelper;
{
  delete globalThis.jsiOnnxruntimeStoreArrayBuffer;
  delete globalThis.jsiOnnxruntimeResolveArrayBuffer;
}
//# sourceMappingURL=binding.js.map