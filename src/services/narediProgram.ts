import { naloziSkript } from "./nalagalnikSkript.ts";

export async function narediProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string,
) {
  const vertexShaderSource = await naloziSkript(vs);
  const fragmentShaderSource = await naloziSkript(fs);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) as string);

  return program;
}
