import { narediBuffer } from "../services/bufferji.ts";
import { narediProgram } from "../services/narediProgram.ts";
import { naloziTeksturo } from "../services/textura.ts";
import { vec2, mat4 } from "gl-matrix";

export class Objekt {
  vel: vec2;
  poz: vec2;
  tekstura: WebGLTexture;

  private static gl: WebGL2RenderingContext;
  private static buffer: WebGLBuffer = -1;
  private static program: WebGLProgram = -1;

  constructor(vel: vec2, poz: vec2, tekstura: WebGLTexture) {
    this.vel = vel;
    this.poz = poz;
    this.tekstura = tekstura;
  }
  static async init(gl: WebGL2RenderingContext) {
    Objekt.gl = gl;
    if (Objekt.program == -1) {
      Objekt.program = await narediProgram(
        Objekt.gl,
        "../../assets/shaders/vertexShaderSource.glsl",
        "../../assets/shaders/fragmentShaderSource.glsl",
      );
    }
    if (Objekt.buffer == -1) {
      Objekt.buffer = narediBuffer(Objekt.gl, Objekt.program);
    }
  }
  static async ustvari(vel: vec2, poz: vec2, potDoSlike: string) {
    const tekstura = (await naloziTeksturo(
      potDoSlike,
      Objekt.gl,
    )) as WebGLTexture;

    return new Objekt(vel, poz, tekstura);
  }

  narisiMe(orto: mat4) {
    Objekt.gl.useProgram(Objekt.program);

    Objekt.gl.activeTexture(Objekt.gl.TEXTURE0);
    Objekt.gl.bindTexture(Objekt.gl.TEXTURE_2D, this.tekstura);

    const matrika = mat4.create();
    mat4.identity(matrika);
    mat4.translate(matrika, matrika, [this.poz[0], this.poz[1], 0]);
    mat4.scale(matrika, matrika, [this.vel[0], this.vel[1], 1]);

    const mvp = mat4.create();

    mat4.mul(mvp, orto, matrika);
    Objekt.gl.uniformMatrix4fv(
      Objekt.gl.getUniformLocation(Objekt.program, "matrika"),
      false,
      mvp,
    );
    Objekt.gl.uniform1i(
      Objekt.gl.getUniformLocation(Objekt.program, "u_image"),
      0,
    );

    Objekt.gl.drawArrays(Objekt.gl.TRIANGLES, 0, 6);
  }
}
