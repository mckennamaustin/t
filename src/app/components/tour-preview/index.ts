import SageTour from '../../../../packages/sage-tour';
import reactor from '../../reactor';
import Component from '../../reactor/component';
import getPanoramas from '../../services/getPanoramas';
import Panorama from '../panorama';
import { Vector2 } from '../../types';
import rotate2 from '../../utils/rotate2';
import RotationInput from './rotation-input';

const panoramaGraph = (() => {
  return getPanoramas().map(panorama => {
    return {
      id: panorama.id(),
      position: panorama.floorplanPosition(),
      edges: [],
      name: panorama.name(),
      floor: 1
    };
  });
})();

const onLoad = () => {};
const opts = {
  imagePathRoot: 'https://s3.amazonaws.com/staging.sageadmin.s3',
  disableControls: true
};

export default class TourPreview extends Component {
  private _container: HTMLDivElement;
  private _tour: any;
  private _rotationInput: RotationInput;
  private _rotation: number;

  constructor(root: HTMLDivElement) {
    super(root, 'ev-tour-preview');

    this._container = document.createElement('div');
    this._parent.appendChild(this._container);
    this._container.className = 'ev-tour-preview-container';
    this._tour = new SageTour(this._container, panoramaGraph, onLoad, opts);
    this._tour.setEnableControls(true);
    this._tour.on('rotation', ({ deltaPhi, deltaTheta }) =>
      reactor.handleRotation(deltaPhi, deltaTheta)
    );
    this._rotationInput = new RotationInput(this._parent);
    this._rotation = 0;
    reactor.setTourPreview(this);

    // setTimeout(() => {
    //   const pgraph = panoramaGraph.map(panorama => {
    //     panorama.edges = [];
    //     return panorama;
    //   });

    //   this._tour.hotReload(pgraph);
    // }, 5000);
  }

  public updatePosition = (panorama: Panorama, position: Vector2): void => {
    const rotatedPosition: Vector2 = rotate2(position, this._rotation);

    this._tour.updatePanoramaPosition(panorama.id(), {
      x: rotatedPosition.x,
      y: panorama.floor(),
      z: rotatedPosition.y
    });
  };

  public setRotation = (rotation: number): void => {
    this._rotation = rotation;
  };

  public updateThetaOffset = (panorama: Panorama, theta: number): void => {
    this._tour.updatePanoramaThetaOffset(parseInt(panorama.id()), theta);
  };

  public addEdge = (start: Panorama, end: Panorama): void => {
    this._tour.addPanoramaEdge(start.id(), end.id());
  };

  public removeEdge = (start: Panorama, end: Panorama): void => {
    this._tour.removePanoramaEdge(start.id(), end.id());
  };

  public lockPhi = (): void => {
    this._tour.setLock(true);
  };

  public unlockPhi = (): void => {
    this._tour.setLock(false);
  };

  public react = (stimulus: any): void => {
    const { active } = stimulus;

    this._tour.changePanorama(active.id());
  };
}
