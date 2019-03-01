import reifyHTMLLike from '../utils/reifyHTMLLike';
export default class Children {
    constructor(parent) {
        this.add = (children) => {
            Object.keys(children).forEach(id => {
                this._children[id] = children[id];
            });
            this.render();
        };
        this.remove = (id) => {
            delete this._children[id];
            this.render();
        };
        this.clear = () => {
            while (this._parent.firstChild) {
                this._parent.removeChild(this._parent.firstChild);
            }
        };
        this.render = () => {
            this.clear();
            this.toArray().forEach(element => {
                const html = reifyHTMLLike(element);
                this._parent.appendChild(html);
            });
        };
        this.byKey = (key) => {
            return this._children[key];
        };
        this.toArray = () => {
            return Object.keys(this._children).map((id) => this._children[id]);
        };
        this.removeAllExcept = (...keys) => {
            const deletedChildren = Object.keys(this._children).filter(key => keys.indexOf(key) < 0);
            deletedChildren.forEach(deleted => {
                this._parent.removeChild(reifyHTMLLike(this._children[deleted]));
                delete this._children[deleted];
            });
            console.log(deletedChildren);
        };
        this._children = {};
        this._parent = parent;
    }
}
//# sourceMappingURL=children.js.map