import * as THREE from 'three';

export default class ShaderProgram {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniforms: { [name: string]: WebGLUniformLocation };
  private attributes: { [name: string]: number };

  private vertexSource: string;
  private fragmentSource: string;

  constructor(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.gl = gl;
    this.uniforms = {};
    this.attributes = {};
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;

    this.createShader();
  }

  public bind = (): void => {
    this.gl.useProgram(this.program);
  };

  public registerUniform = (uniform: string): void => {
    this.uniforms[uniform] = this.gl.getUniformLocation(this.program, uniform);
  };

  public registerAttribute = (attribute: string): void => {
    this.attributes[attribute] = this.gl.getAttribLocation(
      this.program,
      attribute
    );

    //this.gl.enableVertexAttribArray(this.attributes[attribute]);
  };

  public getAttribute = (attribute: string): number => {
    return this.attributes[attribute];
  };

  public setUniformF = (name: string, value: number): void => {
    const location: WebGLUniformLocation = this.uniforms[name];
    if (location !== undefined) {
      this.gl.uniform1f(location, value);
    }
  };

  public setUniformI = (name: string, value: number): void => {
    const location: WebGLUniformLocation = this.uniforms[name];
    if (location !== undefined) {
      this.gl.uniform1i(location, value);
    }
  };

  public setUniformMat4fv = (name: string, value: THREE.Matrix4): void => {
    const location: WebGLUniformLocation = this.uniforms[name];
    if (location !== undefined) {
      this.gl.uniformMatrix4fv(location, false, value.toArray());
    }
  };

  public setUniformVec2fv = (name: string, value: THREE.Vector2): void => {
    const location: WebGLUniformLocation = this.uniforms[name];
    if (location !== undefined) {
      this.gl.uniform2fv(location, value.toArray());
    }
  };

  private createShader = (): void => {
    const gl: WebGLRenderingContext = this.gl;

    const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, this.vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert('Bad vertex shader: ' + gl.getShaderInfoLog(vertexShader));
      return;
    }

    const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, this.fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert('Bad fragment shader: ' + gl.getShaderInfoLog(fragmentShader));
      return;
    }

    const program: WebGLProgram = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert('Linker error: ' + gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
  };
}
