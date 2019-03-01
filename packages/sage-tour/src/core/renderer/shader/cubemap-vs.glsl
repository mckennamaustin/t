precision mediump float;

attribute vec3 a_position;

varying vec3 v_position;

uniform mat4 u_projection;
uniform mat4 u_model;
uniform mat4 u_modelView;

void main()	
{
  v_position = normalize(vec3(u_model * vec4(a_position, 0.0)));
  
  vec3 transformed = vec3(a_position);

  vec4 mvPosition = u_modelView * vec4( transformed, 1.0 );
  
  gl_Position = u_projection * mvPosition;
  gl_Position.z = gl_Position.w;
}