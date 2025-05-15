// This is a no-op polyfill for worker_threads in browser environments
const Worker = class {
  constructor() {
    throw new Error('Worker threads are not supported in browser environments');
  }
};

const parentPort = {
  postMessage: () => {},
  on: () => {},
  once: () => {},
  emit: () => {},
  removeListener: () => {},
  removeAllListeners: () => {},
  listeners: () => [],
  listenerCount: () => 0,
  eventNames: () => [],
  onmessage: null,
  onmessageerror: null
};

const workerData = {};

const isMainThread = true;

const resourceLimits = {
  maxYoungGenerationSizeMb: 48,
  maxOldGenerationSizeMb: 2048,
  codeRangeSizeMb: 0,
  stackSizeMb: 4
};

const threadId = 0;

const moveMessagePortToContext = () => {
  throw new Error('moveMessagePortToContext is not supported in browser environments');
};

const receiveMessageOnPort = () => {
  throw new Error('receiveMessageOnPort is not supported in browser environments');
};

const markAsUntransferable = () => {
  throw new Error('markAsUntransferable is not supported in browser environments');
};

const SHARE_ENV = Symbol.for('nodejs.worker_threads.SHARE_ENV');

export {
  Worker,
  parentPort,
  workerData,
  isMainThread,
  resourceLimits,
  threadId,
  moveMessagePortToContext,
  receiveMessageOnPort,
  markAsUntransferable,
  SHARE_ENV
}; 