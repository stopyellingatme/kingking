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
  default: () => Zeal
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("../../../chunks/index-0145b198.js");
const classes = "relative p-32 w-32 h-32 rounded-full opacity-70 filter blur-xl animate-blob";
const Zeal = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  const blob_items = [
    { color: "bg-amber-400", delay: 0 },
    { color: "bg-teal-400", delay: 2e3 },
    { color: "bg-teal-400", delay: 1e3 },
    { color: "bg-indigo-400", delay: 5e3 },
    { color: "bg-amber-400", delay: 4e3 },
    { color: "bg-teal-400", delay: 5e3 },
    { color: "bg-amber-400", delay: 3e3 },
    { color: "bg-amber-400", delay: 0 },
    { color: "bg-indigo-400", delay: 2e3 },
    { color: "bg-indigo-400", delay: 1e3 }
  ];
  return `<div class="${"flex items-start justify-center min-h-screen px-8 py-48"}"><div class="${"relative flex flex-wrap w-full h-full"}">
		${(0, import_index_0145b198.e)(blob_items, (item) => {
    return `${item.delay !== 0 ? `<div class="${(0, import_index_0145b198.d)(classes) + " " + (0, import_index_0145b198.d)(item.color) + " animation-delay-" + (0, import_index_0145b198.d)(item.delay)}"></div>` : `<div class="${(0, import_index_0145b198.d)(classes) + " " + (0, import_index_0145b198.d)(item.color)}"></div>`}`;
  })}</div></div>`;
});
