import { narediBuffer } from "../services/bufferji.ts";
import { narediProgram } from "../services/narediProgram.ts";
import { naloziTeksturo } from "../services/textura.ts";
import { vec2, mat4 } from "gl-matrix";

export class Ploscice {
  private tekstura: WebGLTexture;
  private static gl: WebGL2RenderingContext;
  private podatki: number[];
  private posebiBuffer: WebGLBuffer;

  private static program: WebGLProgram = -1;
  private static arraybuffer: WebGLBuffer = -1;
  private static pozLok: number;
  private static pozVel: number;
  private static pozRot: number;

  static async init(gl: WebGL2RenderingContext) {
    Ploscice.gl = gl;
    if (Ploscice.program == -1) {
      Ploscice.program = await narediProgram(
        gl,
        "../../assets/shaders/vertexShaderSourcePloscice.glsl",
        "../../assets/shaders/fragmentShaderSourcePloscice.glsl",
      );
      Ploscice.pozLok = Ploscice.gl.getAttribLocation(
        Ploscice.program,
        "a_objektPos",
      );
      if (this.pozLok == -1) throw new Error("ni pozLoc");
      Ploscice.pozVel = Ploscice.gl.getAttribLocation(
        Ploscice.program,
        "a_objektVel",
      );
      if (Ploscice.pozVel == -1) throw new Error("ni pozvel");
    }
    if (this.arraybuffer == -1) {
      Ploscice.gl.useProgram(this.program);

      Ploscice.arraybuffer = narediBuffer(Ploscice.gl, Ploscice.program);
    }
  }

  constructor(tekstura: WebGLTexture, posebiBufer: WebGLBuffer) {
    this.tekstura = tekstura;
    this.podatki = [];
    this.posebiBuffer = posebiBufer;
  }

  static async ustvari(slikicaPot: string) {
    const tekstura = (await naloziTeksturo(
      slikicaPot,
      Ploscice.gl,
    )) as WebGLTexture;

    const posebiBuffer = Ploscice.gl.createBuffer() as WebGLBuffer;
    Ploscice.gl.bindBuffer(Ploscice.gl.ARRAY_BUFFER, posebiBuffer);

    const stride = 5 * 4;

    Ploscice.gl.enableVertexAttribArray(Ploscice.pozLok);
    Ploscice.gl.vertexAttribPointer(
      Ploscice.pozLok,
      2,
      Ploscice.gl.FLOAT,
      false,
      stride,
      0,
    );
    Ploscice.gl.vertexAttribDivisor(Ploscice.pozLok, 1);

    Ploscice.gl.enableVertexAttribArray(Ploscice.pozVel);
    Ploscice.gl.vertexAttribPointer(
      Ploscice.pozVel,
      2,
      Ploscice.gl.FLOAT,
      false,
      stride,
      2 * 4,
    );
    Ploscice.gl.vertexAttribDivisor(Ploscice.pozVel, 1);
    return new Ploscice(tekstura, posebiBuffer);
  }

  dodaj(poz: vec2, vel: vec2, rot: number) {
    this.podatki.push(poz[0], poz[1], vel[0], vel[1], rot);
  }

  narisiNas(orto: mat4) {
    Ploscice.gl.useProgram(Ploscice.program);
    Ploscice.gl.bindBuffer(Ploscice.gl.ARRAY_BUFFER, Ploscice.arraybuffer);
    Ploscice.gl.bindBuffer(Ploscice.gl.ARRAY_BUFFER, this.posebiBuffer);
    Ploscice.gl.bufferData(
      Ploscice.gl.ARRAY_BUFFER,
      new Float32Array(this.podatki),
      Ploscice.gl.DYNAMIC_DRAW,
    );

    Ploscice.gl.activeTexture(Ploscice.gl.TEXTURE0);
    Ploscice.gl.bindTexture(Ploscice.gl.TEXTURE_2D, this.tekstura);

    Ploscice.gl.uniformMatrix4fv(
      Ploscice.gl.getUniformLocation(Ploscice.program, "u_m_orto"),
      false,
      orto,
    );

    Ploscice.gl.uniform1i(
      Ploscice.gl.getUniformLocation(Ploscice.program, "u_image"),
      0,
    );

    //morda bo delovalo
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    const steviloObjektov = this.podatki.length / 5;
    Ploscice.gl.drawArraysInstanced(
      Ploscice.gl.TRIANGLES,
      0,
      6,
      steviloObjektov,
    );
  }
}
