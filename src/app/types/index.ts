import Component from '../reactor/component';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Dimension2 {
  w: number;
  h: number;
}

export type HTMLLike = HTMLElement | Component;
