import ShaderProgram from '../../renderer/ShaderProgram';

export default class Quad {
  private gl: WebGLRenderingContext;
  private positionVBO: WebGLBuffer;
  private uvVBO: WebGLBuffer;
  private indexVBO: WebGLBuffer;
  private indexCount: number;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.createQuad();
  }

  private createQuad = (): void => {
    const vertices: number[] = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    const uvs: number[] = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    const indices: number[] = [0, 2, 1, 2, 0, 3];

    this.positionVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    this.uvVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(uvs),
      this.gl.STATIC_DRAW
    );

    this.indexVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    this.indexCount = indices.length;
  };

  public bind = (program: ShaderProgram): void => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);
    this.gl.vertexAttribPointer(
      program.getAttribute('a_position'),
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(program.getAttribute('a_position'));

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVBO);
    this.gl.vertexAttribPointer(
      program.getAttribute('a_uv'),
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(program.getAttribute('a_uv'));

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
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
