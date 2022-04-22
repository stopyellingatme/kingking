export class Shell {
	routes: Route[];
	visual_mode: "dark" | "light" = "dark";
}

export interface Route {
	path: string;
	name: string;
	children: Route[];
}
