import { Unit } from '../base/Unit';
import { UNIT_CONFIGS } from '../../data/units';

export class ShieldBearer extends Unit {
  blockCount: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, UNIT_CONFIGS.shieldBearer);
    this.blockCount = 0;
  }
}
