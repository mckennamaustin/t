import { Dimension2, Vector2 } from '../../types/index';
import {
  WHEEL_MULTIPLIER,
  ZOOM_SPEED,
  PAN_SPEED,
  MAX_ZOOM,
  MIN_ZOOM,
  DAMPING_FACTOR
} from '../../constants/studioVariables';
import reactor from '../../reactor';
import clamp from '../../utils/clamp';
import Component from '../../reactor/component';
import Panorama from '../panorama';
import { MOUSE_TOOL, LINK_TOOL, ERASER_TOOL } from '../../constants/tools';
import { LINK, ERASER } from '../../constants/base64';
import MessageBar from './message-bar';

export default class FloorplanViewer extends Component {
  private _svg: SVGElement;
  private _image: SVGImageElement;
  private size: number;
  private floorplanGroup: SVGGElement;
  private spriteGroup: SVGGElement;
  private captured: { [id: string]: Panorama };
  private _cursorGroup: SVGGElement;
  private _mouseCursor: SVGImageElement;
  private _linkCursor: SVGImageElement;
  private _messageBar: MessageBar;

  private state: {
    zoomDelta: number;
    zoom: number;
    isDragging: boolean;
    panStart: Vector2;
    panDelta: Vector2;
    panOffset: Vector2;
    mousePosition: Vector2;
    viewboxDimensions: Dimension2;
    center: Vector2;
  };

  constructor(root: HTMLDivElement, size: number, floorplanSrc: string) {
    super(root, 'ev-fpv');
    this.size = size;

    this.initializeState();

    const container = document.createElement('div');
    this._parent.appendChild(container);
    container.className = 'ev-fpv-container';
    container.draggable = false;
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.maxWidth = `${size}px`;
    container.style.maxHeight = `${size}px`;

    this._messageBar = new MessageBar(this._parent);

    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    container.appendChild(this._svg);
    this._svg.setAttributeNS('http://www.w3.org/2000/svg', 'x', '0');
    this._svg.setAttributeNS('http://www.w3.org/2000/svg', 'y', '0');
    this._svg.setAttribute('width', `${size}px`);
    this._svg.setAttribute('height', `${size}px`);
    this._svg.setAttributeNS(
      'http://www.w3.org/2000/svg',
      'preserveAspectRatio',
      'xMidYMid slice'
    );
    this._svg.onmousemove = this.handleMove;
    this._svg.onwheel = this.handleWheel;
    this._svg.onmousedown = this.beginDrag;
    this._svg.onmouseup = this.endDrag;
    this._svg.onmouseout = this.endDrag;
    this._svg.onmouseleave = this.endDrag;
    this.floorplanGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    this.spriteGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    this._svg.appendChild(this.floorplanGroup);
    this._image = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'image'
    );
    this._image.id = 'sage-fp-image';
    this.floorplanGroup.appendChild(this._image);
    this.floorplanGroup.appendChild(this.spriteGroup);

    reactor.setFloorplanviewer(this);
    this.setFloorplanFromSrc(floorplanSrc).then(() => {
      this.animate();
    });
  }

  public setFloorplanFromSrc = (floorplanSrc: string): Promise<void> => {
    return new Promise(resolve => {
      this.fetchSettings(floorplanSrc).then(({ viewboxDimensions, center }) => {
        this.updateState({ viewboxDimensions, center });

        this._svg.setAttributeNS(
          'http://www.w3.org/2000/svg',
          'viewBox',
          `0 0 ${viewboxDimensions.w} ${viewboxDimensions.h}`
        );

        this._image.setAttribute('href', `${floorplanSrc}`);
        this._image.setAttribute('width', `${viewboxDimensions.w}px`);
        this._image.setAttribute('height', `${viewboxDimensions.h}px`);

        resolve();
      });
    });
  };

  private initializeState = (): void => {
    this.state = {
      zoomDelta: 0,
      zoom: 0,
      isDragging: false,
      panStart: { x: 0, y: 0 },
      panDelta: { x: 0, y: 0 },
      panOffset: { x: 0, y: 0 },
      mousePosition: { x: 0, y: 0 },
      viewboxDimensions: { w: 0, h: 0 },
      center: { x: 0, y: 0 }
    };
  };

  public transformRelativeToFloorplan = (relative: Vector2): Vector2 => {
    const svgImage = document.getElementById('sage-fp-image');
    let ox = 0;
    let oy = 0;
    if (svgImage) {
      const rect = svgImage.getBoundingClientRect();
      oy = rect.top;
      ox = rect.left;
    }

    return {
      x: relative.x - ox / this.state.zoom,
      y: relative.y - oy / this.state.zoom
    };
  };

  private handleMove = (evt: MouseEvent): void => {
    const { clientX, clientY } = evt;
    const rx = clientX / this.state.zoom;
    const ry = clientY / this.state.zoom;

    if (this.state.isDragging) {
      const pdx = rx - this.state.panStart.x;
      const pdy = ry - this.state.panStart.y;

      this.updateState({
        panDelta: {
          x: (pdx * PAN_SPEED) / this.state.zoom,
          y: (pdy * PAN_SPEED) / this.state.zoom
        },
        panStart: { x: rx, y: ry }
      });
    }

    this.updateState({ mousePosition: { x: rx, y: ry } });
  };

  private handleWheel = (evt: WheelEvent): void => {
    let delta = -evt.deltaY * WHEEL_MULTIPLIER;

    this.updateState({ zoomDelta: this.state.zoomDelta + delta * ZOOM_SPEED });
  };

  private beginDrag = (evt: MouseEvent): void => {
    evt.preventDefault();

    const { x, y } = this.state.mousePosition;
    this.updateState({ isDragging: true, panStart: { x, y } });
  };

  private endDrag = (evt: MouseEvent): void => {
    this.updateState({ isDragging: false });
  };

  private updateState = (state: any) => {
    this.state = Object.assign({}, this.state, state);
  };

  private animate = (): void => {
    const boundX = this.state.viewboxDimensions.w / 2;
    const boundY = this.state.viewboxDimensions.h / 2;
    const cx = this.state.center.x;
    const cy = this.state.center.y;

    const pox = clamp(this.state.panOffset.x, -boundX, boundX);
    const poy = clamp(this.state.panOffset.y, -boundY, boundY);
    const tx = cx + pox;
    const ty = cy + poy;

    this.updateState({
      zoom: clamp(this.state.zoom + this.state.zoomDelta, MIN_ZOOM, MAX_ZOOM),
      zoomDelta: this.state.zoomDelta * DAMPING_FACTOR,
      panOffset: {
        x: pox - this.state.panDelta.x,
        y: poy - this.state.panDelta.y
      },
      panDelta: { x: 0, y: 0 }
    });

    this.floorplanGroup.setAttribute(
      'transform',
      `translate(${tx}, ${ty}) scale(${
        this.state.zoom
      }) translate(${-tx}, ${-ty}) translate(${cx - tx}, ${cy - ty})`
    );

    requestAnimationFrame(this.animate);
  };

  private fetchSettings = (
    floorplanSrc: string
  ): Promise<{ viewboxDimensions: Dimension2; center: Vector2 }> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const { naturalWidth, naturalHeight } = image;
        const basis = Math.min(naturalWidth, naturalHeight);
        const aspectRatio = basis / this.size;

        const viewboxDimensions: Dimension2 = {
          w: naturalWidth / aspectRatio,
          h: naturalHeight / aspectRatio
        };

        const center: Vector2 = {
          x: this.size / 2,
          y: this.size / 2
        };

        resolve({ viewboxDimensions, center });
      };
      image.src = floorplanSrc;
    });
  };

  private addLine = (
    source: Vector2,
    destination: Vector2,
    color: string,
    onErase: () => void
  ): void => {
    const line: SVGLineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    line.setAttribute('x1', '' + source.x);
    line.setAttribute('y1', '' + source.y);
    line.setAttribute('x2', '' + destination.x);
    line.setAttribute('y2', '' + destination.y);
    line.setAttribute('style', `stroke:rgb(${color});stroke-width:2`);

    const collider: SVGLineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    collider.setAttribute('x1', '' + source.x);
    collider.setAttribute('y1', '' + source.y);
    collider.setAttribute('x2', '' + destination.x);
    collider.setAttribute('y2', '' + destination.y);
    collider.setAttribute(
      'style',
      `stroke-opacity:0;stroke:rgb(${color});stroke-width:20;pointer-events:${
        reactor.tool() === ERASER_TOOL ? 'auto' : 'none'
      }`
    );

    collider.onmousedown = onErase;

    this.spriteGroup.appendChild(line);
    this.spriteGroup.appendChild(collider);
  };

  public react = (stimulus: any): void => {
    while (this.spriteGroup.firstChild) {
      this.spriteGroup.removeChild(this.spriteGroup.firstChild);
    }

    const { captured, selected, isLinking } = stimulus;
    this.captured = captured;

    Object.keys(this.captured).forEach(key => {
      const captured = this.captured[key];
      captured.edges().forEach(panorama => {
        const linkStart = captured.floorplanPosition();
        const linkEnd = panorama.floorplanPosition();

        this.addLine(linkStart, linkEnd, '0, 255, 0', () => {
          if (selected === ERASER_TOOL) {
            reactor.removeEdge(captured, panorama);
          }
        });
      });
      if (reactor.isTuning() && reactor.tuned().id() === captured.id()) {
        const start: Vector2 = captured.floorplanPosition();

        this.addLine(
          start,
          { x: start.x, y: start.y - 1000000 },
          '0, 0, 255',
          () => {}
        );
      }
      this.spriteGroup.appendChild(this.captured[key].sprite());
    });

    if (isLinking) {
      this.addLine(
        stimulus.linkOrigin,
        stimulus.linkDestination,
        stimulus.exactLink ? '0, 255, 0' : '255, 0, 0',
        () => {}
      );
    }

    if (selected === MOUSE_TOOL) {
      this._parent.style.cursor = 'pointer';
    } else if (selected === LINK_TOOL) {
      this._parent.style.cursor = 'crosshair';
    } else if (selected === ERASER_TOOL) {
      this._parent.style.cursor = 'no-drop';
    }
  };

  public zoom = (): number => {
    return this.state.zoom;
  };
}
