import { Vector2 } from '../types';
import Panorama from '../components/panorama';
import FloorplanViewer from '../components/floorplan-viewer';
import TourPreview from '../components/tour-preview';
import DropBay from '../components/drop-bay';
import DesignStudio from '..';
import Toolbar from '../components/toolbar/toolbar';
import { MOUSE_TOOL, TUNE_TOOL } from '../constants/tools';
import FloorSwitch from '../components/toolbar/FloorSwitch';
import MessageBar from '../components/floorplan-viewer/message-bar';

class Reactor {
  private _panoramas: { [id: string]: Panorama };
  private _floorplanViewer: FloorplanViewer;
  private _tourPreview: TourPreview;
  private _dropBay: DropBay;
  private _root: DesignStudio;
  private _toolbar: Toolbar;
  private _messageBar: MessageBar;
  private _floorSwitch: FloorSwitch;
  private _intersectsFloorplan: boolean;
  private _selectedTool: string;
  private _floorplanSrc: { [floor: number]: string };
  private _currentFloor: number;
  private _maxFloor: number;
  private _isLinking: boolean;
  private _linkOrigin: Vector2;
  private _linkDestination: Vector2;

  private _dragged: Panorama;
  private _linked: Panorama;
  private _exactLink: boolean;
  private _linkTarget: Panorama;
  private _isTuning: boolean;
  private _tuned: Panorama;
  private _rotation: number;

  constructor() {
    this._panoramas = {};
    this._intersectsFloorplan = false;
    this._selectedTool = MOUSE_TOOL;
    this._floorplanSrc = {
      1: '/floorplan1.svg',
      2: '/floorplan2.svg'
    };
    this._currentFloor = 1;
    this._maxFloor = 2;
    this._isLinking = false;
    this._rotation = 0;
  }

  public floorplanSrc = (): string => {
    return this._floorplanSrc[this._currentFloor];
  };
  public initialize = (root: DesignStudio): void => {
    this._root = root;

    window.addEventListener('mousemove', this.handleMouseMove);
  };

  public startDrag = (dragged: Panorama): void => {
    this._dragged = dragged;

    const dropbayCaptured = this.panoramasCapturedByDropBay();

    this._dropBay.react({ captured: dropbayCaptured });
    if (!dragged.isOverFloorplan) {
      this._root.react({ dragged });
    }

    window.addEventListener('mouseup', this.stopDrag, false);
  };

  public incrementFloor = (): void => {
    this._currentFloor = Math.min(this._currentFloor + 1, this._maxFloor);

    this._floorplanViewer.setFloorplanFromSrc(this.floorplanSrc());
    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
    this._floorSwitch.setFloor(this._currentFloor);
  };

  public decrementFloor = (): void => {
    this._currentFloor = Math.max(this._currentFloor - 1, 1);
    this._floorplanViewer.setFloorplanFromSrc(this.floorplanSrc());
    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
    this._floorSwitch.setFloor(this._currentFloor);
  };

  public stopDrag = (): void => {
    this._dragged.stopDrag();
    this._dragged = undefined;

    this._root.react({ dragged: undefined });
    this._dropBay.react({ captured: this.panoramasCapturedByDropBay() });

    window.removeEventListener('mouseup', this.stopDrag);
  };

  public panoramasCapturedByDropBay = (): { [id: string]: Panorama } => {
    const captured: { [id: string]: Panorama } = {};

    let keys = Object.keys(this._panoramas);
    if (this.isDragging()) {
      keys = keys.filter(
        key => this._panoramas[key].id() !== this._dragged.id()
      );
    }

    keys = keys.filter(key => !this._panoramas[key].isOverFloorplan);

    keys.forEach(key => {
      captured[key] = this._panoramas[key];
    });

    return captured;
  };

  public panoramasCapturedByFloorplanViewer = (): {
    [id: string]: Panorama;
  } => {
    const captured: { [id: string]: Panorama } = {};

    Object.keys(this._panoramas)
      .filter(
        key =>
          this._panoramas[key].isOverFloorplan &&
          this._panoramas[key].floor() === this._currentFloor
      )
      .forEach(key => (captured[key] = this._panoramas[key]));

    return captured;
  };

  private handleMouseMove = (evt: MouseEvent): void => {
    const { clientX, clientY } = evt;
    const mousePoint: Vector2 = { x: clientX, y: clientY };

    this._intersectsFloorplan = this._floorplanViewer.intersects(mousePoint);

    if (this.isDragging()) {
      if (!this._dragged.isOverFloorplan && this._intersectsFloorplan) {
        this._dragged.isOverFloorplan = true;
        this._root.react({ dragged: undefined });
        this._floorplanViewer.react({
          selected: this._selectedTool,
          captured: this.panoramasCapturedByFloorplanViewer()
        });
      } else if (this._dragged.isOverFloorplan && !this._intersectsFloorplan) {
        this._dragged.isOverFloorplan = false;
        this._root.react({ dragged: this._dragged });
        this._floorplanViewer.react({
          selected: this._selectedTool,
          captured: this.panoramasCapturedByFloorplanViewer()
        });
      }
      this._dragged.setPositionFromMouse(mousePoint);

      const rx = mousePoint.x / this.floorplanZoom();
      const ry = mousePoint.y / this.floorplanZoom();
      const fpp = this._floorplanViewer.transformRelativeToFloorplan({
        x: rx,
        y: ry
      });
      this._dragged.setPositionFromFloorplan(fpp, this._currentFloor);

      this._tourPreview.updatePosition(this._dragged, fpp);

      if (this._dragged.edges().length > 0) {
        this._floorplanViewer.react({
          selected: this._selectedTool,
          captured: this.panoramasCapturedByFloorplanViewer()
        });
      }

      if (this.isTuning() && this._dragged.id() === this._tuned.id()) {
        this._floorplanViewer.react({
          selected: this._selectedTool,
          captured: this.panoramasCapturedByFloorplanViewer()
        });
      }
    }

    if (this._isLinking) {
      if (!this._exactLink) {
        const rx = mousePoint.x / this.floorplanZoom();
        const ry = mousePoint.y / this.floorplanZoom();

        const { x, y } = this._floorplanViewer.transformRelativeToFloorplan({
          x: rx,
          y: ry
        });

        this._linkDestination = { x, y };
      }

      this._floorplanViewer.react({
        selected: this._selectedTool,
        captured: this.panoramasCapturedByFloorplanViewer(),
        isLinking: true,
        linkOrigin: this._linkOrigin,
        linkDestination: this._linkDestination,
        exactLink: this._exactLink
      });
    }
  };

  public startLink = (panorama: Panorama): void => {
    this._isLinking = true;
    this._linked = panorama;
    this._linkOrigin = panorama.floorplanPosition();
    this._linkDestination = panorama.floorplanPosition();

    window.addEventListener('mouseup', this.stopLink);
  };

  public isLinking = (): boolean => {
    return this._isLinking;
  };

  public linkTo = (destination: Panorama): void => {
    if (destination.id() !== this._linked.id()) {
      this._exactLink = true;
      this._linkDestination = destination.floorplanPosition();
      this._linkTarget = destination;
    }
  };

  public endLinkTo = (candidate: Panorama): void => {
    if (!this._linkTarget || candidate.id() === this._linkTarget.id()) {
      this._exactLink = false;
      this._linkTarget = undefined;
    }
  };

  public removeEdge = (a: Panorama, b: Panorama): void => {
    a.removeEdge(b);
    b.removeEdge(a);

    this._tourPreview.removeEdge(a, b);

    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
  };

  public removePanoramaFromFloorplan = (panorama: Panorama): void => {
    panorama.isOverFloorplan = false;

    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
    this._dropBay.react({ captured: this._panoramas });
  };

  public stopLink = (): void => {
    if (this._exactLink) {
      const a = this._linked;
      const b = this._linkTarget;

      if (a.edges().indexOf(b) < 0) {
        a.addEdge(b);
        b.addEdge(a);
        this._tourPreview.addEdge(a, b);
      }
    }

    this._isLinking = false;
    this._exactLink = false;
    this._linked = undefined;
    this._linkTarget = undefined;

    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
  };

  public isDragging = (): boolean => {
    return this._dragged !== null && this._dragged !== undefined;
  };

  public addPanoramas = (...panoramas: Panorama[]): void => {
    panoramas.forEach((panorama: Panorama) => {
      this._panoramas[panorama.id()] = panorama;
    });

    this._dropBay.react({ captured: this._panoramas });
  };

  public updateRotation = (rotation: number): void => {
    this._rotation = rotation;
    this._tourPreview.setRotation(this._rotation);
    Object.keys(this._panoramas).forEach(key => {
      const panorama = this._panoramas[key];
      this._tourPreview.updatePosition(panorama, panorama.floorplanPosition());
    });
  };

  public setDropBay = (dropBay: DropBay): void => {
    this._dropBay = dropBay;
  };

  public setTourPreview = (tourPreview: TourPreview): void => {
    this._tourPreview = tourPreview;
  };

  public setFloorplanviewer = (floorplanViewer: FloorplanViewer): void => {
    this._floorplanViewer = floorplanViewer;
  };

  public setToolbar = (toolbar: Toolbar): void => {
    this._toolbar = toolbar;
  };

  public setMessageBar = (messageBar: MessageBar): void => {
    this._messageBar = messageBar;
  };

  public setFloorSwitch = (floorSwitch: FloorSwitch): void => {
    this._floorSwitch = floorSwitch;
  };

  public floorplanZoom = (): number => {
    return this._floorplanViewer.zoom();
  };

  public focusPanorama = (panorama: Panorama): void => {
    this._tourPreview.react({ active: panorama });
  };

  public selectTool = (tool: string): void => {
    if (this._selectedTool === TUNE_TOOL) {
      this.stopTuning();
    }

    this._selectedTool = tool;
    this._toolbar.react({ selected: tool });
    this._floorplanViewer.react({
      selected: tool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
  };

  public handleRotation = (deltaPhi: number, deltaTheta: number): void => {
    if (this._isTuning) {
      this._tuned.applyDeltaTheta(deltaTheta);
      this._tourPreview.updateThetaOffset(
        this._tuned,
        this._tuned.thetaOffset()
      );
    }
  };

  public startTuning = (panorama: Panorama): void => {
    this._isTuning = true;
    this._tuned = panorama;

    this._tourPreview.lockPhi();
    this.focusPanorama(panorama);
    this._floorplanViewer.react({
      selected: this._selectedTool,
      captured: this.panoramasCapturedByFloorplanViewer()
    });
  };

  public stopTuning = (): void => {
    this._isTuning = false;
    this._tuned = null;
    this._tourPreview.unlockPhi();
  };

  public isTuning = (): boolean => {
    return this._isTuning;
  };

  public tuned = (): Panorama => {
    return this._tuned;
  };

  public tool = (): string => {
    return this._selectedTool;
  };
}

export default new Reactor();
