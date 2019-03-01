import * as THREE from 'three';

import Panorama from '../scene/Panorama';
import TexturedCube from '../scene/geometry/TexturedCube';
import ShaderProgram from './ShaderProgram';
import PanoramaManager from '../scene/PanoramaManager';
import { RenderState } from '../types/index';
import * as cubeVS from './shader/cube-vs.glsl';
import * as cubeFS from './shader/cube-fs.glsl';
import TransitionTrack from '../animation/TransitionTrack';
import Camera from '../camera/Camera';

export default class TransitionRenderer {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private cube: TexturedCube;
  private oldState: RenderState;
  private program: ShaderProgram;
  private track: TransitionTrack;

  constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
    this.track = new TransitionTrack();

    this.gl = gl;
    this.canvas = canvas;
    this.cube = new TexturedCube(this.gl);
    this.program = new ShaderProgram(gl, cubeVS, cubeFS);

    this.program.bind();
    this.program.registerUniform('u_projection');
    this.program.registerUniform('u_model');
    this.program.registerUniform('u_view');
    this.program.registerUniform('u_cubemap');
    this.program.registerUniform('u_opacity');
    this.program.registerAttribute('a_position');
    this.program.registerAttribute('a_uv');
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

  public makeTransition = (
    start: Panorama,
    finish: Panorama,
    theta: number,
    phi: number
  ): void => {
    this.track.reset();
    this.track.setIsTransitioning(true);
    this.track.setEuler(theta, phi);
    this.track.setTime(0.6);
    this.track.setSourcePanorama(start);
    this.track.setDestinationPanorama(finish);
  };

  private restoreRenderState = (): void => {
    this.gl.cullFace(this.oldState.cull);
    this.gl.useProgram(this.oldState.program);
  };

  public update = (dt: number): void => {
    this.track.tick(dt);
  };

  public isTransitioning = (): boolean => {
    return this.track.getIsTransitioning();
  };

  public render = (camera: Camera): void => {
    this.storeRenderState();

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.program.bind();
    this.program.setUniformMat4fv('u_model', new THREE.Matrix4().identity());
    this.program.setUniformF('u_opacity', this.track.getSourceOpacity());
    this.program.setUniformMat4fv('u_view', this.track.getSourceView());

    this.program.setUniformMat4fv(
      'u_projection',
      camera.camera().projectionMatrix
    );
    this.program.setUniformI('u_cubemap', 0);
    this.cube.bind(this.program);

    this.track.getSourcePanorama().buffer();
    this.track.getSourcePanorama().bind();
    this.cube.draw();

    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

    this.program.setUniformMat4fv('u_model', new THREE.Matrix4().identity());
    this.program.setUniformF('u_opacity', this.track.getDestinationOpacity());
    this.program.setUniformMat4fv('u_view', this.track.getDestinationView());
    this.program.setUniformMat4fv(
      'u_projection',
      camera.camera().projectionMatrix
    );
    this.program.setUniformI('u_cubemap', 0);
    this.cube.bind(this.program);

    this.track.getDestinationPanorama().buffer();
    this.track.getDestinationPanorama().bind();
    this.cube.draw();

    this.restoreRenderState();
  };
}
