// Draws soft blobs that join like liquid. The GPU does the work, so the page stays fast.
// If the browser has no WebGL, it draws plain gradient blobs with the 2D canvas.

export const MAX_BLOBS = 24;

export interface GooBlob {
	x: number;
	y: number;
	r: number;
	sx: number;
	sy: number;
	fill: number;
}

export interface Renderer {
	resize(width: number, height: number, ratio: number): void;
	draw(blobs: GooBlob[]): void;
	dispose(): void;
}

// Each fill is a pair of colours: the edge, then the light spot.
export type Fills = [string, string][];

const vertexSource = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// Each blob adds a field that falls to zero at 1.6 times its radius. Where the sum of the
// fields is above the threshold, the pixel is inside a blob. Near blobs add their fields,
// so they join. The colour is the average of the blob colours, weighted by their fields.
const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_height;
uniform float u_ratio;
uniform int u_count;
uniform vec4 u_blobs[${MAX_BLOBS}];
uniform vec2 u_shapes[${MAX_BLOBS}];
uniform vec3 u_edges[3];
uniform vec3 u_lights[3];

const float REACH = 1.6;
// The field of one blob at its own radius, so a blob alone has the size of its radius.
const float THRESHOLD = 0.2262;

void main() {
	vec2 p = vec2(gl_FragCoord.x / u_ratio, u_height - gl_FragCoord.y / u_ratio);
	float field = 0.0;
	vec3 colour = vec3(0.0);

	for (int i = 0; i < ${MAX_BLOBS}; i++) {
		if (i >= u_count) break;
		vec4 blob = u_blobs[i];
		// Positions in units of the blob radius. The shape squashes and stretches the blob.
		vec2 q = (p - blob.xy) / (blob.z * u_shapes[i]);
		float d2 = dot(q, q) / (REACH * REACH);
		if (d2 >= 1.0) continue;
		float f = 1.0 - d2;
		f = f * f * f;

		vec3 edge = blob.w < 0.5 ? u_edges[0] : (blob.w < 1.5 ? u_edges[1] : u_edges[2]);
		vec3 light = blob.w < 0.5 ? u_lights[0] : (blob.w < 1.5 ? u_lights[1] : u_lights[2]);
		// The light spot is above and to the left of the centre.
		float t = clamp(length(q - vec2(-0.3, -0.4)) / 1.5, 0.0, 1.0);
		colour += mix(light, edge, t) * f;
		field += f;
	}

	float alpha = smoothstep(THRESHOLD * 0.8, THRESHOLD * 1.25, field) * 0.85;
	gl_FragColor = vec4(colour / max(field, 0.0001) * alpha, alpha);
}`;

function rgb(hex: string): [number, number, number] {
	const n = parseInt(hex.slice(1), 16);
	return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	gl.deleteShader(shader);
	return null;
}

interface Program {
	program: WebGLProgram;
	buffer: WebGLBuffer | null;
	height: WebGLUniformLocation | null;
	ratio: WebGLUniformLocation | null;
	count: WebGLUniformLocation | null;
	blobs: WebGLUniformLocation | null;
	shapes: WebGLUniformLocation | null;
}

// Builds the program and sets the values that do not change. Returns null if the GPU does not accept the shader.
function build(gl: WebGLRenderingContext, fills: Fills): Program | null {
	const program = gl.createProgram();
	const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
	const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
	if (!program || !vertex || !fragment) {
		gl.deleteProgram(program);
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);
		return null;
	}

	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	gl.deleteShader(vertex);
	gl.deleteShader(fragment);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.deleteProgram(program);
		return null;
	}
	gl.useProgram(program);

	// One triangle that covers the full canvas.
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, 'a_position');
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

	const at = (name: string) => gl.getUniformLocation(program, name);
	gl.uniform3fv(
		at('u_edges'),
		fills.flatMap(([edge]) => rgb(edge))
	);
	gl.uniform3fv(
		at('u_lights'),
		fills.flatMap(([, light]) => rgb(light))
	);

	return {
		program,
		buffer,
		height: at('u_height'),
		ratio: at('u_ratio'),
		count: at('u_count'),
		blobs: at('u_blobs'),
		shapes: at('u_shapes')
	};
}

function webgl(canvas: HTMLCanvasElement, fills: Fills): Renderer | null {
	// Test the shader on a separate canvas first. A canvas that has a WebGL context cannot give
	// a 2D context, so this test keeps the 2D fallback possible when the shader fails.
	const probe = document.createElement('canvas').getContext('webgl');
	const works = probe !== null && build(probe, fills) !== null;
	probe?.getExtension('WEBGL_lose_context')?.loseContext();
	if (!works) return null;

	const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
	if (!gl) return null;
	let state = build(gl, fills);
	if (!state) return null;

	let size = { width: 0, height: 0, ratio: 1 };
	const blobData = new Float32Array(MAX_BLOBS * 4);
	const shapeData = new Float32Array(MAX_BLOBS * 2);

	function applySize() {
		if (!state) return;
		const w = Math.round(size.width * size.ratio);
		const h = Math.round(size.height * size.ratio);
		// A change to the canvas size clears the canvas, so change it only when necessary.
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		gl!.viewport(0, 0, w, h);
		gl!.uniform1f(state.height, size.height);
		gl!.uniform1f(state.ratio, size.ratio);
	}

	// The browser can take the GPU away, for example from a background tab on a phone.
	// Ask to get it back, and then build the program again.
	const lost = (event: Event) => {
		event.preventDefault();
		state = null;
	};
	const restored = () => {
		state = build(gl, fills);
		applySize();
	};
	canvas.addEventListener('webglcontextlost', lost);
	canvas.addEventListener('webglcontextrestored', restored);

	return {
		resize(width, height, ratio) {
			size = { width, height, ratio };
			applySize();
		},
		draw(blobs) {
			if (!state) return;
			const count = Math.min(blobs.length, MAX_BLOBS);
			for (let i = 0; i < count; i++) {
				const blob = blobs[i];
				blobData.set([blob.x, blob.y, blob.r, blob.fill], i * 4);
				shapeData.set([blob.sx, blob.sy], i * 2);
			}
			gl.uniform1i(state.count, count);
			gl.uniform4fv(state.blobs, blobData);
			gl.uniform2fv(state.shapes, shapeData);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		dispose() {
			canvas.removeEventListener('webglcontextlost', lost);
			canvas.removeEventListener('webglcontextrestored', restored);
			if (!state) return;
			gl.deleteBuffer(state.buffer);
			gl.deleteProgram(state.program);
		}
	};
}

function canvas2d(canvas: HTMLCanvasElement, fills: Fills): Renderer | null {
	const context = canvas.getContext('2d');
	if (!context) return null;
	let scale = 1;

	return {
		resize(width, height, ratio) {
			const w = Math.round(width * ratio);
			const h = Math.round(height * ratio);
			// A change to the canvas size clears the canvas, so change it only when necessary.
			if (canvas.width !== w) canvas.width = w;
			if (canvas.height !== h) canvas.height = h;
			scale = ratio;
		},
		draw(blobs) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.globalAlpha = 0.85;
			for (const blob of blobs) {
				const [edge, light] = fills[blob.fill];
				context.setTransform(
					scale * blob.sx,
					0,
					0,
					scale * blob.sy,
					scale * blob.x,
					scale * blob.y
				);
				const gradient = context.createRadialGradient(
					-0.3 * blob.r,
					-0.4 * blob.r,
					0,
					-0.3 * blob.r,
					-0.4 * blob.r,
					1.5 * blob.r
				);
				gradient.addColorStop(0, light);
				gradient.addColorStop(1, edge);
				context.fillStyle = gradient;
				context.beginPath();
				context.arc(0, 0, blob.r, 0, Math.PI * 2);
				context.fill();
			}
		},
		dispose() {}
	};
}

export function createRenderer(canvas: HTMLCanvasElement, fills: Fills): Renderer | null {
	return webgl(canvas, fills) ?? canvas2d(canvas, fills);
}
