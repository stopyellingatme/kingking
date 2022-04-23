var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  manifest: () => manifest
});
module.exports = __toCommonJS(stdin_exports);
const manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png", "robots.txt", "svelte-welcome.png", "svelte-welcome.webp"]),
  _: {
    mime: { ".png": "image/png", ".txt": "text/plain", ".webp": "image/webp" },
    entry: { "file": "start-daabb78b.js", "js": ["start-daabb78b.js", "chunks/vendor-49a3a10f.js", "chunks/singletons-d1fb5791.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/3.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/4.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/5.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/6.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/7.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/8.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/9.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/10.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/11.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/12.js")))
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/word_web\/?$/,
        params: null,
        path: "/word_web",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/about\/?$/,
        params: null,
        path: "/about",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/todos\/?$/,
        params: null,
        path: "/todos",
        shadow: () => Promise.resolve().then(() => __toESM(require("./entries/endpoints/todos/index.ts.js"))),
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/home\/?$/,
        params: null,
        path: "/home",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/home\/home\/?$/,
        params: null,
        path: "/home/home",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/fun\/?$/,
        params: null,
        path: "/fun",
        shadow: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/fun\/gradients\/?$/,
        params: null,
        path: "/fun/gradients",
        shadow: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/fun\/circular\/?$/,
        params: null,
        path: "/fun/circular",
        shadow: null,
        a: [0, 10],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/fun\/zeal\/?$/,
        params: null,
        path: "/fun/zeal",
        shadow: null,
        a: [0, 11],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/fun\/m1\/?$/,
        params: null,
        path: "/fun/m1",
        shadow: null,
        a: [0, 12],
        b: [1]
      }
    ]
  }
};
