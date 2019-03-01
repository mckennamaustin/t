export abstract class CubeFace {
  constructor() {}

  public abstract load(imagePathRoot: string): Promise<any>;
  public abstract buffer(gl: WebGLRenderingContext): void;
  public abstract isBufferedGPU(): boolean;
}
