import FloorplanViewer from './components/floorplan-viewer/index';
import './styles/app.scss';
import DropBay from './components/drop-bay';
import TourPreview from './components/tour-preview';
import reactor from './reactor';
import getPanoramas from './services/getPanoramas';
import Component from './reactor/component';
export default class DesignStudio extends Component {
    constructor(root) {
        super(root, 'ev-design-studio');
        this.react = (stimulus) => {
            const { dragged } = stimulus;
            while (this._detached.firstChild) {
                this._detached.removeChild(this._detached.firstChild);
            }
            this._detached.appendChild(dragged.html());
        };
        reactor.initialize(this);
        this._detached = document.createElement('div');
        this._parent.appendChild(this._detached);
        this._detached.className = 'ev-detached-panoramas';
        this._detached.appendChild(document.createElement('div'));
        reactor.initialize(this);
        this.floorplanViewer = new FloorplanViewer(this._parent, 614, [
            './floorplan1.svg'
        ]);
        this._dropBay = new DropBay(this._parent);
        this._tourPreview = new TourPreview(this._parent);
        getPanoramas().then((panoramas) => {
            reactor.addPanoramas(...panoramas);
        });
    }
}
//# sourceMappingURL=index.js.map