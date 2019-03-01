import { HTMLLike } from '../types';
import getSuperclassName from '../utils/getSuperclassName';
import Component from './component';
import reifyHTMLLike from '../utils/reifyHTMLLike';

export default class Children {
  private _parent: HTMLElement;
  private _children: { [id: string]: HTMLLike };
  constructor(parent: HTMLElement) {
    this._children = {};
    this._parent = parent;
  }

  public add = (children: { [id: string]: HTMLLike }): void => {
    Object.keys(children).forEach(id => {
      this._children[id] = children[id];
    });

    this.render();
  };

  public remove = (id: string): void => {
    delete this._children[id];
    this.render();
  };

  private clear = (): void => {
    while (this._parent.firstChild) {
      this._parent.removeChild(this._parent.firstChild);
    }
  };

  public render = (): void => {
    this.clear();

    this.toArray().forEach(element => {
      const html: HTMLElement = reifyHTMLLike(element);

      this._parent.appendChild(html);
    });
  };

  public byKey = (key: string): HTMLLike => {
    return this._children[key];
  };

  public toArray = (): HTMLLike[] => {
    return Object.keys(this._children).map((id: string) => this._children[id]);
  };

  public removeAllExcept = (...keys: string[]): void => {
    const deletedChildren = Object.keys(this._children).filter(
      key => keys.indexOf(key) < 0
    );

    deletedChildren.forEach(deleted => {
      this._parent.removeChild(reifyHTMLLike(this._children[deleted]));
      delete this._children[deleted];
    });
  };
}
