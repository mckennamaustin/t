precision mediump float;

uniform sampler2D u_texture;
uniform bool u_flip;

varying vec2 v_uv;

void main()	{
  gl_FragColor = texture2D(u_texture, v_uv * vec2(1.0, u_flip ? -1.0 : 1.0));
}