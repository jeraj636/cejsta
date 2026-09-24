#version 300 es

in vec4 a_tocke_pozicija;
in vec2 a_tekstura_koordinate;

out vec2 texChoordsf;

uniform mat4 matrika;
void main()
{
    texChoordsf = a_tekstura_koordinate;
    gl_Position = matrika * a_tocke_pozicija;
}