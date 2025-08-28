import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder which is required for MSW in Node.js
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill for BroadcastChannel which is required for MSW in Node.js
if (typeof BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    onmessage = null;
    onmessageerror = null;
    constructor(public name: string) {}
    addEventListener() {}
    removeEventListener() {}
    postMessage() {}
    close() {}
    dispatchEvent() { return true; }
  } as any;
}
