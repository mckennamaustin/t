import Cube from '../scene/geometry/Cube';
import ShaderProgram from './ShaderProgram';
import PanoramaManager from '../scene/PanoramaManager';
import { RenderState } from '../types/index';

import * as cubemapVS from './shader/cubemap-vs.glsl';
import * as cubemapFS from './shader/cubemap-fs.glsl';
import Camera from '../camera/Camera';
import Panorama from '../scene/Panorama';

export default class PanoramaRenderer {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;

  private cube: Cube;
  private oldState: RenderState;
  private program: ShaderProgram;
  private panoramaManager: PanoramaManager;

  constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
    this.gl = gl;
    this.canvas = canvas;

    this.cube = new Cube(this.gl);
    this.program = new ShaderProgram(gl, cubemapVS, cubemapFS);

    this.program.bind();
    this.program.registerUniform('u_model');
    this.program.registerUniform('u_modelView');
    this.program.registerUniform('u_projection');
    this.program.registerUniform('u_cubemap');
    this.program.registerAttribute('a_position');
  }

  private storeRenderState = (): void => {
    const oldProgram: WebGLProgram = this.gl.getParameter(
      this.gl.CURRENT_PROGRAM
    );
    const oldCullState: number = this.gl.getParameter(this.gl.CULL_FACE_MODE);

    this.oldState = {
      program: oldProgram,
      cull: oldCullState
    };
  };

  private restoreRenderState = (): void => {
    this.gl.cullFace(this.oldState.cull);
    this.gl.useProgram(this.oldState.program);
  };

  public render = (camera: Camera, activePanorama: Panorama): void => {
    this.storeRenderState();

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.program.bind();
    this.program.setUniformMat4fv('u_model', camera.camera().matrixWorld);
    this.program.setUniformMat4fv(
      'u_modelView',
      camera.camera().modelViewMatrix
    );
    this.program.setUniformMat4fv(
      'u_projection',
      camera.camera().projectionMatrix
    );
    this.program.setUniformI('u_cubemap', 0);
    this.cube.bind(this.program);

    activePanorama.buffer();
    activePanorama.bind();
    activePanorama.update();

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.FRONT);

    this.cube.draw();

    this.restoreRenderState();
  };
}
