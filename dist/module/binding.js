// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NativeModules } from 'react-native';
/**
 * model loading information
 */

// export native binding
const {
  Onnxruntime,
  OnnxruntimeJSIHelper
} = NativeModules;
export const binding = Onnxruntime; // install JSI helper global functions

OnnxruntimeJSIHelper.install();
export const jsiHelper = {
  storeArrayBuffer: globalThis.jsiOnnxruntimeStoreArrayBuffer || (() => {
    throw new Error('jsiOnnxruntimeStoreArrayBuffer is not found, ' + 'please make sure OnnxruntimeJSIHelper installation is successful.');
  }),
  resolveArrayBuffer: globalThis.jsiOnnxruntimeResolveArrayBuffer || (() => {
    throw new Error('jsiOnnxruntimeResolveArrayBuffer is not found, ' + 'please make sure OnnxruntimeJSIHelper installation is successful.');
  })
}; // Remove global functions after installation

{
  delete globalThis.jsiOnnxruntimeStoreArrayBuffer;
  delete globalThis.jsiOnnxruntimeResolveArrayBuffer;
}
//# sourceMappingURL=binding.js.map