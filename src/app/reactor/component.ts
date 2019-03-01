import Children from './children';
import { Vector2 } from '../types';

export default abstract class Component {
  protected _parent: HTMLDivElement;
  protected _children: Children;

  constructor(root: HTMLDivElement, className: string) {
    this._parent = document.createElement('div');
    this._parent.className = className;
    if (root) {
      root.appendChild(this._parent);
    }
    this._children = new Children(this._parent);
  }

  public abstract react(stimulus: any): void;

  public html = (): HTMLElement => {
    return this._parent;
  };

  public injectStyle = (style: any): void => {
    Object.assign(this._parent.style, style);
  };

  public intersects = (point: Vector2): boolean => {
    const { x, y } = point;
    const rect: DOMRect = this._parent.getBoundingClientRect() as DOMRect;

    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };
}
