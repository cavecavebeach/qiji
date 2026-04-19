import { Enemy } from '../base/Enemy';
import { ENEMY_CONFIGS } from '../../data/enemies';

export class Ronin extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMY_CONFIGS.ronin);
  }
}
