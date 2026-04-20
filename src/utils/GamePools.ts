import Phaser from 'phaser';
import { ObjectPool, Poolable } from './ObjectPool';

export class PoolableParticle implements Poolable {
  private gameObject: Phaser.GameObjects.Arc | null = null;
  private _active: boolean = false;
  private scene: Phaser.Scene | null = null;

  init(scene: Phaser.Scene): void {
    this.scene = scene;
    this.gameObject = scene.add.circle(0, 0, 1, 0xffffff, 1);
    this.gameObject.setActive(false);
    this.gameObject.setVisible(false);
  }

  getGameObject(): Phaser.GameObjects.Arc | null {
    return this.gameObject;
  }

  setup(x: number, y: number, radius: number, color: number, alpha: number = 1): void {
    if (!this.gameObject) return;
    this.gameObject.setPosition(x, y);
    this.gameObject.setRadius(radius);
    this.gameObject.setFillStyle(color, alpha);
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(alpha);
    this.gameObject.setVisible(true);
    this.gameObject.setActive(true);
  }

  setDepth(depth: number): void {
    this.gameObject?.setDepth(depth);
  }

  setStrokeStyle(lineWidth: number, color: number, alpha: number = 1): void {
    this.gameObject?.setStrokeStyle(lineWidth, color, alpha);
  }

  reset(): void {
    if (!this.gameObject) return;
    this.gameObject.setPosition(0, 0);
    this.gameObject.setRadius(1);
    this.gameObject.setFillStyle(0xffffff, 1);
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(false);
    this.gameObject.setActive(false);
    this.gameObject.setStrokeStyle();
    this.gameObject.setDepth(0);
  }

  setActive(active: boolean): void {
    this._active = active;
    this.gameObject?.setActive(active);
    this.gameObject?.setVisible(active);
  }

  get active(): boolean {
    return this._active;
  }

  destroy(): void {
    this.gameObject?.destroy();
    this.gameObject = null;
  }
}

export class ParticlePool extends ObjectPool<PoolableParticle> {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, initialSize: number = 50) {
    const createParticle = (): PoolableParticle => {
      const particle = new PoolableParticle();
      particle.init(scene);
      return particle;
    };

    const resetParticle = (particle: PoolableParticle): void => {
      particle.reset();
    };

    super({
      create: createParticle,
      reset: resetParticle,
      initialSize,
      maxSize: 500,
    });

    this.scene = scene;
  }

  acquireParticle(x: number, y: number, radius: number, color: number, alpha: number = 1): PoolableParticle {
    const particle = this.acquire();
    particle.setup(x, y, radius, color, alpha);
    return particle;
  }

  releaseParticle(particle: PoolableParticle): void {
    this.release(particle);
  }
}

export class PoolableText implements Poolable {
  private gameObject: Phaser.GameObjects.Text | null = null;
  private _active: boolean = false;

  init(scene: Phaser.Scene): void {
    this.gameObject = scene.add.text(0, 0, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'serif',
    });
    this.gameObject.setOrigin(0.5);
    this.gameObject.setActive(false);
    this.gameObject.setVisible(false);
  }

  getGameObject(): Phaser.GameObjects.Text | null {
    return this.gameObject;
  }

  setup(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): void {
    if (!this.gameObject) return;
    this.gameObject.setPosition(x, y);
    this.gameObject.setText(text);
    this.gameObject.setStyle(style);
    this.gameObject.setOrigin(0.5);
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(true);
    this.gameObject.setActive(true);
  }

  setDepth(depth: number): void {
    this.gameObject?.setDepth(depth);
  }

  reset(): void {
    if (!this.gameObject) return;
    this.gameObject.setPosition(0, 0);
    this.gameObject.setText('');
    this.gameObject.setStyle({
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'serif',
    });
    this.gameObject.setOrigin(0.5);
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(false);
    this.gameObject.setActive(false);
    this.gameObject.setDepth(0);
  }

  setActive(active: boolean): void {
    this._active = active;
    this.gameObject?.setActive(active);
    this.gameObject?.setVisible(active);
  }

  get active(): boolean {
    return this._active;
  }

  destroy(): void {
    this.gameObject?.destroy();
    this.gameObject = null;
  }
}

export class TextPool extends ObjectPool<PoolableText> {
  constructor(scene: Phaser.Scene, initialSize: number = 20) {
    const createText = (): PoolableText => {
      const text = new PoolableText();
      text.init(scene);
      return text;
    };

    const resetText = (text: PoolableText): void => {
      text.reset();
    };

    super({
      create: createText,
      reset: resetText,
      initialSize,
      maxSize: 100,
    });
  }

  acquireText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): PoolableText {
    const textObj = this.acquire();
    textObj.setup(x, y, text, style);
    return textObj;
  }

  releaseText(text: PoolableText): void {
    this.release(text);
  }
}

export class PoolableEffect implements Poolable {
  private gameObject: Phaser.GameObjects.Graphics | null = null;
  private _active: boolean = false;
  private _type: 'ring' | 'slash' | 'shockwave' = 'ring';

  init(scene: Phaser.Scene): void {
    this.gameObject = scene.add.graphics();
    this.gameObject.setActive(false);
    this.gameObject.setVisible(false);
  }

  getGameObject(): Phaser.GameObjects.Graphics | null {
    return this.gameObject;
  }

  setupRing(x: number, y: number, radius: number, fillColor: number = 0xffffff, fillAlpha: number = 0, strokeColor: number = 0xffffff, strokeAlpha: number = 0.8, strokeWidth: number = 3): void {
    if (!this.gameObject) return;
    this._type = 'ring';
    this.gameObject.clear();
    this.gameObject.setPosition(x, y);
    
    if (fillAlpha > 0) {
      this.gameObject.fillStyle(fillColor, fillAlpha);
      this.gameObject.fillCircle(0, 0, radius);
    }
    
    if (strokeAlpha > 0) {
      this.gameObject.lineStyle(strokeWidth, strokeColor, strokeAlpha);
      this.gameObject.strokeCircle(0, 0, radius);
    }
    
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(true);
    this.gameObject.setActive(true);
  }

  setupSlash(x: number, y: number, angle: number, length: number, width: number, color: number, alpha: number = 0.9): void {
    if (!this.gameObject) return;
    this._type = 'slash';
    this.gameObject.clear();
    this.gameObject.setPosition(0, 0);
    
    this.gameObject.lineStyle(width, color, alpha);
    this.gameObject.beginPath();
    this.gameObject.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
    this.gameObject.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.gameObject.strokePath();
    
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(true);
    this.gameObject.setActive(true);
  }

  setupShockwave(x: number, y: number, radius: number, strokeColor: number, strokeAlpha: number = 0.9, strokeWidth: number = 4): void {
    if (!this.gameObject) return;
    this._type = 'shockwave';
    this.gameObject.clear();
    this.gameObject.setPosition(x, y);
    
    this.gameObject.lineStyle(strokeWidth, strokeColor, strokeAlpha);
    this.gameObject.strokeCircle(0, 0, radius);
    
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(true);
    this.gameObject.setActive(true);
  }

  setDepth(depth: number): void {
    this.gameObject?.setDepth(depth);
  }

  reset(): void {
    if (!this.gameObject) return;
    this.gameObject.clear();
    this.gameObject.setPosition(0, 0);
    this.gameObject.setScale(1, 1);
    this.gameObject.setAlpha(1);
    this.gameObject.setVisible(false);
    this.gameObject.setActive(false);
    this.gameObject.setDepth(0);
    this._type = 'ring';
  }

  setActive(active: boolean): void {
    this._active = active;
    this.gameObject?.setActive(active);
    this.gameObject?.setVisible(active);
  }

  get active(): boolean {
    return this._active;
  }

  get type(): string {
    return this._type;
  }

  destroy(): void {
    this.gameObject?.destroy();
    this.gameObject = null;
  }
}

export class EffectPool extends ObjectPool<PoolableEffect> {
  constructor(scene: Phaser.Scene, initialSize: number = 30) {
    const createEffect = (): PoolableEffect => {
      const effect = new PoolableEffect();
      effect.init(scene);
      return effect;
    };

    const resetEffect = (effect: PoolableEffect): void => {
      effect.reset();
    };

    super({
      create: createEffect,
      reset: resetEffect,
      initialSize,
      maxSize: 200,
    });
  }

  acquireRing(x: number, y: number, radius: number, fillColor?: number, fillAlpha?: number, strokeColor?: number, strokeAlpha?: number, strokeWidth?: number): PoolableEffect {
    const effect = this.acquire();
    effect.setupRing(x, y, radius, fillColor, fillAlpha, strokeColor, strokeAlpha, strokeWidth);
    return effect;
  }

  acquireSlash(x: number, y: number, angle: number, length: number, width: number, color: number, alpha?: number): PoolableEffect {
    const effect = this.acquire();
    effect.setupSlash(x, y, angle, length, width, color, alpha);
    return effect;
  }

  acquireShockwave(x: number, y: number, radius: number, strokeColor: number, strokeAlpha?: number, strokeWidth?: number): PoolableEffect {
    const effect = this.acquire();
    effect.setupShockwave(x, y, radius, strokeColor, strokeAlpha, strokeWidth);
    return effect;
  }

  releaseEffect(effect: PoolableEffect): void {
    this.release(effect);
  }
}

export class ObjectPoolManager {
  private particlePool: ParticlePool;
  private textPool: TextPool;
  private effectPool: EffectPool;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particlePool = new ParticlePool(scene, 50);
    this.textPool = new TextPool(scene, 20);
    this.effectPool = new EffectPool(scene, 30);
  }

  getParticlePool(): ParticlePool {
    return this.particlePool;
  }

  getTextPool(): TextPool {
    return this.textPool;
  }

  getEffectPool(): EffectPool {
    return this.effectPool;
  }

  releaseAll(): void {
    this.particlePool.releaseAll();
    this.textPool.releaseAll();
    this.effectPool.releaseAll();
  }

  getStats(): { particles: { pooled: number; active: number }; texts: { pooled: number; active: number }; effects: { pooled: number; active: number } } {
    return {
      particles: this.particlePool.getStats(),
      texts: this.textPool.getStats(),
      effects: this.effectPool.getStats(),
    };
  }

  destroy(): void {
    this.particlePool.forEachActive(p => p.destroy());
    this.textPool.forEachActive(t => t.destroy());
    this.effectPool.forEachActive(e => e.destroy());
    this.particlePool.clear();
    this.textPool.clear();
    this.effectPool.clear();
  }
}
