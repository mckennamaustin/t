import * as Bowser from 'bowser';
const browser = Bowser.getParser(window.navigator.userAgent);
export const ZOOM_SPEED = 0.07;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3.5;
export const PAN_SPEED = 1.5;
export const DAMPING_FACTOR = 0.75;
export const WHEEL_MULTIPLIER = browser.getBrowserName() === 'Chrome' ? 0.06 : 1;
export const PANORAMA_SPRITE_RADIUS = 15;
//# sourceMappingURL=studioVariables.js.map