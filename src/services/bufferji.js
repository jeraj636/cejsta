export function narediBuffer(gl, program, imeAtrbuta) {
  if (!(gl instanceof WebGL2RenderingContext)) throw new Error("ni gl-ja");
  if (!(program instanceof WebGLProgram)) throw new Error("ni prgrama");
  const tocke = [
    [-0.5, -0.5, 0, 0, 0],
    [0.5, -0.5, 0, 1, 0],
    [0.5, 0.5, 0, 1, 1],
    [0.5, 0.5, 0, 1, 1],
    [-0.5, 0.5, 0, 0, 1],
    [-0.5, -0.5, 0, 0, 0],
  ];
  const tockePodatki = new Float32Array(tocke.flat());
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, tockePodatki, gl.STATIC_DRAW);
  const pozicijaTock = gl.getAttribLocation(program, imeAtrbuta);
  const pozicijaTockTeksture = gl.getAttribLocation(program, "texChoodrs");

  gl.enableVertexAttribArray(pozicijaTock);
  gl.vertexAttribPointer(
    pozicijaTock,
    3,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(pozicijaTockTeksture);
  gl.vertexAttribPointer(
    pozicijaTockTeksture,
    2,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );

  return buffer;
}
