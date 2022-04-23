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
  default: () => _layout
});
module.exports = __toCommonJS(stdin_exports);
var import_index_0145b198 = require("../../chunks/index-0145b198.js");
var import_shell_store_62cc48b7 = require("../../chunks/shell.store-62cc48b7.js");
var app = "";
const getStores = () => {
  const stores = (0, import_index_0145b198.g)("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session,
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const Header = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let $shell, $$unsubscribe_shell;
  let $page, $$unsubscribe_page;
  $$unsubscribe_shell = (0, import_index_0145b198.a)(import_shell_store_62cc48b7.s, (value) => $shell = value);
  $$unsubscribe_page = (0, import_index_0145b198.a)(page, (value) => $page = value);
  $$unsubscribe_shell();
  $$unsubscribe_page();
  return `<header class="${"flex justify-between h-10 bg-black"}"><div class="${"flex items-center justify-between w-[155px] h-5 pl-2 mt-2"}"><a href="${"https://kingking.io"}"><span class="${"text-2xl text-yellow-50"}">TK - v1.0</span></a>
		
		${$shell.visual_mode === "dark" ? `<span title="${"Toggle Light Mode"}" class="${"cursor-pointer select-none"}">\u2600\uFE0F</span>` : `<span title="${"Toggle Dark Mode"}" class="${"cursor-pointer select-none"}">\u{1F319}</span>`}</div>

	<nav class="${"h-8 mt-2"}"><ul class="${"flex items-center justify-between text-cyan-50"}">
			${(0, import_index_0145b198.e)($shell.routes, (route) => {
    return `
				${route.path === "/" ? `<li class="${["px-4", $page.url.pathname === route.path ? "font-bold" : ""].join(" ").trim()}"><a sveltekit:prefetch${(0, import_index_0145b198.b)("href", route.path, 0)}>${(0, import_index_0145b198.d)(route.name)}</a>
					</li>` : `<li class="${[
      "px-2",
      $page.url.pathname.includes(route.path) ? "font-bold" : ""
    ].join(" ").trim()}"><a sveltekit:prefetch${(0, import_index_0145b198.b)("href", route.path, 0)}>${(0, import_index_0145b198.d)(route.name)}</a>
					</li>`}`;
  })}</ul></nav>

	<div class="${"px-[40px]"}"></div></header>`;
});
const _layout = (0, import_index_0145b198.c)(($$result, $$props, $$bindings, slots) => {
  let $shell, $$unsubscribe_shell;
  $$unsubscribe_shell = (0, import_index_0145b198.a)(import_shell_store_62cc48b7.s, (value) => $shell = value);
  $$unsubscribe_shell();
  return `<div class="${["h-screen", $shell.visual_mode === "dark" ? "dark" : ""].join(" ").trim()}">${(0, import_index_0145b198.v)(Header, "Header").$$render($$result, {}, {}, {})}

	<body class="${"bg-white dark:bg-black h-full"}"><div class="${"flex flex-col h-full dark:text-cyan-50"}"><div class="${"flex items-center justify-center h-8 text-2xl"}">\u2039\xA0
				<div class="${"w-screen h-[1px] mt-1 border-[1px] border-black dark:border-white"}"></div>
				\xA0\u203A
			</div>

			<div class="${"flex content-center justify-center h-full"}"><div class="${"flex flex-col items-center justify-center text-2xl"}">\u2191
					<div class="${"w-[1px] h-full border-[1px] border-black dark:border-white"}"></div>
					\u2193
				</div>
				<main class="${"w-full"}">${slots.default ? slots.default({}) : ``}</main>
				<div class="${"flex flex-col items-center justify-center text-2xl"}">\u2191
					<div class="${"w-[1px] h-full border-[1px] border-black dark:border-white"}"></div>
					\u2193
				</div></div></div></body>

	</div>`;
});
