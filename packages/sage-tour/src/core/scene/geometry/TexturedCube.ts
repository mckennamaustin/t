import * as THREE from 'three';
import ShaderProgram from '../../renderer/ShaderProgram';

export default class Cube {
  private cubePositionVBO: WebGLBuffer;
  private cubeUVVBO: WebGLBuffer;
  private cubeIndexVBO: WebGLBuffer;
  private indexCount: number;
  private gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.createCube();
  }

  private createCube = (): void => {
    const LEFT = -1;
    const RIGHT = 1;
    const FORWARD = 1;
    const BACKWARD = -1;
    const BOTTOM = -1;
    const TOP = 1;

    //prettier-ignore
    const vertices = [
      LEFT, BOTTOM, BACKWARD,
      RIGHT, BOTTOM, BACKWARD, //BOTTOM
      RIGHT, BOTTOM, FORWARD,
      LEFT, BOTTOM, FORWARD,

      LEFT, BOTTOM, BACKWARD,
      LEFT, BOTTOM, FORWARD, //LEFT
      LEFT, TOP, FORWARD,
      LEFT, TOP, BACKWARD,

      RIGHT, BOTTOM, BACKWARD,
      RIGHT, BOTTOM, FORWARD, //RIGHT
      RIGHT, TOP, FORWARD,
      RIGHT, TOP, BACKWARD,

      LEFT, TOP, BACKWARD,
      RIGHT, TOP, BACKWARD, //TOP
      RIGHT, TOP, FORWARD,
      LEFT, TOP, FORWARD,

      LEFT, BOTTOM, FORWARD,
      RIGHT, BOTTOM,FORWARD,
      RIGHT,TOP,FORWARD, //FRONT
      LEFT,TOP,FORWARD,

      LEFT, BOTTOM,BACKWARD,
      RIGHT,BOTTOM,BACKWARD,
      RIGHT,TOP,BACKWARD, //BACK
      LEFT,TOP,BACKWARD
    ];

    //prettier-ignore
    const indices: number[] = [
      0,2,1,
      2,0,3,

      4 + 0,4 + 2,4 + 1,
      4 + 2,4 + 0,4 + 3,

      8 + 0, 8 + 1,8 + 2,
      8 + 2, 8 + 3,8 + 0,

      12 + 0,12 + 1,12 + 2,
      12 + 2,12 + 3,12 + 0,

      16 + 0,16 + 2, 16 + 1, //back
      16 + 2,16 + 0,16 + 3,
      
      20 + 0,20 +1 ,20 + 2,
      20 + 2,20 + 3,20 + 0
    ];

    const uvs: number[] = [
      LEFT,
      BOTTOM,
      BACKWARD,
      RIGHT,
      BOTTOM,
      BACKWARD, //BOTTOM
      RIGHT,
      BOTTOM,
      FORWARD,
      LEFT,
      BOTTOM,
      FORWARD,

      LEFT,
      BOTTOM,
      BACKWARD,
      LEFT,
      BOTTOM,
      FORWARD, //LEFT
      LEFT,
      TOP,
      FORWARD,
      LEFT,
      TOP,
      BACKWARD,

      RIGHT,
      BOTTOM,
      BACKWARD,
      RIGHT,
      BOTTOM,
      FORWARD, //RIGHT
      RIGHT,
      TOP,
      FORWARD,
      RIGHT,
      TOP,
      BACKWARD,

      LEFT,
      TOP,
      BACKWARD,
      RIGHT,
      TOP,
      BACKWARD, //TOP
      RIGHT,
      TOP,
      FORWARD,
      LEFT,
      TOP,
      FORWARD,

      LEFT,
      BOTTOM,
      FORWARD,
      RIGHT,
      BOTTOM,
      FORWARD,
      RIGHT,
      TOP,
      FORWARD, //FRONT
      LEFT,
      TOP,
      FORWARD,

      LEFT,
      BOTTOM,
      BACKWARD,
      RIGHT,
      BOTTOM,
      BACKWARD,
      RIGHT,
      TOP,
      BACKWARD, //BACK
      LEFT,
      TOP,
      BACKWARD
    ];

    this.cubePositionVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubePositionVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    this.cubeUVVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeUVVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(uvs),
      this.gl.STATIC_DRAW
    );

    this.cubeIndexVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexVBO);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    this.indexCount = indices.length;
  };

  public bind = (program: ShaderProgram): void => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubePositionVBO);
    this.gl.vertexAttribPointer(
      program.getAttribute('a_position'),
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(program.getAttribute('a_position'));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeUVVBO);
    this.gl.vertexAttribPointer(
      program.getAttribute('a_uv'),
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(program.getAttribute('a_uv'));
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexVBO);
  };

  public draw = (): void => {
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  };
}
