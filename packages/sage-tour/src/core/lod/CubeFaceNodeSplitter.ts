import { CubeFace } from './CubeFace';
import { PathFinder } from './CubeTexture';
import CubeFaceNode from './CubeFaceNode';

export default class CubeFaceNodeSplitter extends CubeFace {
  private children: CubeFace[];

  constructor(
    lod: number,
    baseOrdinal: number,
    face: string,
    chunkDimension: number,
    chunkResolution: number,
    pf: PathFinder,
    resolution: number
  ) {
    super();
    this.children = [
      new CubeFaceNode(
        lod,
        0,
        face,
        chunkDimension,
        chunkResolution,
        pf,
        resolution
      ),
      new CubeFaceNode(
        lod,
        1,
        face,
        chunkDimension,
        chunkResolution,
        pf,
        resolution
      ),
      new CubeFaceNode(
        lod,
        2,
        face,
        chunkDimension,
        chunkResolution,
        pf,
        resolution
      ),
      new CubeFaceNode(
        lod,
        3,
        face,
        chunkDimension,
        chunkResolution,
        pf,
        resolution
      )
    ];
  }

  public buffer = (gl: WebGLRenderingContext): void => {
    this.children.forEach(child => {
      child.buffer(gl);
    });
  };

  public load = (imagePathRoot: string): Promise<any> => {
    return Promise.all(
      this.children.map(child => {
        return child.load(imagePathRoot);
      })
    );
  };

  public isBufferedGPU = (): boolean => {
    let buffered: boolean = true;
    this.children.forEach(child => {
      if (!child.isBufferedGPU()) {
        buffered = false;
      }
    });

    return buffered;
  };
}
