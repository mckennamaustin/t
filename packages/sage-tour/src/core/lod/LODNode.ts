import CubeTexture from './CubeTexture';

export default class LODNode {
  private texture: CubeTexture;
  private resolution: number;
  private id: number;
  private baseLOD: number;
  private isLoadStarted: boolean;

  next: LODNode;

  constructor(id: number, resolution: number, baseLOD: number) {
    this.id = id;
    this.resolution = resolution;
    this.baseLOD = baseLOD;
    this.isLoadStarted = false;

    this.texture = new CubeTexture(this.resolution, this.baseLOD, this.id);
  }

  public initialize = (gl: WebGLRenderingContext): void => {
    this.texture.initialize(gl);
  };

  public load = (imagePathRoot: string): Promise<any> => {
    if (!this.isLoadStarted) {
      this.isLoadStarted = true;
      return this.texture.load(imagePathRoot);
    }
  };

  public bind = (): void => {
    this.texture.bind();
  };

  public buffer = (): void => {
    this.texture.buffer();
  };

  public isBuffered = (): boolean => {
    return this.texture.isCompletelyBuffered();
  };
}
