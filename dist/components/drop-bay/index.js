import reactor from '../../reactor';
import Component from '../../reactor/component';
export default class DropBay extends Component {
    constructor(root) {
        super(root, 'ev-drop-bay');
        this.react = (stimulus) => {
            const { captured } = stimulus;
            this._children.removeAllExcept(...Object.keys(captured));
            Object.keys(captured).forEach((capturedKey, index) => {
                const top = index * 75 + 10 + 10 * index;
                const panorama = captured[capturedKey];
                panorama.injectStyle({ top: `${top}px` });
                this._children.add({ [capturedKey]: panorama });
            });
        };
        reactor.setDropBay(this);
    }
}
//# sourceMappingURL=index.js.map