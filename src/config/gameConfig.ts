import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { LevelSelectScene } from '../scenes/LevelSelectScene';
import { BattleScene } from '../scenes/BattleScene';
import { ResultScene } from '../scenes/ResultScene';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game',
  backgroundColor: '#2C1810',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, LevelSelectScene, BattleScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
