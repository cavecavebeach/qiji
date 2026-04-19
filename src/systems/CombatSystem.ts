import { Unit } from '../entities/base/Unit';
import { Enemy } from '../entities/base/Enemy';
import { ShieldBearer } from '../entities/units/ShieldBearer';
import { WolfSoldier } from '../entities/units/WolfSoldier';
import { FirearmsUnit } from '../entities/units/FirearmsUnit';

export class CombatSystem {
  private scene: Phaser.Scene;
  private units: Unit[];
  private enemies: Enemy[];

  constructor(scene: Phaser.Scene, units: Unit[], enemies: Enemy[]) {
    this.scene = scene;
    this.units = units;
    this.enemies = enemies;
  }

  update(time: number, delta: number) {
    for (const unit of this.units) {
      unit.update(time, delta, this.enemies, this.units);
    }

    for (const enemy of this.enemies) {
      enemy.update(time, delta, this.units);
    }

    this.checkShieldBlock();
    this.checkWolfImpassable();
    this.checkFirearmsInterrupt();
  }

  private checkShieldBlock() {
    for (const unit of this.units) {
      if (unit.isDead || unit.unitType !== 'shieldBearer') continue;
      const shield = unit as ShieldBearer;
      shield.blockCount = 0;
      for (const enemy of this.enemies) {
        if (enemy.isDead) continue;
        const dist = unit.getDistanceTo(enemy);
        if (dist < 50) {
          if (shield.blockCount >= 3) {
            continue;
          }
          shield.blockCount++;
          enemy.isStopped = true;
        }
      }
    }
  }

  private checkWolfImpassable() {
    for (const unit of this.units) {
      if (unit.isDead || unit.unitType !== 'wolfSoldier') continue;
      const wolf = unit as WolfSoldier;
      if (!wolf.isImpassable) continue;

      for (const enemy of this.enemies) {
        if (enemy.isDead) continue;
        const dist = unit.getDistanceTo(enemy);
        if (dist < 45) {
          enemy.isStopped = true;
        }
      }
    }
  }

  private checkFirearmsInterrupt() {
    for (const unit of this.units) {
      if (unit.isDead || unit.unitType !== 'firearmsUnit') continue;
    }
  }

  removeDeadEntities() {
    for (let i = this.units.length - 1; i >= 0; i--) {
      if (this.units[i].isDead) {
        this.units.splice(i, 1);
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isDead) {
        this.enemies.splice(i, 1);
      }
    }
  }
}
