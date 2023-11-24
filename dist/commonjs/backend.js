"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onnxruntimeBackend = void 0;

var _onnxruntimeCommon = require("onnxruntime-common");

var _reactNative = require("react-native");

var _binding = require("./binding");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

const tensorTypeToTypedArray = type => {
  switch (type) {
    case 'float32':
      return Float32Array;

    case 'int8':
      return Int8Array;

    case 'uint8':
      return Uint8Array;

    case 'int16':
      return Int16Array;

    case 'int32':
      return Int32Array;

    case 'bool':
      return Int8Array;

    case 'float64':
      return Float64Array;

    case 'int64':
      /* global BigInt64Array */

      /* eslint no-undef: ["error", { "typeof": true }] */
      return BigInt64Array;

    default:
      throw new Error(`unsupported type: ${type}`);
  }
};

const normalizePath = path => {
  // remove 'file://' prefix in iOS
  if (_reactNative.Platform.OS === 'ios' && path.toLowerCase().startsWith('file://')) {
    return path.substring(7);
  }

  return path;
};

var _inferenceSession = /*#__PURE__*/new WeakMap();

var _key = /*#__PURE__*/new WeakMap();

var _pathOrBuffer = /*#__PURE__*/new WeakMap();

class OnnxruntimeSessionHandler {
  constructor(pathOrBuffer) {
    _classPrivateFieldInitSpec(this, _inferenceSession, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _key, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _pathOrBuffer, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "inputNames", void 0);

    _defineProperty(this, "outputNames", void 0);

    _classPrivateFieldSet(this, _inferenceSession, _binding.binding);

    _classPrivateFieldSet(this, _pathOrBuffer, pathOrBuffer);

    _classPrivateFieldSet(this, _key, '');

    this.inputNames = [];
    this.outputNames = [];
  }

  async loadModel(options) {
    try {
      let results; // load a model

      if (typeof _classPrivateFieldGet(this, _pathOrBuffer) === 'string') {
        // load model from model path
        results = await _classPrivateFieldGet(this, _inferenceSession).loadModel(normalizePath(_classPrivateFieldGet(this, _pathOrBuffer)), options);
      } else {
        // load model from buffer
        if (!_classPrivateFieldGet(this, _inferenceSession).loadModelFromBlob) {
          throw new Error('Native module method "loadModelFromBlob" is not defined');
        }

        const modelBlob = _binding.jsiHelper.storeArrayBuffer(_classPrivateFieldGet(this, _pathOrBuffer).buffer);

        results = await _classPrivateFieldGet(this, _inferenceSession).loadModelFromBlob(modelBlob, options);
      } // resolve promise if onnxruntime session is successfully created


      _classPrivateFieldSet(this, _key, results.key);

      this.inputNames = results.inputNames;
      this.outputNames = results.outputNames;
    } catch (e) {
      throw new Error(`Can't load a model: ${e.message}`);
    }
  }

  async dispose() {
    return _classPrivateFieldGet(this, _inferenceSession).dispose(_classPrivateFieldGet(this, _key));
  }

  startProfiling() {// TODO: implement profiling
  }

  endProfiling() {// TODO: implement profiling
  }

  async run(feeds, fetches, options) {
    const outputNames = [];

    for (const name in fetches) {
      if (Object.prototype.hasOwnProperty.call(fetches, name)) {
        if (fetches[name]) {
          throw new Error('Preallocated output is not supported and only names as string array is allowed as parameter');
        }

        outputNames.push(name);
      }
    }

    const input = this.encodeFeedsType(feeds);
    const results = await _classPrivateFieldGet(this, _inferenceSession).run(_classPrivateFieldGet(this, _key), input, outputNames, options);
    const output = this.decodeReturnType(results);
    return output;
  }

  encodeFeedsType(feeds) {
    const returnValue = {};

    for (const key in feeds) {
      if (Object.hasOwnProperty.call(feeds, key)) {
        let data;

        if (Array.isArray(feeds[key].data)) {
          data = feeds[key].data;
        } else {
          const buffer = feeds[key].data.buffer;
          data = _binding.jsiHelper.storeArrayBuffer(buffer);
        }

        returnValue[key] = {
          dims: feeds[key].dims,
          type: feeds[key].type,
          data
        };
      }
    }

    return returnValue;
  }

  decodeReturnType(results) {
    const returnValue = {};

    for (const key in results) {
      if (Object.hasOwnProperty.call(results, key)) {
        let tensorData;

        if (Array.isArray(results[key].data)) {
          tensorData = results[key].data;
        } else {
          const buffer = _binding.jsiHelper.resolveArrayBuffer(results[key].data);

          const typedArray = tensorTypeToTypedArray(results[key].type);
          tensorData = new typedArray(buffer, buffer.byteOffset, buffer.byteLength / typedArray.BYTES_PER_ELEMENT);
        }

        returnValue[key] = new _onnxruntimeCommon.Tensor(results[key].type, tensorData, results[key].dims);
      }
    }

    return returnValue;
  }

}

class OnnxruntimeBackend {
  async init() {
    return Promise.resolve();
  }

  async createSessionHandler(pathOrBuffer, options) {
    const handler = new OnnxruntimeSessionHandler(pathOrBuffer);
    await handler.loadModel(options || {});
    return handler;
  }

}

const onnxruntimeBackend = new OnnxruntimeBackend();
exports.onnxruntimeBackend = onnxruntimeBackend;
//# sourceMappingURL=backend.js.map