import * as THREE from 'three';
import ShaderProgram from '../../renderer/ShaderProgram';

export default class Cube {
  private cubePositionVBO: WebGLBuffer;
  private cubeIndexVBO: WebGLBuffer;
  private indexCount: number;
  private gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.createCube();
  }

  private createCube = (): void => {
    const indices = [];
    const vertices = [];
    let numberOfVertices = 0;

    const depth = 1;
    const height = 1;
    const width = 1;
    const depthSegments = 1;
    const heightSegments = 1;
    const widthSegments = 1;
    buildPlane(
      'z',
      'y',
      'x',
      -1,
      -1,
      depth,
      height,
      width,
      depthSegments,
      heightSegments,
      0
    ); // px
    buildPlane(
      'z',
      'y',
      'x',
      1,
      -1,
      depth,
      height,
      -width,
      depthSegments,
      heightSegments,
      1
    ); // nx
    buildPlane(
      'x',
      'z',
      'y',
      1,
      1,
      width,
      depth,
      height,
      widthSegments,
      depthSegments,
      2
    ); // py
    buildPlane(
      'x',
      'z',
      'y',
      1,
      -1,
      width,
      depth,
      -height,
      widthSegments,
      depthSegments,
      3
    ); // ny
    buildPlane(
      'x',
      'y',
      'z',
      1,
      -1,
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      4
    ); // pz
    buildPlane(
      'x',
      'y',
      'z',
      -1,
      -1,
      width,
      height,
      -depth,
      widthSegments,
      heightSegments,
      5
    ); // nz

    function buildPlane(
      u,
      v,
      w,
      udir,
      vdir,
      width,
      height,
      depth,
      gridX,
      gridY,
      materialIndex
    ) {
      var segmentWidth = width / gridX;
      var segmentHeight = height / gridY;

      var widthHalf = width / 2;
      var heightHalf = height / 2;
      var depthHalf = depth / 2;

      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;

      var vertexCounter = 0;
      var groupCount = 0;

      var ix, iy;

      var vector = new THREE.Vector3();

      // generate vertices, normals and uvs
      for (iy = 0; iy < gridY1; iy++) {
        var y = iy * segmentHeight - heightHalf;

        for (ix = 0; ix < gridX1; ix++) {
          var x = ix * segmentWidth - widthHalf;

          // set values to correct vector component

          vector[u] = x * udir;
          vector[v] = y * vdir;
          vector[w] = depthHalf;

          // now apply vector to vertex buffer

          vertices.push(vector.x, vector.y, vector.z);
          vertexCounter++;
        }
      }

      // indices

      // 1. you need three indices to draw a single face
      // 2. a single segment consists of two faces
      // 3. so we need to generate six (2*3) indices per segment

      for (iy = 0; iy < gridY; iy++) {
        for (ix = 0; ix < gridX; ix++) {
          var a = numberOfVertices + ix + gridX1 * iy;
          var b = numberOfVertices + ix + gridX1 * (iy + 1);
          var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
          var d = numberOfVertices + (ix + 1) + gridX1 * iy;

          // faces

          indices.push(a, b, d);
          indices.push(b, c, d);

          // increase counter

          groupCount += 6;
        }
      }

      numberOfVertices += vertexCounter;
    }

    this.cubePositionVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubePositionVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
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
