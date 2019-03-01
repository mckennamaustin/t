precision mediump float;

#include <common>

varying vec2 v_uv;

void main()	
{
  v_uv = uv;

  vec3 transformed = vec3(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
}