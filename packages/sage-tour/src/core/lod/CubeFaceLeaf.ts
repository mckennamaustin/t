import { CubeFace } from './CubeFace';
import { PathFinder } from './CubeTexture';

interface ImageChunk {
  image: HTMLImageElement;
  isLoaded: boolean;
}

const FaceLUT = {
  px: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X,
  py: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y,
  pz: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z,
  nx: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
  ny: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
  nz: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z
};

export default class CubeFaceLeaf extends CubeFace {
  private image: ImageChunk;
  private ordinal: number;
  private pathFinder: PathFinder;
  private face: string;
  private chunkResolution: number;
  private size: number;
  private lod: number;
  private isBuffered: boolean;

  constructor(
    ordinal: number,
    chunkResolution: number,
    face: string,
    lod: number,
    pathFinder: PathFinder
  ) {
    super();
    this.image = {
      image: new Image(),
      isLoaded: false
    };
    this.pathFinder = ordinal => `${pathFinder(ordinal, lod)}-${face}.jpg`;
    this.ordinal = ordinal;
    this.face = face;
    this.chunkResolution = chunkResolution;
    this.size = Math.pow(2, lod);
    this.lod = lod;
    this.isBuffered = false;
  }

  public load = (imagePathRoot: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.image.image.onload = () => {
        this.image.isLoaded = true;
        resolve();
      };

      this.image.image.onerror = () => {
        reject();
      };

      this.image.image.crossOrigin = 'anonymous';
      this.image.image.src = `${imagePathRoot}/${this.pathFinder(
        this.ordinal,
        this.lod
      )}`;
    });
  };

  public buffer = (gl: WebGLRenderingContext): void => {
    if (!this.isBuffered && this.image.isLoaded) {
      const y = Math.floor(this.ordinal / this.size);
      const x = this.ordinal - y * this.size;
      const w = x * this.chunkResolution;
      const h = y * this.chunkResolution;

      gl.texSubImage2D(
        FaceLUT[this.face],
        0,
        w,
        h,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        this.image.image
      );

      this.isBuffered = true;
    }
  };

  public isBufferedGPU = (): boolean => {
    return this.isBuffered;
  };
}
