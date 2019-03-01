import { WHEEL_MULTIPLIER, ZOOM_SPEED, PAN_SPEED, MAX_ZOOM, MIN_ZOOM, DAMPING_FACTOR } from '../../constants/studioVariables';
import reactor from '../../reactor';
import clamp from '../../utils/clamp';
import Component from '../../reactor/component';
export default class FloorplanViewer extends Component {
    constructor(root, size, floorplanSrc) {
        super(root, 'ev-fpv');
        this.initializeState = () => {
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
        this.transformRelativeToFloorplan = (relative) => {
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
        this.handleMove = (evt) => {
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
        this.handleWheel = (evt) => {
            let delta = -evt.deltaY * WHEEL_MULTIPLIER;
            this.updateState({ zoomDelta: this.state.zoomDelta + delta * ZOOM_SPEED });
        };
        this.beginDrag = (evt) => {
            evt.preventDefault();
            const { x, y } = this.state.mousePosition;
            this.updateState({ isDragging: true, panStart: { x, y } });
        };
        this.endDrag = (evt) => {
            this.updateState({ isDragging: false });
        };
        this.updateState = (state) => {
            this.state = Object.assign({}, this.state, state);
        };
        this.animate = () => {
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
            this.g.setAttribute('transform', `translate(${tx}, ${ty}) scale(${this.state.zoom}) translate(${-tx}, ${-ty}) translate(${cx - tx}, ${cy - ty})`);
            requestAnimationFrame(this.animate);
        };
        this.fetchSettings = (floorplanSrc) => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    const { naturalWidth, naturalHeight } = image;
                    const basis = Math.min(naturalWidth, naturalHeight);
                    const aspectRatio = basis / this.size;
                    const viewboxDimensions = {
                        w: naturalWidth / aspectRatio,
                        h: naturalHeight / aspectRatio
                    };
                    const center = {
                        x: this.size / 2,
                        y: this.size / 2
                    };
                    resolve({ viewboxDimensions, center });
                };
                image.src = floorplanSrc;
            });
        };
        this.react = (stimulus) => {
            const { clientX, clientY } = stimulus;
            const rx = clientX / this.state.zoom;
            const ry = clientY / this.state.zoom;
            const { x, y } = this.transformRelativeToFloorplan({ x: rx, y: ry });
            console.log(x, y);
        };
        this.size = size;
        this.floorplanSrc = floorplanSrc;
        this.initializeState();
        const container = document.createElement('div');
        this._parent.appendChild(container);
        container.className = 'ev-fpv-container';
        container.draggable = false;
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
        container.style.maxWidth = `${size}px`;
        container.style.maxHeight = `${size}px`;
        this.fetchSettings(floorplanSrc[0]).then(({ viewboxDimensions, center }) => {
            this.updateState({ viewboxDimensions, center });
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            container.appendChild(svg);
            svg.setAttributeNS('http://www.w3.org/2000/svg', 'x', '0');
            svg.setAttributeNS('http://www.w3.org/2000/svg', 'y', '0');
            svg.setAttribute('width', `${size}px`);
            svg.setAttribute('height', `${size}px`);
            svg.setAttributeNS('http://www.w3.org/2000/svg', 'viewBox', `0 0 ${viewboxDimensions.w} ${viewboxDimensions.h}`);
            svg.setAttributeNS('http://www.w3.org/2000/svg', 'preserveAspectRatio', 'xMidYMid slice');
            svg.onmousemove = this.handleMove;
            svg.onwheel = this.handleWheel;
            svg.onmousedown = this.beginDrag;
            svg.onmouseup = this.endDrag;
            svg.onmouseout = this.endDrag;
            svg.onmouseleave = this.endDrag;
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            svg.appendChild(this.g);
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            this.g.appendChild(image);
            image.id = 'sage-fp-image';
            image.setAttribute('href', `${this.floorplanSrc[0]}`);
            image.setAttribute('width', `${viewboxDimensions.w}px`);
            image.setAttribute('height', `${viewboxDimensions.h}px`);
            this.animate();
        });
        reactor.setFloorplanviewer(this);
    }
}
//# sourceMappingURL=index.js.map