var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  s: () => shell
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("./index-0145b198.js");
class Shell {
  constructor() {
    this.visual_mode = "dark";
  }
}
const subscriber_queue = [];
function writable(value, start = import_index_0145b198.n) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if ((0, import_index_0145b198.f)(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run, invalidate = import_index_0145b198.n) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || import_index_0145b198.n;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
const routes = [
  { path: "/", name: "///", children: [] },
  { path: "/fun", name: "SPACE", children: [] },
  { path: "/about", name: "M3", children: [] }
];
function init() {
  const state = new Shell();
  state.routes = routes;
  initTheme(state);
  const { subscribe, set, update } = writable(state);
  return {
    subscribe,
    toggleVisialMode: () => update((s) => toggleVisialMode(s))
  };
}
const toggleVisialMode = (state) => {
  state.visual_mode = state.visual_mode === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.visual_mode);
  return state;
};
const initTheme = (s) => {
  {
    s.visual_mode = "light";
  }
  return s;
};
const shell = init();
