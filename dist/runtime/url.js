"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLPattern = exports.URLSearchParams = exports.URL = void 0;
const node_url_1 = require("node:url");
Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return node_url_1.URL; } });
Object.defineProperty(exports, "URLSearchParams", { enumerable: true, get: function () { return node_url_1.URLSearchParams; } });
const urlpattern_polyfill_1 = require("urlpattern-polyfill");
Object.defineProperty(exports, "URLPattern", { enumerable: true, get: function () { return urlpattern_polyfill_1.URLPattern; } });
