import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';
import { Unit } from '../base/Unit';

export class SpearEnemy extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.longSpear);
  }

  findTarget(units: Unit[]) {
    let pierceTarget: Unit | null = null;
    let pierceDist = Infinity;

    for (const unit of units) {
      if (unit.isDead) continue;
      if (Math.abs(unit.y - this.y) > 40) continue;
      const dx = this.x - unit.x;
      if (dx > 0 && dx <= this.attackRange + 20 && dx < pierceDist) {
        pierceTarget = unit;
        pierceDist = dx;
      }
    }

    if (pierceTarget) {
      this.target = pierceTarget;
      this.state = 'attacking';
      this.isStopped = true;
      return;
    }

    super.findTarget(units);
  }

  tryAttack(time: number) {
    if (time - this.lastAttackTime < this.attackSpeed * 1000) return;
    if (!this.target || this.target.isDead) return;
    this.lastAttackTime = time;

    this.pierceAttack();
  }

  private pierceAttack() {
    const scene = this.scene as any;
    if (!scene.units) return;

    const targets = scene.units.filter((unit: Unit) => {
      if (unit.isDead) return false;
      if (Math.abs(unit.y - this.y) > 40) return false;
      const dx = this.x - unit.x;
      return dx > 0 && dx <= this.attackRange + 20;
    });

    targets.sort((a: Unit, b: Unit) => b.x - a.x);

    const hitTargets = targets.slice(0, 2);

    for (const target of hitTargets) {
      target.takeDamage(this.attackDamage);
      this.showAttackEffect(target.x, target.y, 0xC0C0C0);
      target.showDamageNumber(this.attackDamage);
    }

    if (hitTargets.length === 0 && this.target && !this.target.isDead) {
      this.target.takeDamage(this.attackDamage);
      this.showAttackEffect(this.target.x, this.target.y, 0xC0C0C0);
      this.target.showDamageNumber(this.attackDamage);
    }
  }
}
