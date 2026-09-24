import { narediBuffer } from "../services/bufferji.js";
import { narediProgram } from "../services/narediProgram.js";
import { naloziTeksturo } from "../services/textura.js";

export class Ploscice {
  #tekstura;
  #gl;
  #program;
  #podatki;
  #bufferPosameznih;
  #arraybuffer;

  constructor(tekstura, gl, program) {
    this.#tekstura = tekstura;
    if (!(gl instanceof WebGL2RenderingContext))
      throw new Error("Napaka pr gl");
    this.#gl = gl;
    this.#podatki = [];
    this.#program = program;

    this.#naderiBufferje();
  }
  static async ustvari(slikicaPot, gl) {
    const tekstura = await naloziTeksturo(slikicaPot, gl);
    const program = await narediProgram(
      gl,
      "../../assets/shaders/vertexShaderSourcePloscice.glsl",
      "../../assets/shaders/fragmentShaderSourcePloscice.glsl",
    );

    return new Ploscice(tekstura, gl, program);
  }

  dodaj(pozX, pozY, velX, velY, rot) {
    this.#podatki.push(pozX, pozY, velX, velY, rot);
  }

  #naderiBufferje() {
    this.#gl.useProgram(this.#program);

    this.#arraybuffer = narediBuffer(this.#gl, this.#program, "vertexPosition");

    this.#bufferPosameznih = this.#gl.createBuffer();
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#bufferPosameznih);

    const stride = 5 * 4;
    const pozLoc = this.#gl.getAttribLocation(this.#program, "a_objektPos");
    if (pozLoc == -1) throw new Error("ni pozLoc");
    this.#gl.enableVertexAttribArray(pozLoc);
    this.#gl.vertexAttribPointer(pozLoc, 2, this.#gl.FLOAT, false, stride, 0);
    this.#gl.vertexAttribDivisor(pozLoc, 1);

    const pozVel = this.#gl.getAttribLocation(this.#program, "a_objektVel");
    if (pozVel == -1) throw new Error("ni pozvel");
    this.#gl.enableVertexAttribArray(pozVel);
    this.#gl.vertexAttribPointer(
      pozVel,
      2,
      this.#gl.FLOAT,
      false,
      stride,
      2 * 4,
    );
    this.#gl.vertexAttribDivisor(pozVel, 1);

    /*
    const pozRot = this.#gl.getAttribLocation(this.#program, "a_objektRot");
    if (pozRot == -1) throw new Error("ni pozrot");
    this.#gl.enableVertexAttribArray(pozRot);
    this.#gl.vertexAttribPointer(
      pozRot,
      1,
      this.#gl.FLOAT,
      false,
      stride,
      4 * 4,
    );
    this.#gl.vertexAttribDivisor(pozRot, 1);
    */
  }

  narisiNas(orto) {
    this.#gl.useProgram(this.#program);
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#arraybuffer);
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#bufferPosameznih);
    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(this.#podatki),
      this.#gl.DYNAMIC_DRAW,
    );

    this.#gl.activeTexture(this.#gl.TEXTURE0);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#tekstura);

    this.#gl.uniformMatrix4fv(
      this.#gl.getUniformLocation(this.#program, "u_m_orto"),
      false,
      orto,
    );

    this.#gl.uniform1i(
      this.#gl.getUniformLocation(this.#program, "u_image"),
      0,
    );

    //morda bo delovalo
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    const steviloObjektov = this.#podatki.length / 5;
    this.#gl.drawArraysInstanced(this.#gl.TRIANGLES, 0, 6, steviloObjektov);
  }
}
