import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';

export class ArmoredEnemy extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.vineArmor);
  }

  takeDamage(amount: number, isCrit: boolean = false) {
    if (this.isDead) return;
    const actualDamage = Math.min(amount, 35);
    this.hp = Math.max(0, this.hp - actualDamage);
    this.showDamageEffect(isCrit);
    if (this.hp <= 0) {
      this.die();
    }
  }
}
