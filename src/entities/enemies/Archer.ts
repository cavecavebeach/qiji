import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';
import { Unit } from '../base/Unit';

export class Archer extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.archer);
  }

  findTarget(units: Unit[]) {
    let closest: Unit | null = null;
    let closestDist = Infinity;

    for (const unit of units) {
      if (unit.isDead) continue;
      const dist = this.getDistanceTo(unit);
      if (dist <= this.attackRange && dist < closestDist) {
        closest = unit;
        closestDist = dist;
      }
    }

    if (closest) {
      this.target = closest;
      this.state = 'attacking';
      this.isStopped = true;
    }
  }
}
