import './styles/app.scss';
import Component from './reactor/component';
export default class DesignStudio extends Component {
    private _detached;
    private floorplanViewer;
    private _dropBay;
    private _tourPreview;
    constructor(root: HTMLDivElement);
    react: (stimulus: any) => void;
}
