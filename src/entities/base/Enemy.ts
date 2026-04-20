import { Entity } from './Entity';
import type { EnemyType, EnemyConfig } from '../../types';
import { Unit } from './Unit';
import { FLAG_X, COLORS } from '../../utils/Constants';

const TEXTURE_MAP: Record<EnemyType, string> = {
  ronin: 'ronin',
  archer: 'archer',
  longSpear: 'long_spear',
  vineArmor: 'vine_armor',
  sniper: 'sniper',
  boss: 'boss',
};

export class Enemy extends Entity {
  enemyType: EnemyType;
  reward: number;
  target: Unit | null;
  isStopped: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, config: EnemyConfig) {
    super(scene, x, y, config.hp, config.speed, config.attackDamage, config.attackRange, config.attackSpeed, config.armorType);
    this.enemyType = config.type;
    this.reward = config.reward;
    this.target = null;
    this.isStopped = false;
    this.textureKey = TEXTURE_MAP[config.type] || '';
    this.createVisuals(config.color, config.width, config.height);
    this.state = 'moving';
  }

  update(time: number, delta: number, units?: Unit[], inViewport: boolean = true) {
    if (this.isDead) return;
    super.update(time, delta);

    this.updateVisuals(inViewport);

    if (this.state === 'moving') {
      this.moveLeft(delta);
      if (units) this.findTarget(units);
    } else if (this.state === 'attacking') {
      if (!this.target || this.target.isDead) {
        this.target = null;
        this.state = 'moving';
        this.isStopped = false;
        return;
      }
      const dist = this.getDistanceTo(this.target);
      if (dist > this.attackRange + 30) {
        this.target = null;
        this.state = 'moving';
        this.isStopped = false;
        return;
      }
      this.tryAttack(time);
    }
  }

  moveLeft(delta: number) {
    if (this.isStopped) return;
    const moveSpeed = this.speed * 40 * (delta / 1000);
    this.setPosition(this.x - moveSpeed, this.y);
  }

  findTarget(units: Unit[]) {
    let closest: Unit | null = null;
    let closestDist = Infinity;

    for (const unit of units) {
      if (unit.isDead) continue;
      const dist = this.getDistanceTo(unit);
      if (dist <= this.attackRange + 20 && dist < closestDist) {
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

  tryAttack(time: number) {
    if (time - this.lastAttackTime < this.attackSpeed * 1000) return;
    if (!this.target || this.target.isDead) return;
    this.lastAttackTime = time;

    if (this.enemyType === 'archer' || this.enemyType === 'sniper') {
      this.shootArrow(this.target);
    } else {
      this.target.takeDamage(this.attackDamage);
      this.showAttackEffect(this.target.x, this.target.y, this.getAttackEffectColor());
      this.target.showDamageNumber(this.attackDamage);
    }
  }

  shootArrow(target: Unit) {
    if (!this.sprite) return;

    const arrow = this.scene.add.sprite(this.x, this.y, 'arrow');
    arrow.setRotation(Math.atan2(target.y - this.y, target.x - this.x));
    arrow.setDepth(150);

    this.scene.tweens.add({
      targets: arrow,
      x: target.x,
      y: target.y,
      duration: 300,
      ease: 'Linear',
      onComplete: () => {
        if (!target.isDead) {
          target.takeDamage(this.attackDamage);
          target.showDamageNumber(this.attackDamage);
        }
        arrow.destroy();
      },
    });
  }

  private getAttackEffectColor(): number {
    switch (this.enemyType) {
      case 'ronin':
        return 0xC0C0C0;
      case 'longSpear':
        return COLORS.METAL_SILVER;
      case 'vineArmor':
        return 0x9B8A4A;
      case 'boss':
        return COLORS.VERMILION;
      default:
        return 0xFF4444;
    }
  }

  hasReachedFlag(): boolean {
    return this.x <= FLAG_X + 30;
  }
}
