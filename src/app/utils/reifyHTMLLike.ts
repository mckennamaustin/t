import { HTMLLike } from '../types';
import getSuperclassName from './getSuperclassName';
import Component from '../reactor/component';

export default function(element: HTMLLike): HTMLElement {
  let html: HTMLElement = undefined;
  if (getSuperclassName(element) === 'Component') {
    html = (element as Component).html();
  } else {
    html = element as HTMLElement;
  }

  return html;
}
