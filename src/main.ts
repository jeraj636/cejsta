import { Barva } from "./components/barva.ts";
import { narediBuffer } from "./services/bufferji.ts";
import { Objekt } from "./components/objekt.ts";
import { narediProgram } from "./services/narediProgram.ts";
import { vec2, mat4 } from "gl-matrix";
import { Ploscice } from "./components/ploscice.js";
import { perlin } from "./services/perlinNoise.ts";
import { Cesta, CestaFactoriy } from "./components/cesta.ts";

const platno = document.getElementById("platno") as HTMLCanvasElement;

const gl = platno.getContext("webgl2") as WebGL2RenderingContext;

if (!gl) {
  throw new Error("Ni webGL konteksta");
}

// Nastavljanje viewporta
platno.width = platno.clientWidth;
platno.height = platno.clientHeight;

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
platno.addEventListener("resize", posodobiVelikost);

// Blending
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

let pozicija = [0, 0] as vec2;
let hitrost = 20;
// Input
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      pozicija[1] += 10;
      break;
    case "ArrowLeft":
      pozicija[0] -= 10;

      break;
    case "ArrowRight":
      pozicija[0] += 10;
      break;
  }
});

const odzadje = new Barva("#D0E2A6");

await Objekt.init(gl);

await Cesta.init(gl);

let cesta = await CestaFactoriy.ustvari(
  "../assets/images/pot_obroba.png",
  "../assets/images/pot_sredisce.png",
  32,
  [-128, platno.height + 128],
  gl,
  platno.width,
);

setInterval(glavnaZanka, 16);

const orto = mat4.create();
const kamera = mat4.create();
function glavnaZanka() {
  gl.clearColor(odzadje.r, odzadje.g, odzadje.b, odzadje.a);
  gl.clear(gl.COLOR_BUFFER_BIT);

  mat4.identity(kamera);
  mat4.translate(kamera, kamera, [-pozicija[0], -pozicija[1], 0]);

  cesta.narisiMe(orto, kamera);
  cesta.posodobi(pozicija[1]);

  mat4.ortho(orto, 0, platno.width, 0, platno.height, -1, 1);
}

function posodobiVelikost() {
  platno.width = platno.clientWidth;
  platno.height = platno.clientHeight;
  gl.viewport(0, 0, platno.width, platno.height);
}
