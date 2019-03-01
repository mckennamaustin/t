import { CubeFace } from './CubeFace';
import CubeFaceLeaf from './CubeFaceLeaf';
import CubeFaceComposite from './CubeFaceNode';
import CubeFaceNodeSplitter from './CubeFaceNodeSplitter';

export type PathFinder = (ordinal: number, lod: number) => string;

export const FaceTypes: number[] = [
  WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X,
  WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y,
  WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z,
  WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
  WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
  WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z
];

export default class CubeTexture {
  private px: CubeFace;
  private py: CubeFace;
  private pz: CubeFace;
  private nx: CubeFace;
  private ny: CubeFace;
  private nz: CubeFace;

  private texture: WebGLTexture;
  private gl: WebGLRenderingContext;
  private baseLOD: number;
  private resolution: number;
  private isMipped: boolean;

  constructor(resolution: number, lod: number, id: number) {
    this.resolution = resolution;
    this.baseLOD = lod;
    this.isMipped = false;

    const pf: PathFinder = (ordinal, lod) => `${ordinal}-${lod}-${id}`;
    if (lod === 0) {
      this.px = new CubeFaceLeaf(0, 512, 'px', lod, pf);
      this.py = new CubeFaceLeaf(0, 512, 'py', lod, pf);
      this.pz = new CubeFaceLeaf(0, 512, 'pz', lod, pf);
      this.nx = new CubeFaceLeaf(0, 512, 'nx', lod, pf);
      this.ny = new CubeFaceLeaf(0, 512, 'ny', lod, pf);
      this.nz = new CubeFaceLeaf(0, 512, 'nz', lod, pf);
    } else if (lod === 1) {
      //base ordinal
      //face
      //chunk dimension (2)
      //lod
      //pathfinder
      //resolution
      this.px = new CubeFaceNodeSplitter(lod, 0, 'px', 4, 512, pf, 1024);
      this.py = new CubeFaceNodeSplitter(lod, 0, 'py', 4, 512, pf, 1024);
      this.pz = new CubeFaceNodeSplitter(lod, 0, 'pz', 4, 512, pf, 1024);
      this.nx = new CubeFaceNodeSplitter(lod, 0, 'nx', 4, 512, pf, 1024);
      this.ny = new CubeFaceNodeSplitter(lod, 0, 'ny', 4, 512, pf, 1024);
      this.nz = new CubeFaceNodeSplitter(lod, 0, 'nz', 4, 512, pf, 1024);
    }
  }

  public initialize = (gl: WebGLRenderingContext): void => {
    this.gl = gl;
    this.createTexture();
  };

  public load = (imagePathRoot: string): Promise<any> => {
    return Promise.all([
      this.px.load(imagePathRoot),
      this.py.load(imagePathRoot),
      this.pz.load(imagePathRoot),
      this.nx.load(imagePathRoot),
      this.ny.load(imagePathRoot),
      this.nz.load(imagePathRoot)
    ]);
  };

  public bind = (): void => {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
  };

  public buffer = (): void => {
    this.bind();

    if (this.isCompletelyBuffered() && !this.isMipped) {
      this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
      this.isMipped = true;
    }

    this.px.buffer(this.gl);
    this.py.buffer(this.gl);
    this.pz.buffer(this.gl);
    this.nx.buffer(this.gl);
    this.ny.buffer(this.gl);
    this.nz.buffer(this.gl);
  };

  public isCompletelyBuffered = (): boolean => {
    return (
      this.px.isBufferedGPU() &&
      this.py.isBufferedGPU() &&
      this.pz.isBufferedGPU() &&
      this.nx.isBufferedGPU() &&
      this.ny.isBufferedGPU() &&
      this.nz.isBufferedGPU()
    );
  };

  private createTexture = (): void => {
    const gl: WebGLRenderingContext = this.gl;

    this.texture = gl.createTexture();
    this.gl.activeTexture(this.gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    const rawData = new Uint8Array(this.resolution * this.resolution * 3);

    FaceTypes.forEach(face => {
      gl.texImage2D(
        face,
        0,
        gl.RGB,
        this.resolution,
        this.resolution,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        rawData
      );
    });
  };
}
