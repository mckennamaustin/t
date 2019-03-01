import { HTMLLike } from '../types';
export default class Children {
    private _parent;
    private _children;
    constructor(parent: HTMLElement);
    add: (children: {
        [id: string]: HTMLLike;
    }) => void;
    remove: (id: string) => void;
    private clear;
    render: () => void;
    byKey: (key: string) => HTMLLike;
    toArray: () => HTMLLike[];
    removeAllExcept: (...keys: string[]) => void;
}
