import { Unit } from '../base/Unit';
import { UNIT_CONFIGS } from '../../data/units';
import { Enemy } from '../base/Enemy';

export class WolfSoldier extends Unit {
  slowFactor: number;
  slowDuration: number;
  isImpassable: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, UNIT_CONFIGS.wolfSoldier);
    this.slowFactor = 0.2;
    this.slowDuration = 2000;
    this.isImpassable = true;
  }

  tryAttack(time: number) {
    if (time - this.lastAttackTime < this.attackSpeed * 1000) return;
    if (!this.target || this.target.isDead) return;
    this.lastAttackTime = time;

    const enemies = this.getEnemiesInRange();
    for (const enemy of enemies) {
      const damage = this.calculateDamage();
      enemy.takeDamage(damage);
      this.applySlow(enemy);
      this.showAttackEffect(enemy.x, enemy.y, 0x5E7C4A);
      enemy.showDamageNumber(damage);
    }
  }

  private getEnemiesInRange(): Enemy[] {
    const scene = this.scene as Phaser.Scene;
    const battleScene = scene as any;
    if (!battleScene.enemies) return [];

    return battleScene.enemies.filter((enemy: Enemy) => {
      if (enemy.isDead) return false;
      const dist = this.getDistanceTo(enemy);
      const angle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
      const angleDeg = Math.abs(angle * 180 / Math.PI);
      return dist <= this.attackRange + 20 && angleDeg <= 60;
    });
  }

  private applySlow(enemy: Enemy) {
    if (enemy.isDead) return;
    const originalSpeed = enemy.speed;
    enemy.speed = originalSpeed * (1 - this.slowFactor);

    const scene = this.scene;
    scene.time.delayedCall(this.slowDuration, () => {
      if (!enemy.isDead) {
        enemy.speed = originalSpeed;
      }
    });
  }
}
