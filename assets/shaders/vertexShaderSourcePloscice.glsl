#version 300 es

in vec4 vertexPosition;
in vec2 texChoodrs;
in vec2 a_objektPos;
in vec2 a_objektVel;

out vec2 texChoordsf;

uniform mat4 u_m_orto;

mat4 povecaj(vec2 p){
    return mat4(
        p.x,0.0,0.0,0.0,
        0.0,p.y,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
    );
}
mat4 premakni(vec2 p){
    return mat4(
        1.0,0.0,0.0,0.0,
        0.0,1.0,0.0,0.0,
        0.0,0.0,1.0,0.0,
        p.x,p.y,0.0,1.0
    );
}

void main()
{
    texChoordsf = texChoodrs;
    // Za zdaj ne bo rotacije
    gl_Position = u_m_orto * premakni(a_objektPos) * povecaj(a_objektVel) * vertexPosition;
}