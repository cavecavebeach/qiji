import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from './Constants';

export interface PerformanceStats {
  fps: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  memoryUsed: number;
  memoryLimit: number;
  entityCount: number;
  tweenCount: number;
  timerCount: number;
}

export interface PerformanceConfig {
  enabled: boolean;
  showPanel: boolean;
  fpsWarningThreshold: number;
  sampleSize: number;
  updateInterval: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: true,
  showPanel: true,
  fpsWarningThreshold: 30,
  sampleSize: 60,
  updateInterval: 500,
};

export class PerformanceMonitor {
  private scene: Phaser.Scene;
  private config: PerformanceConfig;
  private enabled: boolean;

  private fpsHistory: number[] = [];
  private lastTime: number = 0;
  private frameCount: number = 0;
  private lastUpdateTime: number = 0;

  private stats: PerformanceStats = {
    fps: 60,
    avgFps: 60,
    minFps: 60,
    maxFps: 60,
    memoryUsed: 0,
    memoryLimit: 0,
    entityCount: 0,
    tweenCount: 0,
    timerCount: 0,
  };

  private panel: Phaser.GameObjects.Container | null = null;
  private panelTexts: Map<string, Phaser.GameObjects.Text> = new Map();
  private warningTexts: Phaser.GameObjects.Text[] = [];
  private isDev: boolean;

  constructor(scene: Phaser.Scene, config: Partial<PerformanceConfig> = {}) {
    this.scene = scene;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.enabled = this.config.enabled;
    this.isDev = this.checkDevMode();

    if (this.enabled && this.isDev && this.config.showPanel) {
      this.createPanel();
    }
  }

  private checkDevMode(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port !== '' ||
      window.location.search.includes('debug=true')
    );
  }

  private createPanel(): void {
    this.panel = this.scene.add.container(GAME_WIDTH - 10, 10);
    this.panel.setDepth(1000);
    this.panel.setScrollFactor(0);

    const bg = this.scene.add.rectangle(0, 0, 160, 130, 0x000000, 0.7);
    bg.setOrigin(1, 0);
    bg.setStrokeStyle(1, 0x50B89C, 0.5);
    this.panel.add(bg);

    const title = this.scene.add.text(-150, 8, '性能监控', {
      fontSize: '12px',
      color: '#50B89C',
      fontFamily: 'monospace',
    });
    this.panel.add(title);

    const labels = [
      { key: 'fps', label: 'FPS:', y: 28 },
      { key: 'avgFps', label: '平均FPS:', y: 44 },
      { key: 'memory', label: '内存:', y: 60 },
      { key: 'entities', label: '实体:', y: 76 },
      { key: 'tweens', label: 'Tween:', y: 92 },
      { key: 'timers', label: '定时器:', y: 108 },
    ];

    for (const item of labels) {
      const label = this.scene.add.text(-150, item.y, item.label, {
        fontSize: '11px',
        color: '#888888',
        fontFamily: 'monospace',
      });
      this.panel.add(label);

      const value = this.scene.add.text(-70, item.y, '-', {
        fontSize: '11px',
        color: '#FFFFFF',
        fontFamily: 'monospace',
      });
      this.panel.add(value);
      this.panelTexts.set(item.key, value);
    }
  }

  update(time: number, delta: number): void {
    if (!this.enabled || !this.isDev) return;

    this.frameCount++;
    const elapsed = time - this.lastTime;

    if (elapsed >= 1000) {
      this.stats.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = time;

      this.fpsHistory.push(this.stats.fps);
      if (this.fpsHistory.length > this.config.sampleSize) {
        this.fpsHistory.shift();
      }

      this.calculateFpsStats();
    }

    if (time - this.lastUpdateTime >= this.config.updateInterval) {
      this.updateMemoryStats();
      this.lastUpdateTime = time;
    }

    this.updatePanel();
    this.checkWarnings();
  }

  private calculateFpsStats(): void {
    if (this.fpsHistory.length === 0) return;

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (const fps of this.fpsHistory) {
      sum += fps;
      if (fps < min) min = fps;
      if (fps > max) max = fps;
    }

    this.stats.avgFps = Math.round(sum / this.fpsHistory.length);
    this.stats.minFps = min;
    this.stats.maxFps = max;
  }

  private updateMemoryStats(): void {
    const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (memory) {
      this.stats.memoryUsed = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      this.stats.memoryLimit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    }
  }

  setEntityCount(count: number): void {
    this.stats.entityCount = count;
  }

  setTweenCount(count: number): void {
    this.stats.tweenCount = count;
  }

  setTimerCount(count: number): void {
    this.stats.timerCount = count;
  }

  private updatePanel(): void {
    if (!this.panel) return;

    const fpsText = this.panelTexts.get('fps');
    if (fpsText) {
      fpsText.setText(`${this.stats.fps}`);
      fpsText.setColor(this.stats.fps < this.config.fpsWarningThreshold ? '#FF6B6B' : '#50B89C');
    }

    const avgFpsText = this.panelTexts.get('avgFps');
    if (avgFpsText) {
      avgFpsText.setText(`${this.stats.avgFps}`);
    }

    const memoryText = this.panelTexts.get('memory');
    if (memoryText) {
      if (this.stats.memoryUsed > 0) {
        memoryText.setText(`${this.stats.memoryUsed}MB`);
      } else {
        memoryText.setText('N/A');
      }
    }

    const entitiesText = this.panelTexts.get('entities');
    if (entitiesText) {
      entitiesText.setText(`${this.stats.entityCount}`);
    }

    const tweensText = this.panelTexts.get('tweens');
    if (tweensText) {
      tweensText.setText(`${this.stats.tweenCount}`);
    }

    const timersText = this.panelTexts.get('timers');
    if (timersText) {
      timersText.setText(`${this.stats.timerCount}`);
    }
  }

  private checkWarnings(): void {
    this.clearWarnings();

    if (this.stats.fps < this.config.fpsWarningThreshold && this.stats.fps > 0) {
      this.addWarning(`低FPS警告: ${this.stats.fps}`);
    }

    if (this.stats.memoryUsed > 0 && this.stats.memoryLimit > 0) {
      const memoryPercent = (this.stats.memoryUsed / this.stats.memoryLimit) * 100;
      if (memoryPercent > 80) {
        this.addWarning(`内存使用过高: ${memoryPercent.toFixed(1)}%`);
      }
    }
  }

  private addWarning(message: string): void {
    if (!this.panel) return;

    const warning = this.scene.add.text(-150, 125, `⚠ ${message}`, {
      fontSize: '10px',
      color: '#FF6B6B',
      fontFamily: 'monospace',
      backgroundColor: '#330000',
      padding: { x: 4, y: 2 },
    });
    this.panel.add(warning);
    this.warningTexts.push(warning);
  }

  private clearWarnings(): void {
    for (const warning of this.warningTexts) {
      warning.destroy();
    }
    this.warningTexts = [];
  }

  getStats(): PerformanceStats {
    return { ...this.stats };
  }

  isEnabled(): boolean {
    return this.enabled && this.isDev;
  }

  toggle(): void {
    if (!this.isDev) return;
    this.enabled = !this.enabled;
    if (this.panel) {
      this.panel.setVisible(this.enabled);
    }
  }

  show(): void {
    if (!this.isDev) return;
    this.enabled = true;
    if (this.panel) {
      this.panel.setVisible(true);
    }
  }

  hide(): void {
    this.enabled = false;
    if (this.panel) {
      this.panel.setVisible(false);
    }
  }

  destroy(): void {
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }
    this.panelTexts.clear();
    this.warningTexts = [];
  }

  log(message: string): void {
    if (!this.enabled || !this.isDev) return;
    console.log(`[PerformanceMonitor] ${message}`, this.stats);
  }

  logSnapshot(label: string = 'snapshot'): void {
    if (!this.enabled || !this.isDev) return;
    console.log(`[PerformanceMonitor] ${label}:`, {
      fps: this.stats.fps,
      avgFps: this.stats.avgFps,
      entities: this.stats.entityCount,
      tweens: this.stats.tweenCount,
      memory: this.stats.memoryUsed > 0 ? `${this.stats.memoryUsed}MB` : 'N/A',
    });
  }
}
