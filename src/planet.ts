import { fill, random } from "lodash";
import p5 from "p5";
import vShader from "./shader.vert?raw";
import fShader from "./shader.frag?raw";

interface ICoordinate {
	x: number;
	y: number;
}

// interface IOrbitPoint {
// 	current: p5.Vector;
// 	lineDist: number;

// 	setScroll: (_scroll: number) => void;
// 	update: (_time: number) => void;
// 	draw: () => void;
// }

const isMobile = () => {
	return "ontouchstart" in document.documentElement;
};

export class PlanetGradient {
	private viewport: HTMLElement;
	private canvas!: p5.Renderer;
	private shader!: p5.Shader;
	private debug: boolean;
	private mobile: boolean;
	private scale: number;
	// private points: IOrbitPoint[];
	private u_x: number[];
	private u_y: number[];
	private u_r: number[];
	private u_red: number[];
	private u_blue: number[];
	// private u_c: Object[];
	private time: number;
	private scrollVal: number;

	constructor($viewport: HTMLElement) {
		this.debug = false;
		this.viewport = $viewport;
		this.mobile = isMobile();
		this.canvas;
		this.shader;
		this.scale = 0.75;
		this.u_x = new Array<number>(10).fill(0);
		this.u_y = new Array<number>(10).fill(0);
		this.u_r = new Array<number>(10).fill(0);
		this.u_red = [0.894, 0.0, 0.38];
		this.u_blue = [0.0, 0.6157, 0.886];
		this.time = 0;
		this.scrollVal = 100;

		// window.addEventListener("scroll", this.updateScroll);
		new p5(this.sketch, this.viewport);
		// console.log(isMobile());
	}

	sketch = (p: p5) => {

		p.setup = () => {
			this.scale = p.windowWidth / 2000;
			this.canvas = p.createCanvas(
				window.innerWidth,
				window.innerHeight,
				p.WEBGL
			);
			const gl: any = (this.canvas as any).canvas.getContext("webgl");
			gl.disable(gl.DEPTH_TEST);
			p.colorMode(p.RGB);
			p.noStroke();
			p.pixelDensity(1);
			p.smooth();

			let test = new GPoint(0.25,-0.25,1,0,0);
			console.log(test.pos);

			this.shader = p.createShader(vShader, fShader);
		};

		p.draw = () => {
			p.background(0);
			p.noStroke();

			// let pos = [0.1,-0.1,-0.1,0.1];
			let mouse = {
				x: p.mouseX / p.width - 0.5,
				y: p.mouseY / p.height - 0.5
			}
			let pos = [mouse.x*0.25 - 0.75, mouse.y*0.5 * mouse.x, mouse.x*0.25 + 0.75, mouse.y*0.5  * -mouse.x]

			console.log(p.mouseX / p.width - 0.5);
			this.shader.setUniform("u_resolution", [p.width, p.height]);
			this.shader.setUniform("u_mouse", [p.mouseX,p.mouseY]);
			this.shader.setUniform("u_red", this.u_red);
			this.shader.setUniform("u_blue", this.u_blue);
			this.shader.setUniform("u_pos", pos);
			this.shader.setUniform("u_color", [0.894, 0.0, 0.38, 0.0, 0.6157, 0.886]);
			// this.shader.setUniform("u_scroll", this.scrollVal);
			// this.shader.setUniform("u_x", this.u_x);
			// this.shader.setUniform("u_y", this.u_y);
			// this.shader.setUniform("u_r", this.u_r);

			p.shader(this.shader);
			p.rect(0, 0, 0, 0);
			p.resetShader();

			if(this.debug){
				p.fill(255);
				p.ellipse(pos[0] * (p.width / 2), pos[1] * (p.height) * -1,50);
				p.ellipse(pos[2] * (p.width / 2), pos[3] * (p.height) * -1,50);
			}

			this.time += 0.0015;
		};

		p.windowResized = () => {
			// this.scale = p.windowWidth / 2000;
			if (this.debug) {
				console.log(`resized ${window.innerWidth}, ${window.innerHeight}`);
			}
			p.resizeCanvas(window.innerWidth, window.innerHeight);
			// this.x = window.innerWidth / 2;
			// this.y = window.innerHeight / 2;
		};

		const updateScroll = () => {
			// let target = window.scrollY || window.pageYOffset;
			// let pos = p.constrain(target, 0, this.scrollHeight + 1); //!!! +1??
			// this.scrollVal = 100 - pos / (this.scrollHeight / 100);
		};

		window.addEventListener("scroll", updateScroll);

		class GPoint {
			public pos: number[];
			public color: number[];
			// private radius: number;
			// private offset: number;
			// private mobile: boolean;

			constructor(
				_x: number,
				_y: number,
				_r: number,
				_g: number,
				_b: number,
				// _radius: number,
				// _offset: number,
				// _mobile: boolean,
			) {
				this.pos = [ _x, _y ];
				this.color = [ _r, _g, _b ];
				// this.radius = _radius;
				// this.offset = _offset;
				// this.mobile = _mobile;
				// this.setScroll(100);
			}
		}

	};
}

declare global {
	interface Window {
		PlanetGradient: typeof PlanetGradient;
		onPlanetGradientLoaded: () => void;
	}
}

if (import.meta.env.MODE === "iife") {
	window.PlanetGradient = PlanetGradient;
	window.onPlanetGradientLoaded && window.onPlanetGradientLoaded();
}
