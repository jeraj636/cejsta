#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 texChoordsf;

uniform sampler2D u_image;

void main() {
  fragColor = texture(u_image, texChoordsf) * vec4(1,0,0,1);
}