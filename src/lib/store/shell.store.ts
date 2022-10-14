import { Shell } from "../../models/shell/shell.model";
import { browser } from "$app/environment"
import { writable } from "svelte/store";

const routes = [
  { path: "/", name: "///", children: [] },
  { path: "/fun", name: "SPACE", children: [] },
  { path: "/about", name: "ME", children: [] },
]

function init() {
  const state = new Shell();
  state.routes = routes;
  initTheme(state);
	const { subscribe, set, update } = writable(state);

	return {
		subscribe,
		toggleVisialMode: () => update(s => toggleVisialMode(s)),
		// decrement: () => update(n => n - 1),
		// reset: () => set(0)
	};
}

const toggleVisialMode = (state: Shell) => {
  state.visual_mode = state.visual_mode === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.visual_mode);
  return state;
};

const initTheme = (s: Shell) => {
  if (browser && localStorage.getItem("theme") === "dark") {
    s.visual_mode = "dark";
  } else {
    s.visual_mode = "light";
  }
  return s;
}

const shell = init();

export default shell;