precision mediump float;

varying vec2 v_uv;

uniform float u_opacity;
uniform float u_time;

void main()	
{
  vec2 uv = v_uv;
  uv = (uv * 2.0) - 1.0;

  float time = u_time * 1.5;

  float d = length(uv);

  float or = 0.9 + (0.05 * sin(time));
  float ir = or - 0.3;
  float aaf = 0.01;
  aaf = 0.1;

  float brightness = smoothstep(or, or-aaf, d);
  brightness -= smoothstep(ir, ir-aaf, d);

  vec3 col = vec3(brightness);

  float opacity = 0.0;
  if (brightness > 0.0)
  {
    opacity = u_opacity;
  }

  gl_FragColor = vec4(col, opacity);
}