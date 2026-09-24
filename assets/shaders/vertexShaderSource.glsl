#version 300 es

in vec4 vertexPosition;
in vec2 texChoodrs;

out vec2 texChoordsf;

uniform mat4 matrika;
void main()
{
    texChoordsf = texChoodrs;
    gl_Position = matrika * vertexPosition;
}