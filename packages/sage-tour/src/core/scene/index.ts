import * as THREE from 'three';

import { PanoramaGraphNode } from '../types/index';
import PanoramaManager from './PanoramaManager';
import { LOAD } from '../../constants/events';
import Camera from '../camera/Camera';
import Panorama from './Panorama';
import Waypoint from './Waypoint';
import MousePicker from '../controllers/MousePicker';

export default class Scene {
  private _panoramaManager: PanoramaManager;
  private _camera: Camera;
  private _scene: THREE.Scene;
  private _waypoints: Waypoint[];

  constructor(
    panoramaGraph: PanoramaGraphNode[],
    root: number,
    imagePathRoot: string,
    canvas: HTMLCanvasElement
  ) {
    this._scene = new THREE.Scene();
    this._camera = new Camera(canvas.clientWidth / canvas.clientHeight);

    this._panoramaManager = new PanoramaManager(
      panoramaGraph,
      root,
      imagePathRoot
    );

    this._waypoints = [];
  }

  public hotReload = (
    panoramaGraph: PanoramaGraphNode[],
    root: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      document.addEventListener(LOAD, () => {
        resolve();
      });

      const imagePathRoot: string = this._panoramaManager.imagePathRoot();

      this._panoramaManager = new PanoramaManager(
        panoramaGraph,
        root,
        imagePathRoot
      );
    });
  };

  public initialize = (): void => {
    this._waypoints = this._waypoints.map(waypoint => {
      waypoint.markForDeletion();
      return waypoint;
    });
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }

    this._waypoints = this._panoramaManager
      .panoramas()
      .map((panorama: Panorama) => {
        return new Waypoint(panorama, this);
      });
  };

  public resize = (width: number, height: number): void => {
    this._camera.resize(width, height);
  };

  public update = (dt: number, picker: MousePicker): void => {
    this._waypoints.forEach(waypoint => {
      waypoint.update(dt, picker.picker(), this._camera);
    });
  };

  public scene = (): THREE.Scene => {
    return this._scene;
  };

  public camera = (): Camera => {
    return this._camera;
  };

  public panoramaManager = (): PanoramaManager => {
    return this._panoramaManager;
  };

  public updatePanoramaPosition = (
    id: number,
    position: THREE.Vector3
  ): void => {
    const waypoint = this._waypoints.filter(
      waypoint => waypoint.id() === id
    )[0];
    waypoint.updatePosition(position);
  };

  public setVisibilityForPanorama = (panorama: Panorama): void => {
    this._waypoints.forEach(waypoint => {
      waypoint.setVisible(false);

      if (panorama.edgeIds().indexOf(waypoint.id()) >= 0) {
        waypoint.setVisible(true);
      }
    });
  };

  public activate = (panoramaId: number): void => {
    this._panoramaManager.activate(panoramaId, this._camera);
    this.setVisibilityForPanorama(this._panoramaManager.activePanorama());
  };
}
