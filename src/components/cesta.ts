import { mat4, vec2 } from "gl-matrix";
import { Ploscice } from "./ploscice.ts";
import { perlin } from "../services/perlinNoise.ts";
import { abs } from "three/src/nodes/math/MathNode.js";

export class Cesta {
  private obrobe: Ploscice;
  private sredisce: Ploscice;
  private seme: number;
  private limita: vec2;
  private static gl: WebGL2RenderingContext;
  private visina: number;
  private xPoz: number;

  private static korak: number;
  static async init(gl: WebGL2RenderingContext) {
    await Ploscice.init(gl);
    Cesta.gl = gl;
    Cesta.korak = 64;
  }

  constructor(
    obrobe: Ploscice,
    sredisce: Ploscice,
    seme: number,
    limita: vec2,
    sirina: number,
  ) {
    this.obrobe = obrobe;
    this.sredisce = sredisce;
    this.seme = seme;
    this.limita = limita;

    this.visina = 0;
    this.xPoz = sirina / 2;
    let stIteracij = limita[1] / Cesta.korak;
    for (let i = 0; i < stIteracij; i++) {
      this.generirajNovo();
    }
  }

  private generirajNovo() {
    let perlinVrednost = perlin(this.visina / 100, this.seme);

    this.obrobe.dodaj([this.xPoz, this.visina], [128, 128]);
    this.sredisce.dodaj([this.xPoz, this.visina], [128, 128]);

    this.visina += Cesta.korak;
    this.xPoz += perlinVrednost * Cesta.korak * 2;
  }

  posodobi(visinaDejanska: number) {
    while (this.obrobe.at(0)[1] - visinaDejanska < this.limita[0]) {
      this.obrobe.odbij();
      this.sredisce.odbij();
    }
    while (
      this.obrobe.at(this.obrobe.lenght() - 1)[1] - visinaDejanska <
      this.limita[1]
    ) {
      this.generirajNovo();
    }
  }
  narisiMe(orto: mat4, kamera: mat4) {
    this.obrobe.narisiNas(orto, kamera);
    this.sredisce.narisiNas(orto, kamera);
  }
}
export class CestaFactoriy {
  static async ustvari(
    slika1: string,
    slika2: string,
    seme: number,
    limita: vec2,
    gl: WebGL2RenderingContext,
    sirina: number,
  ) {
    await Ploscice.init(gl);
    const obrobe = await Ploscice.ustvari(slika1);
    const sredisce = await Ploscice.ustvari(slika2);
    return new Cesta(obrobe, sredisce, seme, limita, sirina);
  }
}
