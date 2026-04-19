import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../utils/Constants';
import { UNIT_CONFIGS } from '../data/units';
import type { UnitType, WaveState } from '../types';

const UNIT_ICONS: Record<UnitType, string> = {
  shieldBearer: 'shield_bearer',
  spearman: 'spearman',
  wolfSoldier: 'wolf_soldier',
  forkGuard: 'fork_guard',
  firearmsUnit: 'firearms_unit',
};

const UNIT_NAMES: Record<UnitType, string> = {
  shieldBearer: '藤牌兵',
  spearman: '长枪兵',
  wolfSoldier: '狼筅兵',
  forkGuard: '镋钯兵',
  firearmsUnit: '火器兵',
};

export class HUD {
  private scene: Phaser.Scene;
  private goldText: Phaser.GameObjects.Text;
  private goldIcon: Phaser.GameObjects.Container | null = null;
  private flagHpBar: Phaser.GameObjects.Graphics;
  private flagHpText: Phaser.GameObjects.Text;
  private waveText: Phaser.GameObjects.Text;
  private unitButtons: Map<UnitType, { container: Phaser.GameObjects.Container; bg: Phaser.GameObjects.Rectangle; icon: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; costText: Phaser.GameObjects.Text; cooldownOverlay: Phaser.GameObjects.Rectangle }>;
  private selectedUnit: UnitType | null;
  private onUnitSelect: ((type: UnitType | null) => void) | null;
  private availableUnits: UnitType[];
  private topBar: Phaser.GameObjects.Container;
  private bottomBar: Phaser.GameObjects.Container;
  private pauseBtn: Phaser.GameObjects.Container | null;
  private onPause: (() => void) | null;

  constructor(scene: Phaser.Scene, availableUnits: UnitType[], onUnitSelect?: (type: UnitType | null) => void) {
    this.scene = scene;
    this.selectedUnit = null;
    this.onUnitSelect = onUnitSelect || null;
    this.availableUnits = availableUnits;
    this.unitButtons = new Map();
    this.pauseBtn = null;
    this.onPause = null;

    this.topBar = this.createTopBar();
    this.goldText = this.createGoldDisplay();
    this.flagHpBar = this.createFlagHpBar();
    this.flagHpText = this.createFlagHpText();
    this.waveText = this.createWaveDisplay();
    this.pauseBtn = this.createPauseButton();

    this.bottomBar = this.createBottomBar();
    this.createUnitButtons();
  }

  setPauseCallback(cb: () => void) {
    this.onPause = cb;
  }

  private createPauseButton(): Phaser.GameObjects.Container {
    const container = this.scene.add.container(GAME_WIDTH - 50, 30);
    container.setDepth(101);

    const bg = this.scene.add.rectangle(0, 0, 36, 36, COLORS.UI_WOOD);
    bg.setStrokeStyle(2, COLORS.INK_BROWN);
    container.add(bg);

    const line1 = this.scene.add.rectangle(-5, 0, 4, 16, COLORS.PAPER_BG);
    const line2 = this.scene.add.rectangle(5, 0, 4, 16, COLORS.PAPER_BG);
    container.add([line1, line2]);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => {
      if (this.onPause) this.onPause();
    });
    bg.on('pointerover', () => bg.setFillStyle(0x7B5236));
    bg.on('pointerout', () => bg.setFillStyle(COLORS.UI_WOOD));

    return container;
  }

  private createTopBar(): Phaser.GameObjects.Container {
    const container = this.scene.add.container(GAME_WIDTH / 2, 30);

    const bg = this.scene.add.rectangle(0, 0, GAME_WIDTH - 20, 50, COLORS.PAPER_BG, 0.95);
    bg.setStrokeStyle(2, COLORS.INK_BROWN);
    container.add(bg);

    const leftDecor = this.createScrollEnd(-GAME_WIDTH / 2 + 25, 0, false);
    const rightDecor = this.createScrollEnd(GAME_WIDTH / 2 - 25, 0, true);
    container.add(leftDecor);
    container.add(rightDecor);

    container.setDepth(100);
    return container;
  }

  private createScrollEnd(x: number, y: number, flipped: boolean): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();
    const sx = flipped ? -1 : 1;

    g.fillStyle(COLORS.UI_WOOD, 0.9);
    g.beginPath();
    g.moveTo(x, y - 20);
    g.lineTo(x + 15 * sx, y);
    g.lineTo(x, y + 20);
    g.closePath();
    g.fillPath();

    g.lineStyle(1, COLORS.INK_BROWN);
    g.strokePath();

    return g;
  }

  private createGoldDisplay(): Phaser.GameObjects.Text {
    this.goldIcon = this.scene.add.container(30, 30);

    const coin = this.scene.add.circle(0, 0, 10, 0xF5A623);
    coin.setStrokeStyle(2, COLORS.INK_BROWN);
    this.goldIcon.add(coin);

    const coinText = this.scene.add.text(0, 0, '饷', {
      fontSize: '10px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    this.goldIcon.add(coinText);
    this.goldIcon.setDepth(101);

    const text = this.scene.add.text(50, 22, '8', {
      fontSize: '20px',
      color: '#F5A623',
      fontFamily: 'serif',
      stroke: '#4A3C2C',
      strokeThickness: 1,
    }).setDepth(101);

    return text;
  }

  private createFlagHpBar(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();
    g.setDepth(101);

    g.fillStyle(0x333333);
    g.fillRoundedRect(180, 22, 120, 16, 4);

    g.fillStyle(COLORS.HP_GREEN);
    g.fillRoundedRect(182, 24, 116, 12, 3);

    g.lineStyle(1, COLORS.INK_BROWN);
    g.strokeRoundedRect(180, 22, 120, 16, 4);

    return g;
  }

  private createFlagHpText(): Phaser.GameObjects.Text {
    const flagIcon = this.scene.add.text(165, 30, '🚩', {
      fontSize: '14px',
    }).setDepth(101);

    return this.scene.add.text(240, 28, '100/100', {
      fontSize: '12px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5).setDepth(101);
  }

  private createWaveDisplay(): Phaser.GameObjects.Text {
    const waveIcon = this.scene.add.text(350, 28, '⚔️', {
      fontSize: '14px',
    }).setDepth(101);

    return this.scene.add.text(400, 28, '波次: 0/0', {
      fontSize: '14px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setDepth(101);
  }

  private createBottomBar(): Phaser.GameObjects.Container {
    const container = this.scene.add.container(GAME_WIDTH / 2, 555);

    const bg = this.scene.add.rectangle(0, 0, GAME_WIDTH - 20, 70, COLORS.PAPER_BG, 0.95);
    bg.setStrokeStyle(2, COLORS.INK_BROWN);
    container.add(bg);

    const leftDecor = this.createScrollEnd(-GAME_WIDTH / 2 + 25, 0, false);
    const rightDecor = this.createScrollEnd(GAME_WIDTH / 2 - 25, 0, true);
    container.add(leftDecor);
    container.add(rightDecor);

    container.setDepth(100);
    return container;
  }

  private createUnitButtons() {
    const startX = 120;
    const y = 555;
    const spacing = 140;

    this.availableUnits.forEach((type, i) => {
      const config = UNIT_CONFIGS[type];
      const x = startX + i * spacing;

      const container = this.scene.add.container(x, y);
      container.setDepth(101);

      const bg = this.scene.add.rectangle(0, 0, 110, 55, COLORS.UI_WOOD);
      bg.setStrokeStyle(2, COLORS.INK_BROWN);
      container.add(bg);

      if (this.scene.textures.exists(UNIT_ICONS[type])) {
        const icon = this.scene.add.sprite(-30, -5, UNIT_ICONS[type]);
        icon.setScale(0.6);
        container.add(icon);
      } else {
        const icon = this.scene.add.rectangle(-30, -5, 20, 25, config.color);
        icon.setStrokeStyle(1, COLORS.INK_BROWN);
        container.add(icon);
      }

      const text = this.scene.add.text(10, -12, UNIT_NAMES[type], {
        fontSize: '14px',
        color: '#F3ECD8',
        fontFamily: 'serif',
      }).setOrigin(0.5);
      container.add(text);

      const costBg = this.scene.add.rectangle(10, 10, 40, 16, 0xF5A623, 0.3);
      costBg.setStrokeStyle(1, 0xF5A623);
      container.add(costBg);

      const costText = this.scene.add.text(10, 10, `${config.cost}`, {
        fontSize: '11px',
        color: '#F5A623',
        fontFamily: 'serif',
      }).setOrigin(0.5);
      container.add(costText);

      const cooldownOverlay = this.scene.add.rectangle(0, 0, 110, 55, 0x000000, 0.5);
      cooldownOverlay.setVisible(false);
      container.add(cooldownOverlay);

      const icon = container.list[1] as Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;

      this.unitButtons.set(type, { container, bg, icon, text, costText, cooldownOverlay });

      bg.setInteractive({ useHandCursor: true });

      bg.on('pointerdown', () => {
        this.selectUnit(type);
      });

      bg.on('pointerover', () => {
        if (this.selectedUnit !== type) {
          bg.setFillStyle(0x7B5236);
          bg.setStrokeStyle(2, 0xF5A623);
        }
      });

      bg.on('pointerout', () => {
        if (this.selectedUnit !== type) {
          bg.setFillStyle(COLORS.UI_WOOD);
          bg.setStrokeStyle(2, COLORS.INK_BROWN);
        }
      });
    });
  }

  selectUnit(type: UnitType | null) {
    this.selectedUnit = type;
    this.unitButtons.forEach((btn, t) => {
      if (t === type) {
        btn.bg.setFillStyle(0x8B5A2B);
        btn.bg.setStrokeStyle(3, COLORS.FLAG_RED);

        this.scene.tweens.add({
          targets: btn.container,
          scaleY: 1.05,
          duration: 100,
          yoyo: true,
        });
      } else {
        btn.bg.setFillStyle(COLORS.UI_WOOD);
        btn.bg.setStrokeStyle(2, COLORS.INK_BROWN);
      }
    });
    if (this.onUnitSelect) {
      this.onUnitSelect(type);
    }
  }

  getSelectedUnit(): UnitType | null {
    return this.selectedUnit;
  }

  updateGold(gold: number) {
    this.goldText.setText(`${Math.floor(gold)}`);

    this.scene.tweens.add({
      targets: this.goldText,
      scaleX: 1.2,
      duration: 100,
      yoyo: true,
    });

    this.unitButtons.forEach((btn, type) => {
      const config = UNIT_CONFIGS[type];
      const canAfford = gold >= config.cost;

      btn.container.setAlpha(canAfford ? 1 : 0.5);

      if (!canAfford) {
        btn.costText.setColor('#D0021B');
      } else {
        btn.costText.setColor('#F5A623');
      }
    });
  }

  updateFlagHp(hp: number, maxHp: number) {
    const ratio = hp / maxHp;

    this.flagHpBar.clear();

    this.flagHpBar.fillStyle(0x333333);
    this.flagHpBar.fillRoundedRect(180, 22, 120, 16, 4);

    let barColor = COLORS.HP_GREEN;
    if (ratio <= 0.25) {
      barColor = COLORS.HP_RED;
    } else if (ratio <= 0.5) {
      barColor = 0xF5A623;
    }

    this.flagHpBar.fillStyle(barColor);
    this.flagHpBar.fillRoundedRect(182, 24, 116 * ratio, 12, 3);

    this.flagHpBar.lineStyle(1, COLORS.INK_BROWN);
    this.flagHpBar.strokeRoundedRect(180, 22, 120, 16, 4);

    this.flagHpText.setText(`${Math.ceil(hp)}/${maxHp}`);

    if (ratio <= 0.25) {
      this.flagHpText.setColor('#D0021B');
    } else if (ratio <= 0.5) {
      this.flagHpText.setColor('#F5A623');
    } else {
      this.flagHpText.setColor('#F3ECD8');
    }
  }

  updateWave(state: WaveState) {
    this.waveText.setText(`波次: ${state.currentWave}/${state.totalWaves}`);
  }

  deselectUnit() {
    this.selectedUnit = null;
    this.unitButtons.forEach((btn) => {
      btn.bg.setFillStyle(COLORS.UI_WOOD);
      btn.bg.setStrokeStyle(2, COLORS.INK_BROWN);
    });
  }

  showCooldown(type: UnitType, duration: number) {
    const btn = this.unitButtons.get(type);
    if (!btn) return;

    btn.cooldownOverlay.setVisible(true);

    this.scene.time.delayedCall(duration * 1000, () => {
      btn.cooldownOverlay.setVisible(false);
    });
  }
}
