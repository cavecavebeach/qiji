import { Unit } from '../base/Unit';
import { UNIT_CONFIGS } from '../../data/units';

export class Spearman extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, UNIT_CONFIGS.spearman);
  }
}
