import * as THREE from 'three';
import Camera from '../camera/Camera';

export default class MousePicker {
  private _picker: THREE.Raycaster;
  private _mousePosition: THREE.Vector2;

  constructor() {
    this._picker = new THREE.Raycaster();
    this._mousePosition = new THREE.Vector2(0, 0);
  }

  public setMousePosition = (mousePosition: THREE.Vector2): void => {
    this._mousePosition = mousePosition.clone();
  };

  public setCamera = (camera: Camera): void => {
    this._picker.setFromCamera(this._mousePosition, camera.camera());
  };

  public picker = (): THREE.Raycaster => {
    return this._picker;
  };
}
