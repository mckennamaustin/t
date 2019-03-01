import * as THREE from 'three';

import PanoramaManager from '../scene/PanoramaManager';
import Panorama from '../scene/Panorama';
import Scene from '../scene/index';
import PanoramaRenderer from './PanoramaRenderer';
import TransitionRenderer from './TransitionRenderer';
import Camera from '../camera/Camera';
import { TransitionEvent } from '../types/index';
import { TRANSITION } from '../../constants/events';

export default class SceneRenderer {
  private _renderer: THREE.WebGLRenderer;
  private _panoramaRenderer: PanoramaRenderer;
  private _transitionRenderer: TransitionRenderer;
  private _canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true
    });
    this._renderer.autoClear = true;
    this._renderer.autoClearColor = false;
    this._renderer.autoClearDepth = true;
    this._renderer.autoClearStencil = true;

    this._panoramaRenderer = new PanoramaRenderer(this.context(), this._canvas);
    this._transitionRenderer = new TransitionRenderer(
      this.context(),
      this._canvas
    );

    document.addEventListener(TRANSITION, (event: TransitionEvent) => {
      const { start, finish, camera } = event.detail;

      this.transitionTo(finish, start, camera);
    });
  }

  public resize = (width: number, height: number) => {
    this._renderer.setSize(width, height);
  };

  public context = (): WebGLRenderingContext => {
    return this._renderer.getContext();
  };

  public update = (dt: number) => {
    if (this._transitionRenderer.isTransitioning()) {
      this._transitionRenderer.update(dt);
    }
  };

  public render = (scene: Scene): void => {
    if (this._transitionRenderer.isTransitioning()) {
      this._transitionRenderer.render(scene.camera());
    } else {
      this._panoramaRenderer.render(
        scene.camera(),
        scene.panoramaManager().activePanorama()
      );
      this._renderer.render(scene.scene(), scene.camera().camera());
    }
  };

  public transitionTo = (
    destination: Panorama,
    source: Panorama,
    camera: Camera
  ): void => {
    this._transitionRenderer.makeTransition(
      source,
      destination,
      camera.theta(),
      camera.phi()
    );
  };
}
