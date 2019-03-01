import Component from '../../reactor/component';
import reactor from '../../reactor';
export default class Panorama extends Component {
    constructor(id, name) {
        super(null, 'ev-panorama');
        this.setPositionFromMouse = (mouse) => {
            this._parent.style.top = `${mouse.x - 275 / 2}px`;
            this._parent.style.left = `${mouse.y - 75 / 2}px`;
        };
        this.startDrag = () => {
            this._parent.style.position = 'absolute';
            this._parent.style.transition = 'none';
            this._parent.style.zIndex = '100000';
            reactor.startDrag(this);
        };
        this.stopDrag = () => {
            this._parent.removeAttribute('style');
        };
        this.id = () => {
            return this._id;
        };
        this.key = () => {
            return this.id();
        };
        this.html = () => {
            return this._parent;
        };
        this.react = (stimulus) => { };
        this._id = id;
        this._name = name;
        this._floorplanSprite = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this._floorplanSprite.setAttribute('cx', '0px');
        this._floorplanSprite.setAttribute('cy', '50px');
        this._floorplanSprite.setAttribute('r', '15px');
        this._floorplanSprite.setAttribute('fill', '#11ffab');
        this._parent.onmousedown = this.startDrag;
        this._floorplanSprite.onmousedown = this.startDrag;
    }
}
//# sourceMappingURL=index.js.map