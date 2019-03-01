import reactor from '../../reactor';
import Component from '../../reactor/component';
import Panorama from '../panorama';
import reifyHTMLLike from '../../utils/reifyHTMLLike';

export default class DropBay extends Component {
  constructor(root: HTMLDivElement) {
    super(root, 'ev-drop-bay');

    reactor.setDropBay(this);
  }

  public react = (stimulus: any): void => {
    const { captured } = stimulus;

    this._children.removeAllExcept(...Object.keys(captured));

    Object.keys(captured).forEach((capturedKey, index) => {
      const top = index * 75 + 10 + 10 * index;
      const panorama = captured[capturedKey];

      panorama.injectStyle({ top: `${top}px` });

      if (!this._children.byKey(capturedKey)) {
        this._children.add({ [capturedKey]: panorama });
      }
    });
  };
}
