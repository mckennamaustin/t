import * as glm from 'gl-matrix';
import { Vector2 } from '../types';

export default (incoming: Vector2, angle: number): Vector2 => {
  const vec: glm.vec2 = glm.vec2.fromValues(incoming.x, incoming.y);

  const rad = angle * 0.0174533;

  const s = Math.sin(rad);
  const c = Math.cos(rad);

  const m: glm.mat2 = glm.mat2.fromValues(c, -s, s, c);

  const result: glm.vec2 = glm.vec2.transformMat2(glm.vec2.create(), vec, m);

  return {
    x: result[0],
    y: result[1]
  };
};
