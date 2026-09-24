export function naloziTeksturo(pot, gl) {
  if (!(gl instanceof WebGL2RenderingContext))
    throw new Error("Napacen format parametra gl");

  return new Promise((resolve, reject) => {
    const tekstura = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tekstura);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const pixel = new Uint8Array([0, 0, 255, 255]);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    );

    const slicica = new Image();

    slicica.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tekstura);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        slicica,
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      resolve(tekstura);
    };

    slicica.onerror = () => {
      reject(new Error("Napaka pri nalaganju slike: " + pot));
    };

    slicica.src = pot;
  });
}
