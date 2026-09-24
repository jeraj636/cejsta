import { naloziTeksturo } from "../services/textura.js";
import { mat4 } from "gl-matrix";

export class Objekt {
  constructor(velX, velY, x, y, tekstura, gl, program, buffer) {
    this.velX = velX;
    this.velY = velY;
    this.x = x;
    this.y = y;
    if (!(gl instanceof WebGL2RenderingContext)) throw new Error("ni gl-ja");
    this.gl = gl;
    this.tekstura = tekstura;

    this.buffer = buffer;
    this.program = program;
  }
  static async ustvari(velX, velY, x, y, slikica, gl, program, buffer) {
    const tekstura = await naloziTeksturo(slikica, gl);
    return new Objekt(velX, velY, x, y, tekstura, gl, program, buffer);
  }

  narisiMe(orto) {
    this.gl.useProgram(this.program);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tekstura);

    const matrika = mat4.create();
    mat4.identity(matrika);
    mat4.translate(matrika, matrika, [this.x, this.y, -0.5]);
    mat4.scale(matrika, matrika, [this.velX, this.velY, 1]);

    const mvp = mat4.create();

    mat4.mul(mvp, orto, matrika);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.program, "matrika"),
      false,
      mvp,
    );
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_image"), 0);

    //morda bo delovalo
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
