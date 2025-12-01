'use strict';

interface Vec2 {
	x: number;
	y: number;
}

export default class PerlinNoise {
	private gradients: Record<string, Vec2> = {};
	private memory: Record<string, number> = {};

	constructor() {
		this.seed();
	}

	private key(x: number, y: number): string {
		return `${x},${y}`;
	}

	private randVect(): Vec2 {
		const theta = Math.random() * 2 * Math.PI;
		return { x: Math.cos(theta), y: Math.sin(theta) };
	}

	private dotProdGrid(x: number, y: number, vx: number, vy: number): number {
		let g_vect;
		let d_vect = { x: x - vx, y: y - vy };
		if (this.gradients[this.key(vx, vy)]) {
			g_vect = this.gradients[this.key(vx, vy)];
		} else {
			g_vect = this.randVect();
			this.gradients[this.key(vx, vy)] = g_vect;
		}
		return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
	}

	private smootherstep(x: number): number {
		return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
	}

	private interp(x: number, a: number, b: number): number {
		return a + this.smootherstep(x) * (b - a);
	}

	public seed(): void {
		this.gradients = {};
		this.memory = {};
	}

	public get(x: number, y: number): number {
		const key = this.key(x, y);
		if (key in this.memory) {
			return this.memory[key];
		}

		const xf = Math.floor(x);
		const yf = Math.floor(y);

		let tl = this.dotProdGrid(x, y, xf, yf);
		let tr = this.dotProdGrid(x, y, xf + 1, yf);
		let bl = this.dotProdGrid(x, y, xf, yf + 1);
		let br = this.dotProdGrid(x, y, xf + 1, yf + 1);
		let xt = this.interp(x - xf, tl, tr);
		let xb = this.interp(x - xf, bl, br);
		let v = this.interp(y - yf, xt, xb);

		this.memory[key] = v;

		return v;
	}
}
