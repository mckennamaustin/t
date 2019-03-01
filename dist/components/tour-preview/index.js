import SageTour from '../../../../packages/sage-tour';
import reactor from '../../reactor';
import Component from '../../reactor/component';
const panoramaGraph = [
    {
        id: 0,
        position: [1427, 188, 525],
        edges: [],
        name: 'Great Room',
        floor: 1
    }
];
const onLoad = () => { };
const opts = {
    imagePathRoot: 'https://s3.amazonaws.com/staging.sageadmin.s3',
    disableControls: true
};
export default class TourPreview extends Component {
    constructor(root) {
        super(root, 'ev-tour-preview');
        this.react = (stimulus) => { };
        this._container = document.createElement('div');
        this._parent.appendChild(this._container);
        this._container.className = 'ev-tour-preview-container';
        this._tour = new SageTour(this._container, panoramaGraph, onLoad, opts);
        this._tour.setEnableControls(true);
        reactor.setTourPreview(this);
    }
}
//# sourceMappingURL=index.js.map