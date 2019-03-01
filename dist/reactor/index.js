class Reactor {
    constructor() {
        this.initialize = (root) => {
            this._root = root;
            this._root.html().onmousemove = this.handleMouseMove;
        };
        this.startDrag = (dragged) => {
            this._dragged = dragged;
            const dropbayCaptured = Object.keys(this._panoramas)
                .filter(key => this._panoramas[key].id() !== dragged.id())
                .map(key => this._panoramas[key]);
            this._dropBay.react({ captured: dropbayCaptured });
            this._root.react({ dragged });
        };
        this.handleMouseMove = (evt) => {
            const { clientX, clientY } = evt;
            const mousePoint = { x: clientX, y: clientY };
            if (this.isDragging()) {
                this._dragged.setPositionFromMouse(mousePoint);
            }
        };
        this.isDragging = () => {
            return this._dragged !== null && this._dragged !== undefined;
        };
        this.addPanoramas = (...panoramas) => {
            panoramas.forEach((panorama) => {
                this._panoramas[panorama.id()] = panorama;
            });
            this._dropBay.react({ captured: this._panoramas });
        };
        this.setDropBay = (dropBay) => {
            this._dropBay = dropBay;
        };
        this.setTourPreview = (tourPreview) => {
            this._tourPreview = tourPreview;
        };
        this.setFloorplanviewer = (floorplanViewer) => {
            this._floorplanViewer = floorplanViewer;
        };
        this._panoramas = {};
    }
}
export default new Reactor();
//# sourceMappingURL=index.js.map