import * as THREE from 'three';

import Panorama from './Panorama';
import WaypointView from './WaypointView';
import Scene from './index';
import { WAYPOINT_CLICKED } from '../../constants/events';
import Camera from '../camera/Camera';

export default class Waypoint {
  private _panorama: Panorama;
  private _view: WaypointView;

  constructor(panorama: Panorama, scene: Scene) {
    this._panorama = panorama;
    this._view = new WaypointView(
      `waypoint-${this._panorama.id()}`,
      scene,
      () => {
        const event = new CustomEvent(WAYPOINT_CLICKED, {
          detail: { panorama: this._panorama }
        });

        document.dispatchEvent(event);
      }
    );

    this._view.updateMeshPosition(this._panorama.position());
  }

  updatePosition = (position: THREE.Vector3): void => {
    this._panorama.setPosition(position);
    this._view.updateMeshPosition(this._panorama.position());
  };

  public setVisible = (visible: boolean): void => {
    this._view.setVisible(visible);
  };

  public update = (
    dt: number,
    picker: THREE.Raycaster,
    camera: Camera
  ): void => {
    this._view.update(dt, picker, camera);
  };

  public id = (): number => {
    return this._panorama.id();
  };
  public position = (): THREE.Vector3 => {
    return this._panorama.position();
  };

  public markForDeletion() {
    this.setVisible(false);
  }
}
