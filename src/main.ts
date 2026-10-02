import { Barva } from "./components/barva.ts";
import { narediBuffer } from "./services/bufferji.ts";
import { Objekt } from "./components/objekt.ts";
import { narediProgram } from "./services/narediProgram.ts";
import { mat4 } from "gl-matrix";
import { Ploscice } from "./components/ploscice.js";
import { perlin } from "./services/perlinNoise.ts";

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
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      ploscice.premakniVse([0, 1]);
      break;
  }
});

const odzadje = new Barva("#D0E2A6");

await Objekt.init(gl);

await Ploscice.init(gl);

const ploscice = await Ploscice.ustvari("assets/images/pot_obroba.png");

let xPoz = platno.width / 2;
let visina = 0;
let seme = Math.round(Math.random() * 1000);
for (; visina < platno.height; visina += 30) {
  ploscice.dodaj([xPoz, platno.height - visina], [64, 64]);
  let pVal = perlin(visina / 350, seme);
  xPoz += pVal * 70;
}

setInterval(glavnaZanka, 16);
const orto = mat4.create();
function glavnaZanka() {
  gl.clearColor(odzadje.r, odzadje.g, odzadje.b, odzadje.a);
  gl.clear(gl.COLOR_BUFFER_BIT);
  mat4.ortho(orto, 0, platno.width, platno.height, 0, -1, 1);

  ploscice.narisiNas(orto);

  if (ploscice.at(0)[1] >= platno.height) {
    ploscice.odbij();
    console.log("odbil");
  }
  if (ploscice.at(ploscice.lenght() - 1)[1] > 40) {
    console.log("nekaj");
    ploscice.dodaj([xPoz, platno.height - visina], [64, 64]);
    let pVal = perlin(visina / 350, seme);
    visina += 30;
    xPoz += pVal * 70;
  }
}

function posodobiVelikost() {
  platno.width = platno.clientWidth;
  platno.height = platno.clientHeight;

  gl.viewport(0, 0, platno.width, platno.height);
}
