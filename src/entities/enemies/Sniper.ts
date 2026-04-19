import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';
import { Unit } from '../base/Unit';

export class Sniper extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.sniper);
  }

  findTarget(units: Unit[]) {
    let bestTarget: Unit | null = null;
    let bestX = -Infinity;

    for (const unit of units) {
      if (unit.isDead) continue;
      const dist = this.getDistanceTo(unit);
      if (dist <= this.attackRange + 20) {
        if (unit.x > bestX) {
          bestTarget = unit;
          bestX = unit.x;
        }
      }
    }

    if (bestTarget) {
      this.target = bestTarget;
      this.state = 'attacking';
      this.isStopped = true;
    }
  }
}
