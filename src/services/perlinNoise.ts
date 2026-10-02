import { vec2 } from "gl-matrix";
function generatorGradientov(ix: number, iy: number) {
  const a = Math.imul(ix, 3284157443) as number;
  const b = Math.imul(iy, 1911520717) as number;
  let hash = (a + b) as number;
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  let kot = ((hash >>> 0) / 4294967296) * 2 * Math.PI;
  return vec2.fromValues(Math.cos(kot), Math.sin(kot));
}
function mrezniGradientSkalar(ix: number, iy: number, x: number, y: number) {
  const gradient = generatorGradientov(ix, iy);

  let dx = x - ix;
  let dy = y - iy;

  return gradient[0] * dx + gradient[1] * dy;
}
function interpoliraj(v0: number, v1: number, t: number) {
  return t * v1 + (t - 1) * v0;
}

function zbledi(t: number) {
  return ((6 * t - 15) * t + 10) * t * t * t;
}
export function perlin(x: number, y: number) {
  // Robne koordinate
  const x0 = Math.floor(x) as number;
  const y0 = Math.floor(y) as number;
  const x1 = (x0 + 1) as number;
  const y1 = (y0 + 1) as number;

  //uteži za interpolacij
  const ux = zbledi(x - x0) as number;
  const uy = zbledi(y - y0) as number;

  let v0 = mrezniGradientSkalar(x0, y0, x, y);
  let v1 = mrezniGradientSkalar(x1, y0, x, y);

  const zgoraj = interpoliraj(v0, v1, ux);

  v0 = mrezniGradientSkalar(x0, y1, x, y);
  v1 = mrezniGradientSkalar(x1, y1, x, y);

  const spodaj = interpoliraj(v0, v1, ux);

  return interpoliraj(zgoraj, spodaj, uy);
}
