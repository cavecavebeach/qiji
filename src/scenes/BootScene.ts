import Phaser from 'phaser';
import { COLORS, UNIT_COLORS, ENEMY_COLORS } from '../utils/Constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.add.rectangle(cx, cy, this.cameras.main.width, this.cameras.main.height, COLORS.BACKGROUND);

    const scrollBg = this.add.rectangle(cx, cy - 40, 520, 140, COLORS.PAPER_BG, 0.85);
    this.add.rectangle(cx, cy - 40, 520, 140).setStrokeStyle(3, COLORS.INK_BROWN);

    this.drawInkCorner(cx - 250, cy - 100, 30);
    this.drawInkCorner(cx + 250, cy - 100, 30, true);
    this.drawInkCorner(cx - 250, cy + 20, 30, false, true);
    this.drawInkCorner(cx + 250, cy + 20, 30, true, true);

    const title = this.add.text(cx, cy - 70, '戚继光抗倭塔防', {
      fontSize: '42px',
      color: '#4A3C2C',
      fontFamily: 'serif',
      stroke: '#F3ECD8',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(cx, cy - 25, '—— 台州九战九捷 ——', {
      fontSize: '16px',
      color: '#8B2A1C',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    const barBg = this.add.rectangle(cx, cy + 30, 300, 16, 0x333333).setStrokeStyle(1, COLORS.INK_BROWN);
    const barFill = this.add.rectangle(cx - 148, cy + 30, 4, 12, COLORS.FLAG_RED).setOrigin(0, 0.5);

    const loadingText = this.add.text(cx, cy + 55, '加载中...', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      barFill.width = 4 + 296 * value;
    });

    this.load.on('complete', () => {
      loadingText.setText('准备就绪');
    });

    this.load.image('level1_bg', 'level1_bg.png');
    this.load.image('main_visual', 'main_visual.png');

    this.generateTextures();
  }

  private drawInkCorner(x: number, y: number, size: number, flipX = false, flipY = false) {
    const g = this.add.graphics();
    g.lineStyle(2, COLORS.INK_BROWN, 0.6);
    g.beginPath();

    const sx = flipX ? -1 : 1;
    const sy = flipY ? -1 : 1;

    g.moveTo(x, y);
    g.lineTo(x + size * sx, y);
    g.moveTo(x, y);
    g.lineTo(x, y + size * sy);

    g.strokePath();
  }

  create() {
    this.scene.start('MenuScene');
  }

  private generateTextures() {
    this.createShieldBearerTexture();
    this.createSpearmanTexture();
    this.createWolfSoldierTexture();
    this.createForkGuardTexture();
    this.createFirearmsUnitTexture();

    this.createRoninTexture();
    this.createArcherTexture();
    this.createLongSpearTexture();
    this.createVineArmorTexture();
    this.createSniperTexture();
    this.createBossTexture();

    this.createFlagTexture();
    this.createBulletTexture();
    this.createArrowTexture();
    this.createHpBarTextures();
    this.createWoodButtonTexture();
    this.createInkFrameTexture();
    this.createPaperTexture();
  }

  private createShieldBearerTexture() {
    const g = this.add.graphics();
    const colors = UNIT_COLORS.shieldBearer;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 12, 8, COLORS.INK_BROWN);

    g.fillStyle(colors.coat);
    this.drawRoundedRectWithStroke(g, 8, 18, 16, 14, 3, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawCircleWithStroke(g, 6, 26, 14, COLORS.INK_BROWN);

    g.lineStyle(2, COLORS.INK_BROWN);
    g.beginPath();
    g.moveTo(6, 26);
    g.lineTo(6, 18);
    g.strokePath();

    g.generateTexture('shield_bearer', 32, 44);
    g.destroy();
  }

  private createSpearmanTexture() {
    const g = this.add.graphics();
    const colors = UNIT_COLORS.spearman;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 12, 8, COLORS.INK_BROWN);

    g.fillStyle(colors.coat);
    this.drawRoundedRectWithStroke(g, 10, 18, 12, 16, 3, COLORS.INK_BROWN);

    g.lineStyle(3, 0x8B6914);
    g.beginPath();
    g.moveTo(24, 4);
    g.lineTo(24, 42);
    g.strokePath();

    g.fillStyle(colors.secondary);
    this.drawTriangleWithStroke(g, 24, 2, 6, COLORS.INK_BROWN);

    g.fillStyle(0xD42A1E);
    g.fillCircle(24, 8, 3);

    g.generateTexture('spearman', 32, 44);
    g.destroy();
  }

  private createWolfSoldierTexture() {
    const g = this.add.graphics();
    const colors = UNIT_COLORS.wolfSoldier;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 10, 7, COLORS.INK_BROWN);

    g.fillStyle(colors.coat);
    this.drawRoundedRectWithStroke(g, 10, 15, 12, 14, 3, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    g.lineStyle(2, COLORS.INK_BROWN);
    g.beginPath();
    g.moveTo(26, 8);
    g.lineTo(26, 44);
    g.strokePath();

    g.fillStyle(colors.secondary);
    for (let i = 0; i < 4; i++) {
      g.fillTriangle(26 + 6, 12 + i * 8, 26 + 2, 10 + i * 8, 26 + 2, 14 + i * 8);
    }

    g.generateTexture('wolf_soldier', 36, 48);
    g.destroy();
  }

  private createForkGuardTexture() {
    const g = this.add.graphics();
    const colors = UNIT_COLORS.forkGuard;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 12, 8, COLORS.INK_BROWN);

    g.fillStyle(colors.coat);
    this.drawRoundedRectWithStroke(g, 10, 18, 12, 14, 3, COLORS.INK_BROWN);

    g.lineStyle(2, colors.secondary);
    g.beginPath();
    g.moveTo(24, 6);
    g.lineTo(24, 40);
    g.strokePath();

    g.fillStyle(colors.primary);
    g.fillTriangle(24, 4, 20, 10, 28, 10);
    g.fillTriangle(20, 8, 16, 6, 18, 10);
    g.fillTriangle(28, 8, 32, 6, 30, 10);
    g.lineStyle(1, COLORS.INK_BROWN);
    g.strokeTriangle(24, 4, 20, 10, 28, 10);

    g.generateTexture('fork_guard', 34, 44);
    g.destroy();
  }

  private createFirearmsUnitTexture() {
    const g = this.add.graphics();
    const colors = UNIT_COLORS.firearmsUnit;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 14, 12, 7, COLORS.INK_BROWN);

    g.fillStyle(colors.coat);
    this.drawRoundedRectWithStroke(g, 8, 18, 12, 14, 3, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 22, 16, 16, 5, 2, COLORS.INK_BROWN);

    g.fillStyle(colors.secondary);
    this.drawRoundedRectWithStroke(g, 20, 20, 6, 8, 1, COLORS.INK_BROWN);

    g.fillStyle(0x8B5E3C);
    this.drawCircleWithStroke(g, 12, 22, 3, COLORS.INK_BROWN);

    g.generateTexture('firearms_unit', 40, 44);
    g.destroy();
  }

  private createRoninTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.ronin;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 12, 7, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 8, 17, 16, 14, 3, COLORS.INK_BROWN);

    g.fillStyle(0xC0C0C0);
    this.drawRoundedRectWithStroke(g, 4, 20, 6, 16, 1, COLORS.INK_BROWN);

    g.fillStyle(0x2A2A2A);
    this.drawRoundedRectWithStroke(g, 3, 18, 2, 20, 1, COLORS.INK_BROWN);

    g.generateTexture('ronin', 32, 42);
    g.destroy();
  }

  private createArcherTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.archer;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 14, 12, 6, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 8, 16, 12, 12, 3, COLORS.INK_BROWN);

    g.lineStyle(2, colors.secondary);
    g.beginPath();
    g.arc(14, 22, 10, -0.5, 0.5);
    g.strokePath();

    g.lineStyle(1, 0xF5A623);
    g.beginPath();
    g.moveTo(20, 8);
    g.lineTo(20, 28);
    g.strokePath();

    g.generateTexture('archer', 28, 40);
    g.destroy();
  }

  private createLongSpearTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.longSpear;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 12, 8, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 8, 18, 16, 16, 3, COLORS.INK_BROWN);

    g.lineStyle(3, 0x8B6914);
    g.beginPath();
    g.moveTo(28, 6);
    g.lineTo(28, 46);
    g.strokePath();

    g.fillStyle(colors.secondary);
    this.drawTriangleWithStroke(g, 28, 4, 5, COLORS.INK_BROWN);

    g.generateTexture('long_spear', 36, 48);
    g.destroy();
  }

  private createVineArmorTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.vineArmor;

    g.fillStyle(colors.skin);
    this.drawCircleWithStroke(g, 16, 10, 6, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 6, 14, 20, 24, 4, COLORS.INK_BROWN);

    g.fillStyle(colors.secondary);
    for (let i = 0; i < 3; i++) {
      g.fillRect(8, 18 + i * 8, 16, 2);
    }

    g.fillStyle(0xC0C0C0);
    this.drawRoundedRectWithStroke(g, 2, 22, 8, 12, 1, COLORS.INK_BROWN);

    g.generateTexture('vine_armor', 36, 44);
    g.destroy();
  }

  private createSniperTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.sniper;

    g.fillStyle(colors.primary);
    this.drawCircleWithStroke(g, 14, 12, 7, COLORS.INK_BROWN);

    g.fillStyle(0x1A1A1A);
    g.fillCircle(18, 10, 4);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 8, 18, 12, 14, 3, COLORS.INK_BROWN);

    g.lineStyle(2, 0x7A6040);
    g.beginPath();
    g.arc(14, 24, 10, -0.3, 0.3);
    g.strokePath();

    g.generateTexture('sniper', 28, 42);
    g.destroy();
  }

  private createBossTexture() {
    const g = this.add.graphics();
    const colors = ENEMY_COLORS.boss;

    g.fillStyle(colors.primary);
    this.drawCircleWithStroke(g, 24, 16, 12, COLORS.INK_BROWN);

    g.fillStyle(0xD4A017);
    this.drawRoundedRectWithStroke(g, 14, 6, 20, 12, 2, COLORS.INK_BROWN);

    g.fillStyle(colors.primary);
    this.drawRoundedRectWithStroke(g, 8, 26, 32, 28, 5, COLORS.INK_BROWN);

    g.fillStyle(colors.secondary);
    g.fillRect(12, 30, 24, 4);

    g.fillStyle(0xC0C0C0);
    this.drawRoundedRectWithStroke(g, 2, 32, 14, 22, 2, COLORS.INK_BROWN);

    g.generateTexture('boss', 48, 60);
    g.destroy();
  }

  private createFlagTexture() {
    const g = this.add.graphics();

    g.lineStyle(4, 0x8B6914);
    g.beginPath();
    g.moveTo(4, 0);
    g.lineTo(4, 60);
    g.strokePath();

    g.fillStyle(COLORS.FLAG_RED);
    g.lineStyle(2, COLORS.INK_BROWN);
    g.beginPath();
    g.moveTo(6, 4);
    g.lineTo(40, 8);
    g.lineTo(40, 32);
    g.lineTo(6, 36);
    g.closePath();
    g.fillPath();
    g.strokePath();

    g.fillStyle(0xF5A623);
    g.fillCircle(23, 20, 8);

    g.generateTexture('flag', 44, 64);
    g.destroy();
  }

  private createBulletTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xFFFF00);
    this.drawRoundedRectWithStroke(g, 0, 0, 8, 4, 2, COLORS.INK_BROWN);
    g.generateTexture('bullet', 8, 4);
    g.destroy();
  }

  private createArrowTexture() {
    const g = this.add.graphics();
    g.lineStyle(2, 0xF5A623);
    g.beginPath();
    g.moveTo(0, 1);
    g.lineTo(14, 1);
    g.strokePath();
    g.fillStyle(0xF5A623);
    g.fillTriangle(14, 1, 10, -2, 10, 4);
    g.generateTexture('arrow', 16, 6);
    g.destroy();
  }

  private createHpBarTextures() {
    let g = this.add.graphics();
    g.fillStyle(0x333333);
    this.drawRoundedRectWithStroke(g, 0, 0, 36, 5, 2, COLORS.INK_BROWN);
    g.generateTexture('hp_bar_bg', 36, 5);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(COLORS.HP_GREEN);
    this.drawRoundedRect(g, 0, 0, 34, 3, 1);
    g.generateTexture('hp_bar_fill', 34, 3);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(0xF5A623);
    this.drawRoundedRect(g, 0, 0, 34, 3, 1);
    g.generateTexture('hp_bar_mid', 34, 3);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(COLORS.HP_RED);
    this.drawRoundedRect(g, 0, 0, 34, 3, 1);
    g.generateTexture('hp_bar_low', 34, 3);
    g.destroy();
  }

  private createWoodButtonTexture() {
    const g = this.add.graphics();

    g.fillStyle(COLORS.UI_WOOD);
    this.drawRoundedRectWithStroke(g, 0, 0, 120, 50, 6, COLORS.INK_BROWN);

    g.lineStyle(1, 0x5A3A1A, 0.3);
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(5, 10 + i * 12);
      g.lineTo(115, 12 + i * 12);
      g.strokePath();
    }

    g.generateTexture('wood_button', 120, 50);
    g.destroy();

    const g2 = this.add.graphics();
    g2.fillStyle(0x7B5236);
    this.drawRoundedRectWithStroke(g2, 0, 0, 120, 50, 6, COLORS.FLAG_RED);
    g2.lineStyle(2, 0xF5A623);
    g2.strokeRoundedRect(2, 2, 116, 46, 5);
    g2.generateTexture('wood_button_hover', 120, 50);
    g2.destroy();
  }

  private createInkFrameTexture() {
    const g = this.add.graphics();

    g.lineStyle(3, COLORS.INK_BROWN);
    g.strokeRect(0, 0, 200, 100);

    g.lineStyle(2, COLORS.INK_BROWN, 0.5);
    g.strokeRect(4, 4, 192, 92);

    g.generateTexture('ink_frame', 200, 100);
    g.destroy();
  }

  private createPaperTexture() {
    const g = this.add.graphics();

    g.fillStyle(COLORS.PAPER_BG, 0.95);
    g.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const alpha = 0.02 + Math.random() * 0.03;
      g.fillStyle(0x8B7355, alpha);
      g.fillCircle(x, y, 1 + Math.random() * 2);
    }

    g.generateTexture('paper', 256, 256);
    g.destroy();
  }

  private drawCircleWithStroke(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number, strokeColor: number) {
    g.fillCircle(x, y, r);
    g.lineStyle(2, strokeColor);
    g.strokeCircle(x, y, r);
  }

  private drawRoundedRect(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, r: number) {
    g.fillRoundedRect(x, y, w, h, r);
  }

  private drawRoundedRectWithStroke(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, r: number, strokeColor: number) {
    g.fillRoundedRect(x, y, w, h, r);
    g.lineStyle(2, strokeColor);
    g.strokeRoundedRect(x, y, w, h, r);
  }

  private drawTriangleWithStroke(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, strokeColor: number) {
    g.fillTriangle(x, y - size, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
    g.lineStyle(1, strokeColor);
    g.strokeTriangle(x, y - size, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
  }
}
