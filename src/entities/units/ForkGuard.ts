import { Unit } from '../base/Unit';
import { UNIT_CONFIGS } from '../../data/units';
import { Enemy } from '../base/Enemy';

export class ForkGuard extends Unit {
  private guardScanInterval: number;
  private lastGuardScan: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, UNIT_CONFIGS.forkGuard);
    this.guardScanInterval = 500;
    this.lastGuardScan = 0;
  }

  findTarget(enemies: Enemy[]) {
    const now = this.scene.time.now;
    if (now - this.lastGuardScan < this.guardScanInterval) {
      if (this.target && !this.target.isDead) return;
    }
    this.lastGuardScan = now;

    const threatTarget = this.findThreatToSpearmen(enemies);
    if (threatTarget) {
      this.target = threatTarget;
      this.state = 'attacking';
      return;
    }

    super.findTarget(enemies);
  }

  private findThreatToSpearmen(enemies: Enemy[]): Enemy | null {
    const scene = this.scene as any;
    if (!scene.units) return null;

    const spearmen = scene.units.filter((u: Unit) =>
      u.unitType === 'spearman' && !u.isDead
    );

    for (const spearman of spearmen) {
      for (const enemy of enemies) {
        if (enemy.isDead) continue;
        const distToSpearman = enemy.getDistanceTo(spearman);
        if (distToSpearman <= enemy.attackRange + 30 && enemy.target === spearman) {
          const distToMe = this.getDistanceTo(enemy);
          if (distToMe <= this.attackRange + 30) {
            return enemy;
          }
        }
      }
    }

    return null;
  }
}
