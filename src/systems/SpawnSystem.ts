import { Enemy } from '../entities/base/Enemy';
import { Ronin } from '../entities/enemies/Ronin';
import { Archer } from '../entities/enemies/Archer';
import { SpearEnemy } from '../entities/enemies/SpearEnemy';
import { ArmoredEnemy } from '../entities/enemies/ArmoredEnemy';
import { Sniper } from '../entities/enemies/Sniper';
import { Boss } from '../entities/enemies/Boss';
import type { EnemyType } from '../types';

export class SpawnSystem {
  private scene: Phaser.Scene;
  private enemies: Enemy[];

  constructor(scene: Phaser.Scene, enemies: Enemy[]) {
    this.scene = scene;
    this.enemies = enemies;
  }

  spawnEnemy(type: EnemyType, x: number, y: number): Enemy {
    let enemy: Enemy;
    switch (type) {
      case 'ronin':
        enemy = new Ronin(this.scene, x, y);
        break;
      case 'archer':
        enemy = new Archer(this.scene, x, y);
        break;
      case 'longSpear':
        enemy = new SpearEnemy(this.scene, x, y);
        break;
      case 'vineArmor':
        enemy = new ArmoredEnemy(this.scene, x, y);
        break;
      case 'sniper':
        enemy = new Sniper(this.scene, x, y);
        break;
      case 'boss':
        enemy = new Boss(this.scene, x, y);
        break;
      default:
        enemy = new Ronin(this.scene, x, y);
    }
    this.enemies.push(enemy);
    return enemy;
  }
}
