import clamp from '../../utils/clamp';

export default abstract class AnimationTrack {
  protected elapsed: number;
  protected totalTime: number;

  constructor() {
    this.totalTime = 0;
    this.elapsed = 0;
  }

  protected abstract onTick(completionPercent: number): void;
  protected abstract onFinish(): void;
  protected abstract onReset(): void;

  public setTime = (totalTime: number) => {
    this.totalTime = totalTime;
  };

  public reset = (): void => {
    this.elapsed = 0;
    this.onReset();
  };

  public tick = (dt: number): void => {
    this.elapsed += dt;

    if (this.elapsed > this.totalTime) {
      this.finish();
    } else {
      const percent = clamp(this.elapsed / this.totalTime, 0, 1);
      this.onTick(percent);
    }
  };

  private finish = (): void => {
    this.onFinish();
  };
}
