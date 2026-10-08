import { Barva } from "./components/barva.ts";
import { narediBuffer } from "./services/bufferji.ts";
import { Objekt } from "./components/objekt.ts";
import { narediProgram } from "./services/narediProgram.ts";
import { vec2, mat4 } from "gl-matrix";
import { Ploscice } from "./components/ploscice.js";
import { perlin } from "./services/perlinNoise.ts";
import { Cesta, CestaFactoriy } from "./components/cesta.ts";
import { or } from "three/src/nodes/math/OperatorNode.js";
import { Igralec } from "./components/igralec.ts";
import { GozdFactory } from "./components/gozd.ts";

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

// Input
let inputStanje = new Set<string>();
window.addEventListener("keydown", (event) => {
  inputStanje.add(event.key);
});
window.addEventListener("keyup", (event) => {
  inputStanje.delete(event.key);
});

const odzadje = new Barva("#D0E2A6");

await Objekt.init(gl);

await Cesta.init(gl);

let cesta = await CestaFactoriy.ustvari(
  "../assets/images/pot_obroba.png",
  "../assets/images/pot_sredisce.png",
  32,
  [-500, platno.height],
  gl,
  platno.width,
);

let gozd = await GozdFactory.gozd(
  "../assets/images/smreka.png",
  "../assets/images/drevo.png",
  "../assets/images/pot_obroba.png",
  1,
  gl,
);

let avto = await Objekt.ustvari(
  [128, 128],
  [platno.width / 2, platno.height / 2],
  0,
  "../assets/images/avto.png",
);
let igralec = new Igralec([platno.width, platno.height]);

requestAnimationFrame(glavnaZanka);
const orto = mat4.create();
let kamera = mat4.create();
const id = mat4.create();
function glavnaZanka() {
  gl.clearColor(odzadje.r, odzadje.g, odzadje.b, odzadje.a);
  gl.clear(gl.COLOR_BUFFER_BIT);

  mat4.ortho(orto, 0, platno.width, 0, platno.height, -1, 1);

  igralec.posodobi(inputStanje, cesta.povX());
  console.log(igralec.getPozicija());
  kamera = igralec.kamera();

  gozd.posodobi(igralec.getPozicija());
  gozd.narisiNas(orto, kamera);

  cesta.posodobi(igralec.getPozicija()[1]);
  cesta.narisiMe(orto, kamera);

  avto.narisiMe(orto, id, igralec.getRotacia());

  requestAnimationFrame(glavnaZanka);
}

function posodobiVelikost() {
  platno.width = platno.clientWidth;
  platno.height = platno.clientHeight;
  gl.viewport(0, 0, platno.width, platno.height);
}
