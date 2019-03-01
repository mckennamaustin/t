import Children from './children';
import { Vector2 } from '../types';
export default abstract class Component {
    protected _parent: HTMLDivElement;
    protected _children: Children;
    constructor(root: HTMLDivElement, className: string);
    abstract react(stimulus: any): void;
    html: () => HTMLElement;
    injectStyle: (style: any) => void;
    intersects: (point: Vector2) => boolean;
}
