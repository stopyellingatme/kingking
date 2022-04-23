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
  default: () => Gradients
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("../../../chunks/index-0145b198.js");
const Gradient = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let _colors;
  let { with_swatch = false } = $$props;
  let { title = "CUSTOM" } = $$props;
  let { color = "#ffffff" } = $$props;
  let colors = [
    "#f20019",
    "#33137a",
    "#161415",
    "#222423",
    "#0333b4",
    "#015ad5",
    "#00a6f1",
    "#97d7e9",
    "#f9f5f2",
    "#f9f5f2",
    "#fbbd00",
    "#f76d02",
    "#f20019",
    "#770e7d",
    "#222423",
    "#161415",
    "#1c2121",
    "#0333b4",
    "#015ad5",
    "#00a6f1"
  ];
  let color_string = colors.join(", ");
  if ($$props.with_swatch === void 0 && $$bindings.with_swatch && with_swatch !== void 0)
    $$bindings.with_swatch(with_swatch);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  _colors = color_string.split(", ");
  return `<div><span class="${"text-xl"}">${(0, import_index_0145b198.d)(title)}</span>
	${with_swatch ? `<div><span><input class="${"border-2 border-gray-200 rounded dark:border-grey-700 dark:bg-black"}" type="${"color"}"${(0, import_index_0145b198.b)("value", color, 0)}>
				<button class="${"px-2 py-1 m-4 text-white rounded bg-stone-700"}">ADD COLOR</button></span></div>
		<div class="${"flex flex-wrap justify-start w-full pb-4"}">${(0, import_index_0145b198.e)(_colors, (_color) => {
    return `<div><div class="${"flex items-center justify-center"}"><input class="${"border-2 border-gray-200 rounded dark:border-gray-700 dark:bg-black"}"${(0, import_index_0145b198.b)("value", _color, 0)} type="${"color"}">
						<span class="${"pl-1 pr-4 text-xl cursor-pointer dark:text-white"}">X</span></div>
				</div>`;
  })}</div>` : ``}
	<div style="${"background-image: linear-gradient(to right, " + (0, import_index_0145b198.d)(color_string) + ")"}" class="${"w-full h-8 my-1 rounded"}"></div></div>`;
});
const Opti_gradient = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let { modifier = null } = $$props;
  let { rotate = false } = $$props;
  let hue = 0;
  if ($$props.modifier === void 0 && $$bindings.modifier && modifier !== void 0)
    $$bindings.modifier(modifier);
  if ($$props.rotate === void 0 && $$bindings.rotate && rotate !== void 0)
    $$bindings.rotate(rotate);
  return `${modifier ? `<div style="${"filter: hue-rotate(" + (0, import_index_0145b198.d)(hue = modifier(hue)) + "deg)"}" class="${"w-full h-8 my-1 rounded opti-gradient-01"}"></div>` : `<div style="${"filter: hue-rotate(" + (0, import_index_0145b198.d)(hue) + "deg)"}" class="${"w-full h-8 my-1 rounded opti-gradient-01"}"></div>`}`;
});
const classes = "w-full h-8 my-1 rounded";
const Gradients = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  const gradients = [];
  return `<div class="${"flex items-start justify-center h-full"}"><div class="${"w-3/4 m-auto dark:text-cyan-50"}">${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, {}, {}, {})}
		${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, { modifier: (hue) => (hue / 3).toFixed(0) }, {}, {})}
		${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, { modifier: (hue) => (hue / 2).toFixed(0) }, {}, {})}
		${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, { rotate: true }, {}, {})}
		${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, { modifier: (hue) => (hue * 2).toFixed(0) }, {}, {})}
		${(0, import_index_0145b198.v)(Opti_gradient, "OptiGradient").$$render($$result, { modifier: (hue) => (hue * 3).toFixed(0) }, {}, {})}
		<br>
		<br>
		${(0, import_index_0145b198.v)(Gradient, "Gradient").$$render($$result, { with_swatch: true }, {}, {})}
		<br>
		<br>
		${(0, import_index_0145b198.e)(gradients, (batch, i) => {
    return `<div><span>COLOR ${(0, import_index_0145b198.d)(i < 10 && "0")}${(0, import_index_0145b198.d)(i)}</span>
				${(0, import_index_0145b198.e)(batch, (grad) => {
      return `<div class="${(0, import_index_0145b198.d)(classes) + " bg-gradient-to-r " + (0, import_index_0145b198.d)(grad.from) + " " + (0, import_index_0145b198.d)(grad.via) + " " + (0, import_index_0145b198.d)(grad.to)}"></div>`;
    })}
				<br>
			</div>`;
  })}</div></div>`;
});
