import { Barva } from "./components/barva.ts";
import { narediBuffer } from "./services/bufferji.ts";
import { Objekt } from "./components/objekt.ts";
import { narediProgram } from "./services/narediProgram.ts";
import { mat4 } from "gl-matrix";
import { Ploscice } from "./components/ploscice.js";

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

const odzadje = new Barva("#D0E2A6");

await Objekt.init(gl);
const kvadrat = await Objekt.ustvari(
  [100, 100],
  [700, 700],
  "../assets/images/pot_obroba.png",
);

await Ploscice.init(gl);
const ploscice = await Ploscice.ustvari("assets/images/pot_obroba.png");
ploscice.dodaj([200, 400], [32, 32], 0);
ploscice.dodaj([300, 400], [32, 32], 0);
ploscice.dodaj([600, 550], [64, 64], 0);

setInterval(glavnaZanka, 16);
const orto = mat4.create();

function glavnaZanka() {
  gl.clearColor(odzadje.r, odzadje.g, odzadje.b, odzadje.a);
  gl.clear(gl.COLOR_BUFFER_BIT);
  mat4.ortho(orto, 0, platno.width, platno.height, 0, -1, 1);

  kvadrat.narisiMe(orto);
  ploscice.narisiNas(orto);
}

function posodobiVelikost() {
  platno.width = platno.clientWidth;
  platno.height = platno.clientHeight;

  gl.viewport(0, 0, platno.width, platno.height);
}
