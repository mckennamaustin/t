precision mediump float;

varying vec3 v_position;

uniform samplerCube u_cubemap;

void main()	
{
  gl_FragColor = vec4(textureCube(u_cubemap, vec3(v_position.x, v_position.yz)).rgb, 1.0);
}
