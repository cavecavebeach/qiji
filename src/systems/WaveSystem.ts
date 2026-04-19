import type { WaveConfig, EnemyType, LaneConfig } from '../types';
import { SPAWN_X } from '../utils/Constants';

export interface WaveState {
  currentWave: number;
  totalWaves: number;
  isComplete: boolean;
  allWavesSpawned: boolean;
}

export class WaveSystem {
  private waves: WaveConfig[];
  private currentWave: number;
  private scene: Phaser.Scene;
  private spawnCallback: ((type: EnemyType, x: number, y: number) => void) | null;
  private waveActive: boolean;
  private onWaveChange: ((state: WaveState) => void) | null;
  private onWaveComplete: ((waveNumber: number) => void) | null;
  private spawnTimers: Phaser.Time.TimerEvent[];
  private pendingEnemies: number;
  private lanes: LaneConfig[];

  constructor(scene: Phaser.Scene, waves: WaveConfig[], lanes: LaneConfig[], onWaveChange?: (state: WaveState) => void) {
    this.scene = scene;
    this.waves = waves;
    this.lanes = lanes;
    this.currentWave = 0;
    this.spawnCallback = null;
    this.waveActive = false;
    this.onWaveChange = onWaveChange || null;
    this.onWaveComplete = null;
    this.spawnTimers = [];
    this.pendingEnemies = 0;
  }

  setSpawnCallback(callback: (type: EnemyType, x: number, y: number) => void) {
    this.spawnCallback = callback;
  }

  setOnWaveComplete(callback: (waveNumber: number) => void) {
    this.onWaveComplete = callback;
  }

  startNextWave() {
    if (this.currentWave >= this.waves.length) return;
    this.waveActive = true;
    const wave = this.waves[this.currentWave];

    for (const group of wave.enemies) {
      const lane = this.resolveLane(group.lane);
      for (let i = 0; i < group.count; i++) {
        this.pendingEnemies++;
        const delay = group.delay * (i + 1) + this.currentWave * 5000;
        const timer = this.scene.time.delayedCall(delay, () => {
          if (this.spawnCallback) {
            const y = lane.spawnYMin + Math.random() * (lane.spawnYMax - lane.spawnYMin);
            this.spawnCallback(group.type, SPAWN_X, y);
          }
          this.pendingEnemies--;
        });
        this.spawnTimers.push(timer);
      }
    }

    this.currentWave++;
    this.notifyChange();
  }

  private resolveLane(laneId?: 'top' | 'bottom'): LaneConfig {
    if (laneId) {
      const found = this.lanes.find(l => l.id === laneId);
      if (found) return found;
    }
    if (this.lanes.length === 1) return this.lanes[0];
    return this.lanes[Math.floor(Math.random() * this.lanes.length)];
  }

  checkWaveComplete(aliveEnemyCount: number): boolean {
    if (!this.waveActive) return false;
    const allSpawned = this.currentWave >= this.waves.length;
    if (allSpawned && aliveEnemyCount === 0 && this.pendingEnemies === 0) {
      this.waveActive = false;
      return true;
    }
    if (!allSpawned && aliveEnemyCount === 0 && this.pendingEnemies === 0) {
      this.waveActive = false;
      if (this.onWaveComplete) {
        this.onWaveComplete(this.currentWave + 1);
      }
    }
    return false;
  }

  getState(): WaveState {
    return {
      currentWave: this.currentWave,
      totalWaves: this.waves.length,
      isComplete: this.currentWave >= this.waves.length,
      allWavesSpawned: this.currentWave >= this.waves.length,
    };
  }

  destroy() {
    for (const timer of this.spawnTimers) {
      timer.remove();
    }
    this.spawnTimers = [];
  }

  private notifyChange() {
    if (this.onWaveChange) {
      this.onWaveChange(this.getState());
    }
  }
}
