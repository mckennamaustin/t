import Component from '../../reactor/component';
import reactor from '../../reactor';

export default class Tool extends Component {
  constructor(root: HTMLDivElement, toolName: string, toolImgSrc: string) {
    super(root, 'ev-tool');

    const toolImage = document.createElement('img');
    toolImage.src = toolImgSrc;
    this._parent.appendChild(toolImage);
    this._parent.onclick = () => {
      reactor.selectTool(toolName);
    };
  }

  public select = (): void => {
    this._parent.classList.add('selected');
  };

  public deselect = (): void => {
    this._parent.classList.remove('selected');
  };

  public react = (stimulus: any): void => {};
}
