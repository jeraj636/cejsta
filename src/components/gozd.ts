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
  posodobi(lokIgralca: vec2, povCeste: number) {
    if (this.obdelanaVisina - lokIgralca[1] > 6000) return;

    while (this.izvenMeje(this.smreka.at(0), lokIgralca)) this.smreka.odbij();

    while (this.izvenMeje(this.lsitovec.at(0), lokIgralca))
      this.lsitovec.odbij();

    const deljenje = 300;
    for (let i = this.obdelanaVisina; i < lokIgralca[1] + 6000; i += 5) {
      for (let j = -3000; j < 3000; j += 5) {
        let perlinVrednost = perlin(
          (this.seme * i) / deljenje,
          (this.seme * j) / deljenje,
        );

        let nakljucnaVr = Math.random();
        const CestniFaktor = Math.abs(j - povCeste) / 1000;
        const mejnaVrednost = 1 - 0.0009 * CestniFaktor;
        if (
          0 <= perlinVrednost &&
          perlinVrednost <= 0.25 &&
          nakljucnaVr >= mejnaVrednost
        )
          this.smreka.dodaj([j, i], [128, 256]);
        if (
          0.25 <= perlinVrednost &&
          perlinVrednost <= 0.5 &&
          nakljucnaVr >= mejnaVrednost
        )
          this.lsitovec.dodaj([j, i], [32, 64]);
      }
    }
    this.obdelanaVisina = lokIgralca[1] + 6000;
  }
  private izvenMeje(lokObjekta: vec2, lokIgralca: vec2) {
    if (lokIgralca[1] - lokObjekta[1] >= 3000) {
      return true;
    }
    return false;
  }
  narisiNas(orto: mat4, kamera: mat4) {
    this.smreka.narisiNas(orto, kamera);
    this.lsitovec.narisiNas(orto, kamera);
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
