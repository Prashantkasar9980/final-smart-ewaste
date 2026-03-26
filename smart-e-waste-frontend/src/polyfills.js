// Minimal polyfills for browser bundles that expect Node globals.
// Must run before any libraries are imported.
if (typeof globalThis.global === "undefined") {
    globalThis.global = globalThis;
}

if (typeof globalThis.process === "undefined") {
    globalThis.process = { env: {} };
}

