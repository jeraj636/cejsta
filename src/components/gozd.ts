import { mat4, vec2 } from "gl-matrix";
import { Ploscice } from "./ploscice";
import { or } from "three/src/nodes/math/OperatorNode.js";
import { perlin } from "../services/perlinNoise";

export class Gozd {
  private smreka: Ploscice;
  private lsitovec: Ploscice;
  private trava: Ploscice;
  private seme: number;
  private mejeX: vec2;
  private mejeY: vec2;
  private obdelanaVisina: number;
  constructor(
    smreka: Ploscice,
    listovec: Ploscice,
    trava: Ploscice,
    seme: number,
    mejeX: vec2,
    mejeY: vec2,
  ) {
    this.smreka = smreka;
    this.lsitovec = listovec;
    this.trava = trava;
    this.seme = seme;
    this.mejeX = mejeX;
    this.mejeY = mejeY;
    this.obdelanaVisina = 0;
  }
  posodobi(lokIgralca: vec2) {
    if (this.obdelanaVisina - lokIgralca[1] > 3000) return;

    for (let i = 0; i < this.smreka.lenght(); i++) {
      if (this.izvenMeje(this.smreka.at(i), lokIgralca)) {
        this.smreka.izbrisi(i);
      }
    }
    const deljenje = 300;
    for (let i = this.obdelanaVisina; i < lokIgralca[1] + 1000; i += 100) {
      for (let j = lokIgralca[0] - 1000; j < lokIgralca[0] + 5000; j += 100) {
        let perlinVrednost = perlin(
          (this.seme * i) / deljenje,
          (this.seme * j) / deljenje,
        );
        if (Math.random() < perlinVrednost * 0.2) {
          this.smreka.dodaj([j, i], [64, 64]);
        }
      }
    }
    this.obdelanaVisina = lokIgralca[1] + 1000;
  }
  private izvenMeje(lokObjekta: vec2, lokIgralca: vec2) {
    if (lokIgralca[1] - lokObjekta[1] >= 3000) {
      return true;
    }
    return false;
  }
  narisiNas(orto: mat4, kamera: mat4) {
    this.smreka.narisiNas(orto, kamera);
  }
}
export class GozdFactory {
  public static async gozd(
    smreka: string,
    listovec: string,
    trava: string,
    seme: number,
    gl: WebGL2RenderingContext,
  ) {
    await Ploscice.init(gl);
    const smreke = await Ploscice.ustvari(smreka);
    const listovci = await Ploscice.ustvari(listovec);
    const trave = await Ploscice.ustvari(trava);
    return new Gozd(smreke, listovci, trave, seme, [0, 0], [0, 0]);
  }
}
