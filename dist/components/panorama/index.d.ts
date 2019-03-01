import { Vector2 } from '../../types';
import Component from '../../reactor/component';
export default class Panorama extends Component {
    private _id;
    private _name;
    private _floorplanPosition;
    private _floorplanSprite;
    private _onMouseDownListener;
    constructor(id: string, name?: string);
    setPositionFromMouse: (mouse: Vector2) => void;
    startDrag: () => void;
    stopDrag: () => void;
    id: () => string;
    key: () => string;
    html: () => HTMLElement;
    react: (stimulus: any) => void;
}
