import * as THREE from 'three';
import LODManager from '../lod/LODManager';

export default class Panorama {
  private _id: number;
  private _position: THREE.Vector3;
  private _floor: number;
  private _name: string;
  private _edges: Panorama[];
  private _lodManager: LODManager;
  private _thetaOffset: number;

  constructor(
    id: number,
    floor: number,
    name: string,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) {
    this._id = id;
    this._floor = floor;
    this._name = name;
    this._position = position;
    this._edges = [];
    this._thetaOffset = 0;
    this._lodManager = new LODManager(this._id);
  }

  public addEdge = (edge: Panorama): void => {
    this._edges.push(edge);
  };

  public setEdges = (edges: Panorama[]): void => {
    this._edges = edges;
  };

  public removeEdge = (edge: Panorama): void => {
    this._edges = this._edges.filter(panorama => panorama.id() !== edge.id());
  };

  public initializeGL = (gl: WebGLRenderingContext): void => {
    this._lodManager.initialize(gl);
  };

  public bind = (): void => {
    this._lodManager.bind();
  };

  public buffer = (): void => {
    this._lodManager.buffer();
  };
  public update = (): void => {
    this._lodManager.update();
  };
  public preload = (imagePathRoot: string): Promise<any> => {
    return this._lodManager.preload(imagePathRoot);
  };

  public load = (imagePathRoot: string): Promise<any> => {
    return this._lodManager.load(imagePathRoot);
  };

  public loadNeighbors = (imagePathRoot: string): void => {
    this._edges.forEach(neighbor => {
      neighbor.load(imagePathRoot);
    });
  };

  public isNeighbor = (candidate: Panorama): boolean => {
    return this.edgeIds().indexOf(candidate._id) >= 0;
  };

  public edgeIds = (): number[] => {
    return this._edges.map((edge: Panorama) => {
      return edge._id;
    });
  };

  public id = (): number => {
    return this._id;
  };

  public position = (): THREE.Vector3 => {
    return this._position.clone();
  };

  public floor = (): number => {
    return this._floor;
  };

  public name = (): string => {
    return this._name;
  };

  public setPosition = (position: THREE.Vector3): void => {
    this._position = position.clone();
  };

  public setThetaOffset = (offset: number): void => {
    this._thetaOffset = offset;
  };

  public thetaOffset = (): number => {
    return this._thetaOffset;
  };
}
