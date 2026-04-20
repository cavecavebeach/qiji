import Phaser from 'phaser';

type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;
type PartialTweenConfig = Partial<TweenConfig>;

interface TweenPool {
  idle: Phaser.Tweens.Tween | null;
  effects: Phaser.Tweens.Tween[];
}

export class TweenManager {
  private scene: Phaser.Scene;
  private entityTweens: Map<string, TweenPool> = new Map();
  private sharedConfigs: Map<string, PartialTweenConfig> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initSharedConfigs();
  }

  private initSharedConfigs() {
    this.sharedConfigs.set('idle', {
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.sharedConfigs.set('flash', {
      alpha: 0.4,
      duration: 30,
      yoyo: true,
      repeat: 1,
    });

    this.sharedConfigs.set('shake', {
      duration: 80,
      yoyo: true,
      repeat: 2,
    });

    this.sharedConfigs.set('shakeCrit', {
      duration: 50,
      yoyo: true,
      repeat: 2,
    });

    this.sharedConfigs.set('fadeout', {
      alpha: 0,
      duration: 350,
      ease: 'Power3',
    });

    this.sharedConfigs.set('particle', {
      alpha: 0,
      duration: 400,
      ease: 'Power2',
    });
  }

  registerEntity(entityId: string): void {
    if (!this.entityTweens.has(entityId)) {
      this.entityTweens.set(entityId, {
        idle: null,
        effects: [],
      });
    }
  }

  unregisterEntity(entityId: string): void {
    const pool = this.entityTweens.get(entityId);
    if (pool) {
      if (pool.idle) {
        pool.idle.stop();
        pool.idle = null;
      }
      pool.effects.forEach(tween => {
        if (tween && tween.isPlaying()) {
          tween.stop();
        }
      });
      pool.effects.length = 0;
      this.entityTweens.delete(entityId);
    }
  }

  createIdleTween(
    entityId: string,
    targets: Phaser.GameObjects.Container,
    baseY: number,
    duration: number
  ): Phaser.Tweens.Tween | null {
    const pool = this.entityTweens.get(entityId);
    if (!pool) return null;

    if (pool.idle) {
      pool.idle.stop();
    }

    const config = this.sharedConfigs.get('idle')!;
    pool.idle = this.scene.tweens.add({
      ...config,
      targets,
      y: baseY - 2,
      duration,
    } as TweenConfig);

    return pool.idle;
  }

  createShadowTween(
    entityId: string,
    shadow: Phaser.GameObjects.Ellipse,
    duration: number
  ): Phaser.Tweens.Tween | null {
    const pool = this.entityTweens.get(entityId);
    if (!pool) return null;

    const config = this.sharedConfigs.get('idle')!;
    const tween = this.scene.tweens.add({
      ...config,
      targets: shadow,
      scaleX: 0.9,
      alpha: 0.15,
      duration,
    } as TweenConfig);

    pool.effects.push(tween);
    return tween;
  }

  createEffectTween(
    entityId: string,
    config: TweenConfig
  ): Phaser.Tweens.Tween | null {
    const pool = this.entityTweens.get(entityId);
    if (!pool) return null;

    const tween = this.scene.tweens.add(config);
    pool.effects.push(tween);

    tween.once('complete', () => {
      const idx = pool.effects.indexOf(tween);
      if (idx > -1) {
        pool.effects.splice(idx, 1);
      }
    });

    return tween;
  }

  createOneShotTween(config: TweenConfig): Phaser.Tweens.Tween {
    return this.scene.tweens.add(config);
  }

  createFlashTween(
    entityId: string,
    target: Phaser.GameObjects.Container
  ): Phaser.Tweens.Tween | null {
    const baseConfig = this.sharedConfigs.get('flash')!;
    return this.createEffectTween(entityId, {
      ...baseConfig,
      targets: target,
    } as TweenConfig);
  }

  createShakeTween(
    entityId: string,
    target: Phaser.GameObjects.Container,
    baseX: number,
    baseY: number,
    intensity: number,
    isCrit: boolean = false
  ): Phaser.Tweens.Tween | null {
    const configKey = isCrit ? 'shakeCrit' : 'shake';
    const baseConfig = this.sharedConfigs.get(configKey)!;
    const duration = isCrit ? 150 : 80;

    return this.createEffectTween(entityId, {
      ...baseConfig,
      targets: target,
      x: baseX + Phaser.Math.Between(-intensity, intensity),
      y: baseY + Phaser.Math.Between(-intensity / 2, intensity / 2),
      duration: duration / 3,
      onComplete: () => {
        target.setPosition(baseX, baseY);
      },
    } as TweenConfig);
  }

  killIdleTween(entityId: string): void {
    const pool = this.entityTweens.get(entityId);
    if (pool && pool.idle) {
      pool.idle.stop();
      pool.idle = null;
    }
  }

  killAllTweens(entityId: string): void {
    const pool = this.entityTweens.get(entityId);
    if (pool) {
      if (pool.idle) {
        pool.idle.stop();
        pool.idle = null;
      }
      pool.effects.forEach(tween => {
        if (tween && tween.isPlaying()) {
          tween.stop();
        }
      });
      pool.effects.length = 0;
    }
  }

  getActiveTweenCount(entityId: string): number {
    const pool = this.entityTweens.get(entityId);
    if (!pool) return 0;
    let count = pool.idle ? 1 : 0;
    count += pool.effects.filter(t => t && t.isPlaying()).length;
    return count;
  }

  getTotalTweenCount(): number {
    let total = 0;
    this.entityTweens.forEach((pool) => {
      if (pool.idle) total += 1;
      total += pool.effects.filter(t => t && t.isPlaying()).length;
    });
    return total;
  }

  cleanup(): void {
    this.entityTweens.forEach((_, entityId) => {
      this.unregisterEntity(entityId);
    });
  }
}
