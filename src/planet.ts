import p5 from "p5";
import vShader1 from "./shader1.vert?raw";
import fShader1 from "./shader1.frag?raw";
import vShader2 from "./shader2.vert?raw";
import fShader2 from "./shader2.frag?raw";

interface IMouse {
	x: number;
	y: number;
}

const isMobile = () => {
	return "ontouchstart" in document.documentElement;
};

export class PlanetGradient {
	private viewport: HTMLElement;
	private canvas!: p5.Renderer;
	private buffer_1!: p5.Graphics;
	private buffer_2!: p5.Graphics;
	private shader1!: p5.Shader;
	private shader2!: p5.Shader;
	private debug: boolean;
	private mobile: boolean;
	private mouse: IMouse;
	private mouseDist: number;
	private scroll: number;
	private scrollOff: IMouse;
	private brightness: number;

	constructor($viewport: HTMLElement, brightness:number) {
		this.debug = false;
		this.viewport = $viewport;
		this.mobile = isMobile();
		this.canvas;
		this.buffer_1;
		this.buffer_2;
		this.shader1;
		this.shader2;
		this.mouse = { x: 0, y: 0 };
		this.mouseDist = 0;
		this.scroll = 0;
		this.scrollOff = { x: 0.75, y: 0.0 };
		this.brightness = brightness;

		new p5(this.sketch, this.viewport);
		console.log(this.mobile);
	}

	sketch = (p: p5) => {
		p.preload = () => {
			// this.shader1 = p.loadShader("src/shader1.vert", "src/shader1.frag");
			// this.shader2 = p.loadShader("src/shader2.vert", "src/shader2.frag");
		};

		p.setup = () => {
			this.canvas = p.createCanvas(
				window.innerWidth,
				window.innerHeight
				// p.WEBGL
			);
			this.buffer_1 = p.createGraphics(
				window.innerWidth,
				window.innerHeight,
				p.WEBGL
			);
			this.buffer_2 = p.createGraphics(
				window.innerWidth,
				window.innerHeight,
				p.WEBGL
			);
			this.buffer_1.noStroke();
			this.buffer_2.noStroke();
			this.buffer_1.pixelDensity(1);
			this.buffer_2.pixelDensity(1);
			this.scroll = 1;

			this.scrollOff.x = p.sin(1) * 0.75;
			this.scrollOff.y = p.cos(1) * 0.5;

			p.colorMode(p.RGB);
			p.noStroke();
			p.pixelDensity(1);
			p.smooth();
			this.shader1 = this.buffer_1.createShader(vShader1, fShader1);
			this.shader2 = this.buffer_2.createShader(vShader2, fShader2);
		};

		p.draw = () => {
			let mouse = {
				x: p.mouseX / p.width - 0.5,
				y: p.mouseY / p.height - 0.5,
			};

			// console.log(mouse);

			let pos = [
				this.mobile ? -this.scrollOff.x : mouse.x * 0.5 - this.scrollOff.x,
				this.mobile ? this.scrollOff.y : mouse.y * 0.5 * mouse.x + this.scrollOff.y,
				this.mobile ? this.scrollOff.x : mouse.x * 0.5 + this.scrollOff.x,
				this.mobile ? -this.scrollOff.y : mouse.y * 0.5 * -mouse.x - this.scrollOff.y,
			];

			this.mouseDist = p.sqrt(p.movedX * p.movedX + p.movedY * p.movedY);
			this.mouseDist = p.constrain(this.mouseDist, 0, 2) / 2;

			this.buffer_1.shader(this.shader1);

			this.shader1.setUniform("u_resolution", [p.width, p.height]);
			this.shader1.setUniform("u_mouse", [this.mouse.x, this.mouse.y]);
			this.shader1.setUniform("u_mouseDist", this.mouseDist);
			this.shader1.setUniform(
				"u_color",
				[0.0, 0.6157, 0.886, 0.894, 0.0, 0.38]
			);
			this.shader1.setUniform("u_pos", pos);
			this.shader1.setUniform("u_buffer", this.buffer_1);

			this.buffer_1.rect(0, 0, p.width, p.height);
			this.buffer_2.shader(this.shader2);

			this.shader2.setUniform("u_resolution", [p.width, p.height]);
			this.shader2.setUniform("u_mouse", [this.mouse.x, this.mouse.y]);
			this.shader2.setUniform("u_buffer", this.buffer_1);
			this.shader2.setUniform(
				"u_color",
				[0.0, 0.6157, 0.886, 0.894, 0.0, 0.38]
			);
			this.shader2.setUniform("u_pos", pos);
			this.shader2.setUniform("u_brightness", this.brightness);

			this.buffer_2.rect(0, 0, p.width, p.height);

			p.image(this.buffer_2, 0, 0);

			if (this.debug) {
				p.fill(255);
				let xOffset = p.width / 2;
				let yOffset = p.height / 2;
				p.ellipse(xOffset + pos[0] * xOffset, yOffset - pos[1] * yOffset, 50);
				p.ellipse(xOffset + pos[2] * xOffset, yOffset - pos[3] * yOffset, 50);
				p.ellipse(xOffset, yOffset, 10);
			}
		};

		p.windowResized = () => {
			p.resizeCanvas(window.innerWidth, window.innerHeight);
			this.buffer_1.resizeCanvas(window.innerWidth, window.innerHeight);
			this.buffer_2.resizeCanvas(window.innerWidth, window.innerHeight);
		};

		const updateScroll = () => {
			let target = window.scrollY || window.pageYOffset;
			this.scroll = target;
			this.scrollOff.x = this.mobile ? p.sin(this.scroll / 1000 + 1) * 0.75 : p.sin(this.scroll / 1000 + 1) * 0.75;
			this.scrollOff.y = this.mobile ? p.cos(this.scroll / 1000 + 1) * 0.9 : p.cos(this.scroll / 1000 + 1) * 0.65;
			// console.log(this.mouse.x, this.mouse.y);
		};

		window.addEventListener("scroll", updateScroll);

		window.addEventListener("pointermove", (e) => {
			let ratio = window.innerHeight / window.innerWidth;

			if (window.innerHeight > window.innerWidth) {
				this.mouse.x = (e.pageX - window.innerWidth / 2) / window.innerWidth;
				this.mouse.y =
					((e.pageY - this.scroll - window.innerHeight / 2) /
						window.innerHeight) *
					-1 *
					ratio;
			} else {
				this.mouse.x =
					(e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
				this.mouse.y =
					((e.pageY - this.scroll - window.innerHeight / 2) /
						window.innerHeight) *
					-1;
			}
		});
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
