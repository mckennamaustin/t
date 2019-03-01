import Component from '../../reactor/component';
export default class FloorplanViewer extends Component {
    private size;
    private floorplanSrc;
    private g;
    private state;
    constructor(root: HTMLDivElement, size: number, floorplanSrc: string[]);
    private initializeState;
    private transformRelativeToFloorplan;
    private handleMove;
    private handleWheel;
    private beginDrag;
    private endDrag;
    private updateState;
    private animate;
    private fetchSettings;
    react: (stimulus: any) => void;
}
