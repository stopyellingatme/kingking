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
  default: () => Circular
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("../../../chunks/index-0145b198.js");
var import_shell_store_62cc48b7 = require("../../../chunks/shell.store-62cc48b7.js");
const Circle = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let w;
  let h;
  let $shell, $$unsubscribe_shell;
  $$unsubscribe_shell = (0, import_index_0145b198.a)(import_shell_store_62cc48b7.s, (value) => $shell = value);
  let { r = "100px" } = $$props;
  let { color = $shell.visual_mode === "dark" ? "white" : "black" } = $$props;
  let { styles = null } = $$props;
  if ($$props.r === void 0 && $$bindings.r && r !== void 0)
    $$bindings.r(r);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  w = r;
  h = r;
  $$unsubscribe_shell();
  return `<div style="${"width: " + (0, import_index_0145b198.d)(w) + "; height: " + (0, import_index_0145b198.d)(h) + "; background-color: transparent; border-color: " + (0, import_index_0145b198.d)(color) + "; " + (0, import_index_0145b198.d)(styles)}" class="${"rounded-full border-[1px]"}"></div>`;
});
const Circles = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let _rs;
  let radiuses = [];
  let rs = radiuses.join(", ");
  _rs = rs.split(", ");
  return `<div class="${"flex flex-col"}"><div class="${"relative mt-[375px] h-[375px]"}"><div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "magenta",
      styles: "position: absolute;"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "yellow",
      styles: "position: absolute; margin: -15px 6px 0 0"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "cyan",
      styles: "position: absolute; margin: 5px 0 0 17px"
    }, {}, {})}`;
  })}</div></div>

	<div class="${"relative mt-[250px] h-[475px]"}"><div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "yellow",
      styles: "position: absolute;"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "cyan",
      styles: "position: absolute; margin: -15px 6px 0 0"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "magenta",
      styles: "position: absolute; margin: 5px 0 0 17px"
    }, {}, {})}`;
  })}</div></div>

	<div class="${"relative h-[375px] mt-[150px]"}"><div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "cyan",
      styles: "position: absolute;"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "magenta",
      styles: "position: absolute; margin: -15px 6px 0 0"
    }, {}, {})}`;
  })}</div>
		<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.e)(_rs, (radi) => {
    return `${(0, import_index_0145b198.v)(Circle, "Circle").$$render($$result, {
      r: radi,
      color: "yellow",
      styles: "position: absolute; margin: 5px 0 0 17px"
    }, {}, {})}`;
  })}</div></div></div>

`;
});
const Circular = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"flex justify-center items-center"}">${(0, import_index_0145b198.v)(Circles, "Circles").$$render($$result, {}, {}, {})}</div>`;
});
