import Children from './children';
export default class Component {
    constructor(root, className) {
        this.html = () => {
            return this._parent;
        };
        this.injectStyle = (style) => {
            Object.assign(this._parent.style, style);
        };
        this.intersects = (point) => {
            const { x, y } = point;
            const rect = this._parent.getBoundingClientRect();
            return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
        };
        this._parent = document.createElement('div');
        this._parent.className = className;
        if (root) {
            root.appendChild(this._parent);
        }
        this._children = new Children(this._parent);
    }
}
//# sourceMappingURL=component.js.map