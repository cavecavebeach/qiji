import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';
import { Unit } from '../base/Unit';

export class Boss extends Enemy {
  private summonInterval: number;
  private lastSummonTime: number;
  private baseAttackSpeed: number;
  private rageStacks: number;
  private maxRageStacks: number;
  private rageRadius: number;
  private onSummon: ((x: number, y: number) => void) | null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.boss);
    this.summonInterval = 12000;
    this.lastSummonTime = 0;
    this.baseAttackSpeed = ENEMY_CONFIGS.boss.attackSpeed;
    this.rageStacks = 0;
    this.maxRageStacks = 5;
    this.rageRadius = 160;
    this.onSummon = null;
  }

  setSummonCallback(callback: (x: number, y: number) => void) {
    this.onSummon = callback;
  }

  update(time: number, delta: number, units?: Unit[], inViewport: boolean = true) {
    if (this.isDead) return;
    super.update(time, delta, units, inViewport);

    this.updateRage(units || []);
    this.checkSummon(time);
  }

  private updateRage(units: Unit[]) {
    let nearbyCount = 0;
    for (const unit of units) {
      if (unit.isDead) continue;
      const dist = this.getDistanceTo(unit);
      if (dist <= this.rageRadius) {
        nearbyCount++;
      }
    }

    this.rageStacks = Math.min(nearbyCount, this.maxRageStacks);
    const speedBonus = 1 - this.rageStacks * 0.08;
    this.attackSpeed = this.baseAttackSpeed * speedBonus;
  }

  private checkSummon(time: number) {
    if (time - this.lastSummonTime < this.summonInterval) return;
    this.lastSummonTime = time;

    if (this.onSummon) {
      this.onSummon(this.x + 40, this.y);
    }

    this.showSummonEffect();
  }

  private showSummonEffect() {
    const wave = this.scene.add.circle(this.x, this.y, 20, 0x8B2A1C, 0);
    wave.setStrokeStyle(3, 0x8B2A1C, 0.8);
    wave.setDepth(100);

    this.scene.tweens.add({
      targets: wave,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => wave.destroy(),
    });
  }

  findTarget(units: Unit[]) {
    let bestTarget: Unit | null = null;
    let bestThreat = -Infinity;

    for (const unit of units) {
      if (unit.isDead) continue;
      const dist = this.getDistanceTo(unit);
      if (dist <= this.attackRange + 30) {
        const hpRatio = unit.hp / unit.maxHp;
        const threat = unit.attackDamage * hpRatio;
        if (threat > bestThreat) {
          bestTarget = unit;
          bestThreat = threat;
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
