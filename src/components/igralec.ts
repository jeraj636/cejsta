import { vec2, mat4 } from "gl-matrix";

export class Igralec {
  private pozicija: vec2;
  private hitrost: number;
  private rotacija: number;
  private prejsniKlic: number;
  private maxVisina: number;
  private velOkna: vec2;
  private static HitrostObracanja = 0.002;
  private static pospesek = 0.0002; // Povprečen avto je med 3 in 4 m/s^2
  private static bremze = 0.001; // Povprečen avto je med 3 in 4 m/s^2
  private static morotnoZaviranje = 0.0001;
  private static maxHitrost = 0.5;
  private static maxNazaj = -0.25;

  constructor(velOkna: vec2) {
    this.pozicija = [0, 0];
    this.prejsniKlic = 0;
    this.hitrost = 0;
    this.rotacija = 0;
    this.maxVisina = 0;
    this.velOkna = velOkna;
  }
  getPozicija() {
    return this.pozicija;
  }
  kamera() {
    let kameraMat = mat4.create();
    mat4.translate(kameraMat, kameraMat, [
      this.velOkna[0] / 2 - this.pozicija[0],
      this.velOkna[1] / 2 - this.pozicija[1],
      0,
    ]);
    return kameraMat;
  }
  posodobi(input: Set<string>, povX: number) {
    console.log(this.pozicija);
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

    if (input.has("ArrowLeft") && Math.abs(this.hitrost) > 0) {
      this.rotacija += Igralec.HitrostObracanja * deltaCas;
    }
    if (input.has("ArrowRight") && Math.abs(this.hitrost) > 0) {
      this.rotacija -= Igralec.HitrostObracanja * deltaCas;
    }
    const premikY =
      this.hitrost * deltaCas * Math.sin(this.rotacija + Math.PI / 2);
    if (premikY > 0) this.maxVisina += premikY;
    if (this.pozicija[1] + premikY >= this.maxVisina - 2000)
      this.pozicija[1] += premikY;

    const premikX =
      this.hitrost * deltaCas * Math.cos(this.rotacija + Math.PI / 2);
    if (
      this.pozicija[0] + premikX >= povX - 1000 &&
      this.pozicija[0] + premikX <= povX + 1000
    )
      this.pozicija[0] += premikX;

    this.prejsniKlic = performance.now();
  }
  getRotacia() {
    return this.rotacija;
  }
}
