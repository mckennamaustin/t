import Panorama from '../scene/Panorama';
import Camera from '../camera/Camera';

export interface PanoramaGraphNode {
  id: number;
  floor: number;
  position: number[];
  edges: number[];
  name: string;
}

export interface FloorData {
  byFloor: {
    [floor: number]: {
      src: string;
      points: { [id: number]: { floorPosition: number[] } };
    };
  };
  allFloors: number[];
  floorplanDimensions: number[];
}

export interface RenderState {
  program: WebGLProgram;
  cull: number;
}

export interface TransitionEvent extends CustomEvent {
  detail: { start: Panorama; finish: Panorama; camera: Camera };
}

export type RotationHandler = (deltaPhi: number, deltaTheta: number) => void;
export type ZoomHandler = (deltaFov: number) => void;

export type PanoramaAccessorFromId = (id: number) => Panorama;