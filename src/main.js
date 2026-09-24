import { Barva } from "./components/barva.js";
import { narediBuffer } from "./services/bufferji.js";
import { Objekt } from "./components/objekt.js";
import { narediProgram } from "./services/narediProgram.js";
import { mat4 } from "gl-matrix";
import { Ploscice } from "./components/ploscice.js";

const platno = document.getElementById("platno");

if (!(platno instanceof HTMLCanvasElement)) {
  throw new Error("Ni platna");
}

const gl = platno.getContext("webgl2");
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

const program = await narediProgram(
  gl,
  "assets/shaders/vertexShaderSource.glsl",
  "assets/shaders/fragmentShaderSource.glsl",
);
gl.useProgram(program);

const odzadje = new Barva("#D0E2A6");

const buffer = narediBuffer(gl, program, "vertexPosition");

const kvadrat = await Objekt.ustvari(
  100,
  100,
  200,
  200,
  "assets/images/pot_obroba.png",
  gl,
  program,
  buffer,
);
const ploscice = await Ploscice.ustvari("assets/images/pot_obroba.png", gl);

setInterval(glavnaZanka, 16);
const orto = mat4.create();

function glavnaZanka() {
  gl.clearColor(odzadje.r, odzadje.g, odzadje.b, odzadje.a);
  gl.clear(gl.COLOR_BUFFER_BIT);
  mat4.ortho(orto, 0, platno.width, platno.height, 0, -1, 1);

  ploscice.narisiNas(orto);
  //kvadrat.narisiMe(orto);
}

function posodobiVelikost() {
  platno.width = platno.clientWidth;
  platno.height = platno.clientHeight;

  gl.viewport(0, 0, platno.width, platno.height);
}
