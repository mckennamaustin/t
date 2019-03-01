import Component from '../../reactor/component';
import { ROTATE } from '../../constants/base64';
import reactor from '../../reactor';

export default class RotationInput extends Component {
  private _rotationIcon: HTMLImageElement;
  private _input: HTMLInputElement;
  private _value: string;

  constructor(parent: HTMLDivElement) {
    super(parent, 'ev-rotation-input');

    this._value = '0';

    this._rotationIcon = document.createElement('img');
    this._parent.appendChild(this._rotationIcon);
    this._rotationIcon.src = ROTATE;

    this._input = document.createElement('input');
    this._parent.appendChild(this._input);
    this._input.oninput = this.handleInput;
    this._input.value = this._value;
    this._input.maxLength = 8;
  }

  private handleInput = (evt): void => {
    this._value = evt.target.value;
    this._value = this._value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
    this._input.value = this._value;
    reactor.updateRotation(parseInt(this._value));
  };

  public react = (stimulus: any): void => {};
}
