import { vec2, mat4 } from "gl-matrix";

export class Igralec {
  private pozicija: vec2;
  private hitrost: number;
  private rotacija: number;
  private prejsniKlic: number;
  private static HitrostObracanja = 0.002;
  private static pospesek = 0.002; // Povprečen avto je med 3 in 4 m/s^2
  private static bremze = 0.001; // Povprečen avto je med 3 in 4 m/s^2
  private static morotnoZaviranje = 0.0005;
  private static maxHitrost = 0.7;
  private static maxNazaj = -0.25;

  constructor(pozicija: vec2) {
    this.pozicija = pozicija;
    this.prejsniKlic = 0;
    this.hitrost = 0;
    this.rotacija = 0;
  }
  getPozicija() {
    return this.pozicija;
  }
  kamera() {
    let kameraMat = mat4.create();
    mat4.translate(kameraMat, kameraMat, [
      -this.pozicija[0],
      -this.pozicija[1],
      0,
    ]);
    return kameraMat;
  }
  posodobi(input: Set<string>) {
    let casKlica = performance.now();
    let deltaCas = casKlica - this.prejsniKlic;

    if (input.has("ArrowUp")) {
      this.hitrost += Igralec.pospesek * deltaCas;
      if (this.hitrost > Igralec.maxHitrost) this.hitrost = Igralec.maxHitrost;
    } else if (input.has("ArrowDown")) {
      this.hitrost -= Igralec.bremze * deltaCas;
      if (this.hitrost < Igralec.maxNazaj) this.hitrost = Igralec.maxNazaj;
    } else {
      this.hitrost -= Igralec.morotnoZaviranje * deltaCas;
      if (this.hitrost < 0) this.hitrost = 0;
    }

    if (input.has("ArrowLeft")) {
      this.rotacija += Igralec.HitrostObracanja * deltaCas;
    }
    if (input.has("ArrowRight")) {
      this.rotacija -= Igralec.HitrostObracanja * deltaCas;
    }
    this.pozicija[1] +=
      this.hitrost * deltaCas * Math.sin(this.rotacija + Math.PI / 2);
    this.pozicija[0] +=
      this.hitrost * deltaCas * Math.cos(this.rotacija + Math.PI / 2);
    this.prejsniKlic = performance.now();
  }
  getRotacia() {
    return this.rotacija;
  }
}
