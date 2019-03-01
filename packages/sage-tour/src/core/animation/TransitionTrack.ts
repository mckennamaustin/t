import * as THREE from 'three';

import AnimationTrack from './AnimationTrack';
import Panorama from '../scene/Panorama';

export default class TransitionTrack extends AnimationTrack {
  private sourcePanorama: Panorama;
  private destinationPanorama: Panorama;
  private theta: number;
  private phi: number;
  private opacity: number;
  private cameraPosition: THREE.Vector3;
  private isTransitioning: boolean;
  private completionPercent: number;
  constructor() {
    super();
    this.cameraPosition = new THREE.Vector3(0, 0, 0);
    this.isTransitioning = false;
    this.completionPercent = 0;
  }

  public setEuler = (theta: number, phi: number): void => {
    this.theta = theta;
    this.phi = phi;
  };

  public getEuler = (): THREE.Euler => {
    return new THREE.Euler(this.phi - Math.PI / 2, this.theta + Math.PI / 2, 0);
  };

  public setSourcePanorama = (sourcePano: Panorama): void => {
    this.sourcePanorama = sourcePano;
  };

  public setDestinationPanorama = (destinationPano: Panorama): void => {
    this.destinationPanorama = destinationPano;
  };

  public getSourcePanorama = (): Panorama => {
    return this.sourcePanorama;
  };

  public getDestinationPanorama = (): Panorama => {
    return this.destinationPanorama;
  };

  public getSourceModel = (): THREE.Matrix4 => {
    return new THREE.Matrix4().makeTranslation(0, 0, 0);
  };

  public getDestinationModel = (): THREE.Matrix4 => {
    let dir: THREE.Vector3 = this.getDirectionBetweenPoints();
    dir = dir.multiplyScalar(-2);
    return new THREE.Matrix4().makeTranslation(dir.x, dir.y, dir.z);
  };

  public getSourceView = (): THREE.Matrix4 => {
    const position: THREE.Vector3 = this.getDirectionBetweenPoints().multiplyScalar(
      this.completionPercent
    );

    let view: THREE.Matrix4 = new THREE.Matrix4();
    view.makeRotationFromEuler(this.getEuler());
    view.multiply(
      new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)
    );

    return view;
  };

  public getDestinationView = (): THREE.Matrix4 => {
    const start = this.getDirectionBetweenPoints().multiplyScalar(-2);
    const finish = new THREE.Vector3(0, 0, 0);

    const position: THREE.Vector3 = start.lerp(finish, this.completionPercent);
    let view: THREE.Matrix4 = new THREE.Matrix4();
    view.makeRotationFromEuler(this.getEuler());
    view.multiply(
      new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)
    );

    return view;
  };

  public getSourceOpacity = (): number => {
    return this.opacity;
  };

  public getDestinationOpacity = (): number => {
    return 1.0 - this.opacity;
  };

  public getIsTransitioning = (): boolean => {
    return this.isTransitioning;
  };

  public setIsTransitioning = (state: boolean): void => {
    this.isTransitioning = state;
  };

  public getDirectionBetweenPoints = (): THREE.Vector3 => {
    const dir: THREE.Vector3 = this.destinationPanorama
      .position()
      .sub(this.sourcePanorama.position())
      .normalize()
      .negate();

    return dir;
  };

  protected onTick = (completionPercent: number): void => {
    this.opacity = 1.0 - completionPercent;
    this.cameraPosition = this.getDirectionBetweenPoints().multiplyScalar(
      completionPercent
    );
    this.completionPercent = completionPercent;
  };
  protected onFinish = (): void => {
    this.isTransitioning = false;
  };
  protected onReset = (): void => {
    this.opacity = 1;
    this.isTransitioning = false;
    this.completionPercent = 0;
  };
}
