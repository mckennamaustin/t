import * as THREE from 'three';

import { PanoramaGraphNode } from '../types/index';
import Panorama from './Panorama';
import { LOAD } from '../../constants/events';
import Camera from '../camera/Camera';

export default class PanoramaManager {
  private _panoramas: { [id: number]: Panorama };
  private _rootId: number;
  private _imagePathRoot: string;
  private _active: Panorama;

  constructor(
    panoramaGraph: PanoramaGraphNode[],
    rootId: number,
    imagePathRoot: string
  ) {
    this._rootId = rootId;
    this._imagePathRoot = imagePathRoot;
    this.initializeGraph(panoramaGraph);
  }

  public initialize = (gl: WebGLRenderingContext): void => {
    Object.keys(this._panoramas).forEach(key => {
      this._panoramas[parseInt(key)].initializeGL(gl);
    });
  };

  private initializeGraph = (panoramaGraph: PanoramaGraphNode[]): void => {
    const panoramas: { [id: number]: Panorama } = {};

    //First pass: build out panoramas
    panoramaGraph.forEach((node: PanoramaGraphNode) => {
      const panorama = new Panorama(
        node.id,
        node.floor,
        node.name,
        new THREE.Vector3().fromArray(node.position)
      );
      panoramas[node.id] = panorama;
    });

    //Second pass: associate edges
    panoramaGraph.forEach((node: PanoramaGraphNode) => {
      panoramas[node.id].setEdges(
        node.edges.map((edge: number) => {
          if (!panoramas[edge]) {
            throw new Error('No panorama with that edge id found!');
          }
          return panoramas[edge];
        })
      );
    });

    this._panoramas = panoramas;

    this._panoramas[this._rootId].preload(this._imagePathRoot).then(() => {
      document.dispatchEvent(new CustomEvent(LOAD));
    });

    Object.keys(this._panoramas).forEach((k: string) => {
      const key: number = parseInt(k);
      if (key !== this._rootId) {
        this._panoramas[key].preload(this._imagePathRoot);
      }
    });
  };

  public panoramas = (): Panorama[] => {
    return Object.keys(this._panoramas).map(key => {
      return this._panoramas[key];
    });
  };

  public byId = (id: number): Panorama => {
    return this._panoramas[id];
  };

  public activePanorama = (): Panorama => {
    return this._active;
  };

  public activate = (panoramaId: number, camera: Camera): void => {
    const panorama: Panorama = this._panoramas[panoramaId];
    if (!panorama) {
      throw `No panorama with id ${panoramaId} found!`;
    }

    this._active = panorama;
    this._active.load(this._imagePathRoot);

    camera.setPosition(this._active.position());
  };

  public imagePathRoot = (): string => {
    return this._imagePathRoot;
  };
}
