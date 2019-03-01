import Component from '../../reactor/component';
import reactor from '../../reactor';

export default class MessageBar extends Component {
  private _text: HTMLSpanElement;

  constructor(root: HTMLDivElement) {
    super(root, 'ev-message-bar');
    this._text = document.createElement('span');
    this._parent.appendChild(this._text);

    reactor.setMessageBar(this);
  }

  public react = (stimulus: any): void => {
    const { text } = stimulus;

    this._text.innerText = text;
  };
}
