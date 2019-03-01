precision mediump float;

attribute vec3 a_position;
attribute vec3 a_uv;

varying vec3 v_uv;

uniform mat4 u_projection;
uniform mat4 u_model;
uniform mat4 u_view;

void main()	
{
  v_uv = a_uv;
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}