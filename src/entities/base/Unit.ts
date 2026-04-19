import { Entity } from './Entity';
import type { UnitType, UnitConfig } from '../../types';
import { Enemy } from './Enemy';
import { COLORS } from '../../utils/Constants';

const TEXTURE_MAP: Record<UnitType, string> = {
  shieldBearer: 'shield_bearer',
  spearman: 'spearman',
  wolfSoldier: 'wolf_soldier',
  forkGuard: 'fork_guard',
  firearmsUnit: 'firearms_unit',
};

export class Unit extends Entity {
  unitType: UnitType;
  cost: number;
  target: Enemy | null;
  hasProtection: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, config: UnitConfig) {
    super(scene, x, y, config.hp, config.speed, config.attackDamage, config.attackRange, config.attackSpeed, config.armorType);
    this.unitType = config.type;
    this.cost = config.cost;
    this.target = null;
    this.hasProtection = false;
    this.textureKey = TEXTURE_MAP[config.type] || '';
    this.createVisuals(config.color, config.width, config.height);
    this.state = 'moving';
  }

  update(time: number, delta: number, enemies?: Enemy[], allies?: Unit[]) {
    if (this.isDead) return;
    super.update(time, delta);

    if (enemies) this.checkProtection(allies || []);

    if (this.state === 'moving') {
      this.moveRight(delta);
      if (enemies) this.findTarget(enemies);
    } else if (this.state === 'attacking') {
      if (!this.target || this.target.isDead) {
        this.target = null;
        this.state = 'moving';
        return;
      }
      const dist = this.getDistanceTo(this.target);
      if (dist > this.attackRange + 20) {
        this.target = null;
        this.state = 'moving';
        return;
      }
      this.tryAttack(time);
    }
  }

  moveRight(delta: number) {
    const moveSpeed = this.speed * 40 * (delta / 1000);
    this.setPosition(this.x + moveSpeed, this.y);
  }

  findTarget(enemies: Enemy[]) {
    let closest: Enemy | null = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      if (enemy.x < this.x) continue;
      const dist = this.getDistanceTo(enemy);
      if (dist <= this.attackRange + 10 && dist < closestDist) {
        closest = enemy;
        closestDist = dist;
      }
    }

    if (closest) {
      this.target = closest;
      this.state = 'attacking';
    }
  }

  tryAttack(time: number) {
    if (time - this.lastAttackTime < this.attackSpeed * 1000) return;
    if (!this.target || this.target.isDead) return;
    this.lastAttackTime = time;
    const damage = this.calculateDamage();
    this.target.takeDamage(damage);
    this.showAttackEffect(this.target.x, this.target.y, this.getAttackEffectColor());
    this.target.showDamageNumber(damage, this.hasProtection && this.unitType === 'spearman');
  }

  calculateDamage(): number {
    if (this.unitType === 'spearman') {
      return this.hasProtection ? this.attackDamage : Math.floor(this.attackDamage * 0.5);
    }
    return this.attackDamage;
  }

  checkProtection(allies: Unit[]) {
    if (this.unitType !== 'spearman') return;
    this.hasProtection = false;
    for (const ally of allies) {
      if (ally === this || ally.isDead) continue;
      if (ally.unitType === 'shieldBearer' || ally.unitType === 'wolfSoldier') {
        const dx = ally.x - this.x;
        const dy = Math.abs(ally.y - this.y);
        if (dx >= -80 && dx <= 0 && dy < 50) {
          this.hasProtection = true;
          return;
        }
      }
    }
  }

  private getAttackEffectColor(): number {
    switch (this.unitType) {
      case 'shieldBearer':
        return COLORS.RATTAN_YELLOW;
      case 'spearman':
        return COLORS.VERMILION;
      case 'wolfSoldier':
        return COLORS.BAMBOO_GREEN;
      case 'forkGuard':
        return COLORS.COPPER_GREEN;
      case 'firearmsUnit':
        return 0xFFFF00;
      default:
        return 0xFFFFFF;
    }
  }
}
