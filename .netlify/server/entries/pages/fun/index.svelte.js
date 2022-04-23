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
  default: () => Fun
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("../../../chunks/index-0145b198.js");
const Fun = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"flex content-center justify-center h-full"}"><ul class="${"m-auto text-4xl leading-loose text-center dark:text-cyan-50"}"><li><a href="${"fun/gradients"}">GRADIENTS</a></li>
		<li><a href="${"fun/circular"}">CIRCULAR</a></li>
		<li><a href="${"fun/m1"}">M1 \u2039-\u203A TK</a></li>
		<li><a href="${"fun/zeal"}">ZEAL</a></li></ul></div>`;
});
