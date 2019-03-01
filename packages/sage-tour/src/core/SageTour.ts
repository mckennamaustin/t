import * as THREE from 'three';

import {
  PanoramaGraphNode,
  RotationHandler,
  ZoomHandler,
  FloorData
} from './types/index';
import Scene from './scene/index';
import SceneRenderer from './renderer/SceneRenderer';
import TourController from './controllers/TourController';
import MouseController from './controllers/MouseController';
import MousePicker from './controllers/MousePicker';
import { LOAD } from '../constants/events';
import Panorama from './scene/Panorama';
import * as Event from '../constants/events';
import Camera from './camera/Camera';
import Minimap from './Minimap';
import clamp from '../utils/clamp';

export interface SageTourOpts {
  imagePathRoot: string;
  rootId?: number;
  initialYawDegrees?: number;
  initialPitchDegrees?: number;
  disableControls?: boolean;
}

const AcceptedEvents = [
  Event.ROTATION,
  Event.ZOOM,
  Event.WAYPOINT_CLICKED,
  Event.CHANGE_FLOOR
];

export default class SageTour {
  private _container: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _scene: Scene;
  private _sceneRenderer: SceneRenderer;
  private _originTime: number;
  private _tourController: TourController;
  private _mouseController: MouseController;
  private _picker: MousePicker;
  private _hooks: { [event: string]: (any) => void };
  private _enableControls: boolean;
  private _minimap: Minimap;
  private _initialized: boolean;
  private _loopHandle: number;
  private _lock: boolean;

  constructor(
    container: HTMLDivElement,
    panoramaGraph: PanoramaGraphNode[],
    onLoad: () => void,
    opts: SageTourOpts
  ) {
    this._container = container;
    this._container.style.position = 'relative';
    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('class', 'sage-tour--canvas');
    this._container.appendChild(this._canvas);
    this._initialized = false;

    const yaw: number = opts.initialYawDegrees || 0;
    const pitch: number = opts.initialPitchDegrees || Math.PI / 2;
    const root: number = opts.rootId || panoramaGraph[0].id;
    const imagePathRoot: string = opts.imagePathRoot;
    const disableControls: boolean = opts.disableControls || false;
    this._lock = false;

    this._enableControls = !disableControls;
    this._tourController = new TourController();

    this._mouseController = new MouseController(
      this._canvas,
      this.onRotation,
      this.onZoom
    );

    this._picker = new MousePicker();
    document.addEventListener(Event.WAYPOINT_CLICKED, evt => {
      this.onWaypointClicked(evt.detail.panorama);
    });
    document.addEventListener(Event.CHANGE_FLOOR, evt => {
      this.onFloorChange(evt.detail.floor);
    });

    this._sceneRenderer = new SceneRenderer(this._canvas);

    this._scene = new Scene(panoramaGraph, root, imagePathRoot, this._canvas);
    document.addEventListener(LOAD, () => {
      if (!this._initialized) {
        this._initialized = true;
        this._scene.panoramaManager().initialize(this._sceneRenderer.context());
        this._scene.initialize();
        this._tourController.changePanorama(
          this._scene.panoramaManager().panoramas()[0]
        );

        this._tourController.setTheta(yaw);
        this._tourController.setPhi(pitch);

        this.onWindowResize();
        this.view();
        onLoad();
      }
    });

    window.addEventListener('resize', this.onWindowResize, false);
    this._hooks = {};
  }

  public addMinimap = (floorData: FloorData): void => {
    if (this._initialized) {
      this._minimap = new Minimap(
        this._container,
        floorData,
        this.panoramaById
      );
      this._minimap.setPanorama(this.activePanorama());
    } else {
      document.addEventListener(LOAD, () => {
        this._minimap = new Minimap(
          this._container,
          floorData,
          this.panoramaById
        );
        this._minimap.setPanorama(this.activePanorama());
      });
    }
  };

  public controller = (): TourController => {
    return this._tourController;
  };

  public on = (
    type:
      | Event.ZOOM
      | Event.ROTATION
      | Event.WAYPOINT_CLICKED
      | Event.CHANGE_FLOOR,
    handler: (any) => void
  ): void => {
    if (AcceptedEvents.indexOf(type) < 0) {
      throw new Error('Sage Tour does not emit that event!');
    }

    this._hooks[type] = handler;
  };

  public setEnableControls = (isEnabled: boolean): void => {
    this._enableControls = isEnabled;
  };

  public panoramas = (): { [key: number]: Panorama } => {
    const result = {};
    this._scene
      .panoramaManager()
      .panoramas()
      .forEach(panorama => {
        result[panorama.id()] = panorama;
      });
    return result;
  };

  public panoramaById = (id: number): Panorama => {
    return this.panoramas()[id];
  };

  public activePanorama = (): Panorama => {
    return this._scene.panoramaManager().activePanorama();
  };

  public camera = (): Camera => {
    return this._scene.camera();
  };

  public maxFloor = (): number => {
    const floors: number[] = this._scene
      .panoramaManager()
      .panoramas()
      .map((node: Panorama) => node.floor());

    return Math.max(...floors);
  };

  public minFloor = (): number => {
    const floors: number[] = this._scene
      .panoramaManager()
      .panoramas()
      .map((node: Panorama) => node.floor());

    return Math.min(...floors);
  };

  private onRotation = (deltaPhi: number, deltaTheta: number): void => {
    if (this._enableControls) {
      if (this._lock) {
        this._tourController.setPhi(Math.PI / 2);
      } else {
        this._tourController.applyDeltaPhi(deltaPhi);
        this._tourController.applyDeltaTheta(deltaTheta);
      }

      if (this._hooks[Event.ROTATION]) {
        this._hooks[Event.ROTATION]({ deltaPhi, deltaTheta });
      }
    }
  };

  private onZoom = (deltaFov: number): void => {
    if (this._enableControls) {
      this._tourController.applyDeltaFOV(deltaFov);

      if (this._hooks[Event.ZOOM]) {
        this._hooks[Event.ZOOM]({ deltaFov });
      }
    }
  };

  private onWaypointClicked = (destination: Panorama): void => {
    if (this._enableControls) {
      const source: Panorama = this._scene.panoramaManager().activePanorama();

      this._tourController.changePanorama(
        destination,
        this._scene.panoramaManager().activePanorama(),
        true,
        this._scene.camera()
      );

      if (this._minimap) {
        this._minimap.setPanorama(destination);

        if (source.floor() !== destination.floor()) {
          this._minimap.setFloor(destination.floor());
        }
      }

      if (this._hooks[Event.WAYPOINT_CLICKED]) {
        this._hooks[Event.WAYPOINT_CLICKED]({ destination });
      }
    }
  };

  public changePanorama = (destinationId: number): void => {
    const source: Panorama = this._scene.panoramaManager().activePanorama();
    const destination: Panorama = this._scene
      .panoramaManager()
      .byId(destinationId);

    this._tourController.changePanorama(
      destination,
      source,
      false,
      this._scene.camera()
    );

    if (this._minimap) {
      this._minimap.setPanorama(destination);

      if (source.floor() !== destination.floor()) {
        this._minimap.setFloor(destination.floor());
      }
    }
  };

  private onFloorChange = (newFloor: number): void => {
    if (this._enableControls) {
      const clampedFloor = clamp(newFloor, this.minFloor(), this.maxFloor());
      this._minimap.setFloor(clampedFloor);

      if (this._hooks[Event.CHANGE_FLOOR]) {
        this._hooks[Event.CHANGE_FLOOR](clampedFloor);
      }
    }
  };

  private onWindowResize = (): void => {
    const width = this._canvas.clientWidth;
    const height = this._canvas.clientHeight;

    this._canvas.width = width;
    this._canvas.height = height;

    this._scene.resize(width, height);
    this._sceneRenderer.resize(width, height);
  };

  private view = (): void => {
    this._originTime = performance.now();
    this.animate();
  };

  private animate = (): void => {
    const now = performance.now();
    const dt = (now - this._originTime) / 1000;
    this._originTime = now;

    this.update(dt);
    this.render();

    this._loopHandle = requestAnimationFrame(this.animate);
  };

  private update = (dt: number): void => {
    this._sceneRenderer.update(dt);

    this._tourController.update(this._scene, this.activePanorama());

    if (this._enableControls) {
      this._picker.setCamera(this._scene.camera());
      this._picker.setMousePosition(this._mouseController.mousePosition());
    }

    this._scene.update(dt, this._picker);
  };

  private render = (): void => {
    this._sceneRenderer.render(this._scene);
  };

  public updatePanoramaPosition = (
    id: number,
    position: { x: number; y: number; z: number }
  ): void => {
    this._scene.updatePanoramaPosition(
      id,
      new THREE.Vector3(position.x, position.y, position.z)
    );

    if (id === this.activePanorama().id()) {
      this.camera().setPosition(this.activePanorama().position());
    }
  };

  public updatePanoramaThetaOffset = (id: number, offset: number): void => {
    this._scene
      .panoramaManager()
      .byId(id)
      .setThetaOffset(offset);
  };

  public addPanoramaEdge = (start: number, finish: number): void => {
    const startId = parseInt('' + start);
    const finishId = parseInt('' + finish);

    const a = this._scene.panoramaManager().byId(startId);
    const b = this._scene.panoramaManager().byId(finishId);

    a.addEdge(b);
    b.addEdge(a);

    this._scene.activate(this.activePanorama().id());
  };

  public removePanoramaEdge = (start: number, finish: number): void => {
    const startId = parseInt('' + start);
    const finishId = parseInt('' + finish);

    const a = this._scene.panoramaManager().byId(startId);
    const b = this._scene.panoramaManager().byId(finishId);

    a.removeEdge(b);
    b.removeEdge(a);

    this._scene.activate(this.activePanorama().id());
  };

  public hotReload = (panoramaGraph: PanoramaGraphNode[]): void => {
    cancelAnimationFrame(this._loopHandle);
    this._scene.hotReload(panoramaGraph, 0).then(() => {
      this._picker = new MousePicker();
      this._scene.panoramaManager().initialize(this._sceneRenderer.context());
      this._scene.initialize();
      this._tourController.changePanorama(
        this._scene.panoramaManager().panoramas()[0]
      );
      this._scene.activate(0);
      this.view();
    });
  };

  public setLock = (isLocked: boolean): void => {
    this._lock = isLocked;
    if (this._lock) {
      this._tourController.setPhi(Math.PI / 2);
      this._tourController.setTheta(this.activePanorama().thetaOffset());
    }
  };
}
