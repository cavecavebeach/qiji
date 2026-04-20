import { Unit } from '../entities/base/Unit';
import { Enemy } from '../entities/base/Enemy';
import { ShieldBearer } from '../entities/units/ShieldBearer';
import { WolfSoldier } from '../entities/units/WolfSoldier';
import { FirearmsUnit } from '../entities/units/FirearmsUnit';
import { SpatialGrid } from '../utils/SpatialGrid';
import { BATTLEFIELD_LEFT, BATTLEFIELD_RIGHT, BATTLEFIELD_TOP, BATTLEFIELD_BOTTOM } from '../utils/Constants';

const VIEWPORT_MARGIN = 50;

export class CombatSystem {
  private scene: Phaser.Scene;
  private units: Unit[];
  private enemies: Enemy[];
  private enemyGrid: SpatialGrid<Enemy>;
  private unitGrid: SpatialGrid<Unit>;
  private viewportBounds: { left: number; right: number; top: number; bottom: number };

  constructor(scene: Phaser.Scene, units: Unit[], enemies: Enemy[]) {
    this.scene = scene;
    this.units = units;
    this.enemies = enemies;
    this.enemyGrid = new SpatialGrid<Enemy>(50);
    this.unitGrid = new SpatialGrid<Unit>(50);
    this.viewportBounds = {
      left: BATTLEFIELD_LEFT - VIEWPORT_MARGIN,
      right: BATTLEFIELD_RIGHT + VIEWPORT_MARGIN,
      top: BATTLEFIELD_TOP - VIEWPORT_MARGIN,
      bottom: BATTLEFIELD_BOTTOM + VIEWPORT_MARGIN,
    };
  }

  private isInViewport(x: number, y: number): boolean {
    return x >= this.viewportBounds.left && 
           x <= this.viewportBounds.right && 
           y >= this.viewportBounds.top && 
           y <= this.viewportBounds.bottom;
  }

  update(time: number, delta: number) {
    for (const unit of this.units) {
      if (unit.isDead) continue;
      const inViewport = this.isInViewport(unit.x, unit.y);
      unit.update(time, delta, this.enemies, this.units, inViewport);
    }

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      const inViewport = this.isInViewport(enemy.x, enemy.y);
      enemy.update(time, delta, this.units, inViewport);
    }

    this.rebuildGrids();

    this.checkShieldBlock();
    this.checkWolfImpassable();
    this.checkFirearmsInterrupt();
  }

  private rebuildGrids(): void {
    this.enemyGrid.clear();
    this.unitGrid.clear();

    for (const enemy of this.enemies) {
      if (!enemy.isDead) {
        this.enemyGrid.insert(enemy);
      }
    }

    for (const unit of this.units) {
      if (!unit.isDead) {
        this.unitGrid.insert(unit);
      }
    }
  }

  private checkShieldBlock() {
    const SHIELD_BLOCK_RADIUS = 50;
    const SHIELD_BLOCK_RADIUS_SQ = SHIELD_BLOCK_RADIUS * SHIELD_BLOCK_RADIUS;

    for (const unit of this.units) {
      if (unit.isDead || unit.unitType !== 'shieldBearer') continue;
      const shield = unit as ShieldBearer;
      shield.blockCount = 0;

      const nearbyEnemies: Enemy[] = this.enemyGrid.getNearby(unit.x, unit.y, SHIELD_BLOCK_RADIUS);

      for (const enemy of nearbyEnemies) {
        if (enemy.isDead) continue;
        const dx = enemy.x - unit.x;
        const dy = enemy.y - unit.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < SHIELD_BLOCK_RADIUS_SQ) {
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
    const WOLF_IMPASSABLE_RADIUS = 45;
    const WOLF_IMPASSABLE_RADIUS_SQ = WOLF_IMPASSABLE_RADIUS * WOLF_IMPASSABLE_RADIUS;

    for (const unit of this.units) {
      if (unit.isDead || unit.unitType !== 'wolfSoldier') continue;
      const wolf = unit as WolfSoldier;
      if (!wolf.isImpassable) continue;

      const nearbyEnemies: Enemy[] = this.enemyGrid.getNearby(unit.x, unit.y, WOLF_IMPASSABLE_RADIUS);

      for (const enemy of nearbyEnemies) {
        if (enemy.isDead) continue;
        const dx = enemy.x - unit.x;
        const dy = enemy.y - unit.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < WOLF_IMPASSABLE_RADIUS_SQ) {
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
        this.units[i].destroy();
        this.units.splice(i, 1);
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isDead) {
        this.enemies[i].destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

  getGridStats(): { enemyGrid: ReturnType<SpatialGrid<Enemy>['getStats']>; unitGrid: ReturnType<SpatialGrid<Unit>['getStats']> } {
    return {
      enemyGrid: this.enemyGrid.getStats(),
      unitGrid: this.unitGrid.getStats(),
    };
  }
}
