import Component from '../../reactor/component';
import { CHEVRON_UP, CHEVRON_DOWN } from '../../constants/base64';
import reactor from '../../reactor';

export default class FloorSwitch extends Component {
  private _chevronUp: HTMLImageElement;
  private _chevronDown: HTMLImageElement;
  private _floorSpan: HTMLSpanElement;
  constructor(root: HTMLDivElement) {
    super(root, 'ev-floor-switch');

    this._chevronUp = document.createElement('img');
    this._chevronUp.src = CHEVRON_UP;
    this._chevronUp.onclick = reactor.incrementFloor;
    this._chevronDown = document.createElement('img');
    this._chevronDown.src = CHEVRON_DOWN;
    this._chevronDown.onclick = reactor.decrementFloor;
    this._floorSpan = document.createElement('span');
    this._floorSpan.innerText = '1';
    this._parent.appendChild(this._chevronUp);
    this._parent.appendChild(this._floorSpan);
    this._parent.appendChild(this._chevronDown);

    reactor.setFloorSwitch(this);
  }

  public setFloor = (floor: number): void => {
    this._floorSpan.innerText = `${floor}`;
  };

  public react = (stimulus: any): void => {};
}
