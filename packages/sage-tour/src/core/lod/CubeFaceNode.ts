import { CubeFace } from './CubeFace';
import CubeFaceLeaf from './CubeFaceLeaf';
import { PathFinder } from './CubeTexture';

const ordinalMap = {
  0: 0,
  1: 2,
  2: 8,
  3: 10
};

export default class CubeFaceNode extends CubeFace {
  private texture: CubeFaceLeaf;
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
    this.texture = new CubeFaceLeaf(
      baseOrdinal,
      chunkResolution,
      face,
      lod,
      pf
    );

    if (lod === 1) {
      this.children = [
        new CubeFaceLeaf(
          ordinalMap[baseOrdinal],
          chunkResolution / 2,
          face,
          lod + 1,
          pf
        ),
        new CubeFaceLeaf(
          ordinalMap[baseOrdinal] + 1,
          chunkResolution / 2,
          face,
          lod + 1,
          pf
        ),
        new CubeFaceLeaf(
          ordinalMap[baseOrdinal] + chunkDimension,
          chunkResolution / 2,
          face,
          lod + 1,
          pf
        ),
        new CubeFaceLeaf(
          ordinalMap[baseOrdinal] + chunkDimension + 1,
          chunkResolution / 2,
          face,
          lod + 1,
          pf
        )
      ];
    }
  }

  public buffer = (gl: WebGLRenderingContext): void => {
    this.texture.buffer(gl);

    this.children.forEach(child => {
      child.buffer(gl);
    });
  };

  public load = (imagePathRoot: string): Promise<any> => {
    const promises: Promise<any>[] = [this.texture.load(imagePathRoot)];
    promises.concat(
      this.children.map(child => {
        return child.load(imagePathRoot);
      })
    );

    return Promise.all(promises);
  };

  public isBufferedGPU = (): boolean => {
    return this.texture.isBufferedGPU();
  };
}
