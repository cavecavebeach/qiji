import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

export class MenuScene extends Phaser.Scene {
  private scrollContainer!: Phaser.GameObjects.Container;
  private titleContainer!: Phaser.GameObjects.Container;
  private buttonContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, COLORS.BACKGROUND);

    this.createAmbientBackground();

    this.drawMainVisual();

    this.createScrollContainer(cx, cy - 40);

    this.createTitleSection();

    this.createButtonSection(cx, cy + 100);

    this.createFooter(cx, cy + 220);

    this.createEnhancedParticles();

    this.createSpotlightEffect();

    this.animateEntrance();
  }

  private createAmbientBackground() {
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x2C1810, 0x2C1810, 0x1A0F0A, 0x1A0F0A, 1);
    gradient.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.3);
    for (let i = 0; i < 100; i++) {
      const alpha = (i / 100) * 0.3;
      vignette.lineStyle(2, 0x000000, alpha);
      vignette.strokeRect(i * 2, i * 1.2, GAME_WIDTH - i * 4, GAME_HEIGHT - i * 2.4);
    }
  }

  private drawMainVisual() {
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'main_visual');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.BACKGROUND, 0.25);

    const topGradient = this.add.graphics();
    topGradient.fillGradientStyle(0x2C1810, 0x2C1810, 0x2C1810, 0x2C1810, 1, 1, 0, 0);
    topGradient.fillRect(0, 0, GAME_WIDTH, 120);

    const bottomGradient = this.add.graphics();
    bottomGradient.fillGradientStyle(0x2C1810, 0x2C1810, 0x2C1810, 0x2C1810, 0, 0, 1, 1);
    bottomGradient.fillRect(0, GAME_HEIGHT - 120, GAME_WIDTH, 120);
  }

  private createScrollContainer(cx: number, cy: number) {
    this.scrollContainer = this.add.container(cx, cy);

    const scrollWidth = 560;
    const scrollHeight = 280;

    const shadow = this.add.rectangle(8, 8, scrollWidth, scrollHeight, 0x000000, 0.3);
    this.scrollContainer.add(shadow);

    const paperBg = this.add.rectangle(0, 0, scrollWidth, scrollHeight, COLORS.PAPER_BG, 0.98);
    paperBg.setStrokeStyle(4, COLORS.INK_BROWN);
    this.scrollContainer.add(paperBg);

    const innerBorder = this.add.rectangle(0, 0, scrollWidth - 16, scrollHeight - 16);
    innerBorder.setStrokeStyle(2, COLORS.INK_BROWN, 0.4);
    this.scrollContainer.add(innerBorder);

    this.drawScrollEnds(-scrollWidth / 2, 0);
    this.drawScrollEnds(scrollWidth / 2, 0, true);

    this.drawOrnateCorners(scrollWidth / 2 - 20, scrollHeight / 2 - 20);

    this.drawCloudPatterns();

    this.scrollContainer.setScale(0, 1);
  }

  private drawScrollEnds(x: number, y: number, flipped = false) {
    const g = this.add.graphics();
    const sx = flipped ? -1 : 1;

    g.fillStyle(COLORS.UI_WOOD, 1);
    g.fillRoundedRect(x - 20 * sx, y - scrollHeight / 2, 40, scrollHeight, 4);

    g.lineStyle(3, COLORS.INK_BROWN);
    g.strokeRoundedRect(x - 20 * sx, y - scrollHeight / 2, 40, scrollHeight, 4);

    const woodGrain = this.add.graphics();
    for (let i = -scrollHeight / 2 + 10; i < scrollHeight / 2 - 10; i += 15) {
      woodGrain.lineStyle(1, 0x5A3A1E, 0.3);
      woodGrain.beginPath();
      woodGrain.moveTo(x - 15 * sx, y + i);
      woodGrain.lineTo(x + 15 * sx, y + i + (Math.random() - 0.5) * 5);
      woodGrain.strokePath();
    }
    this.scrollContainer.add(woodGrain);

    g.fillStyle(0x8B6914);
    [-60, 0, 60].forEach(offset => {
      g.fillCircle(x - 5 * sx, y + offset, 5);
      g.lineStyle(2, 0x5A3A1E);
      g.strokeCircle(x - 5 * sx, y + offset, 5);
    });

    this.scrollContainer.add(g);
  }

  private drawOrnateCorners(halfW: number, halfH: number) {
    const corners = [
      { x: -halfW, y: -halfH, rot: 0 },
      { x: halfW, y: -halfH, rot: Math.PI / 2 },
      { x: halfW, y: halfH, rot: Math.PI },
      { x: -halfW, y: halfH, rot: -Math.PI / 2 },
    ];

    corners.forEach(corner => {
      const g = this.add.graphics();
      g.lineStyle(2, COLORS.INK_BROWN, 0.6);

      const cos = Math.cos(corner.rot);
      const sin = Math.sin(corner.rot);

      const points = [
        { x: 0, y: 30 },
        { x: 0, y: 0 },
        { x: 30, y: 0 },
      ];

      g.beginPath();
      points.forEach((p, i) => {
        const rx = p.x * cos - p.y * sin + corner.x;
        const ry = p.x * sin + p.y * cos + corner.y;
        if (i === 0) g.moveTo(rx, ry);
        else g.lineTo(rx, ry);
      });
      g.strokePath();

      const decorPoints = [
        { x: 8, y: 20 },
        { x: 12, y: 0 },
        { x: 0, y: 8 },
      ];

      g.beginPath();
      decorPoints.forEach((p, i) => {
        const rx = p.x * cos - p.y * sin + corner.x;
        const ry = p.x * sin + p.y * cos + corner.y;
        if (i === 0) g.moveTo(rx, ry);
        else g.lineTo(rx, ry);
      });
      g.strokePath();

      this.scrollContainer.add(g);
    });
  }

  private drawCloudPatterns() {
    const cloudG = this.add.graphics();
    cloudG.lineStyle(1, COLORS.INK_BROWN, 0.15);

    const clouds = [
      { x: -200, y: -100, scale: 0.8 },
      { x: 180, y: -90, scale: 0.6 },
      { x: -150, y: 90, scale: 0.7 },
      { x: 200, y: 100, scale: 0.5 },
    ];

    clouds.forEach(cloud => {
      cloudG.beginPath();
      cloudG.arc(cloud.x, cloud.y, 20 * cloud.scale, 0, Math.PI, false);
      cloudG.arc(cloud.x + 25 * cloud.scale, cloud.y - 5 * cloud.scale, 25 * cloud.scale, 0, Math.PI, false);
      cloudG.arc(cloud.x + 50 * cloud.scale, cloud.y, 20 * cloud.scale, 0, Math.PI, false);
      cloudG.strokePath();
    });

    this.scrollContainer.add(cloudG);
  }

  private createTitleSection() {
    this.titleContainer = this.add.container(0, -50);

    const titleText = this.add.text(0, -30, '戚继光抗倭塔防', {
      fontSize: '52px',
      color: '#4A3C2C',
      fontFamily: '"SimSun", "Songti SC", serif',
      stroke: '#F3ECD8',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.titleContainer.add(titleText);

    const subtitleBg = this.add.rectangle(0, 20, 200, 28, COLORS.FLAG_RED, 0.1);
    this.titleContainer.add(subtitleBg);

    const subtitleText = this.add.text(0, 20, '台州九战九捷', {
      fontSize: '22px',
      color: '#8B2A1C',
      fontFamily: '"SimSun", "Songti SC", serif',
    }).setOrigin(0.5);
    this.titleContainer.add(subtitleText);

    const decorLine = this.add.graphics();
    decorLine.lineStyle(2, COLORS.INK_BROWN, 0.3);
    decorLine.beginPath();
    decorLine.moveTo(-120, 50);
    decorLine.lineTo(120, 50);
    decorLine.strokePath();

    decorLine.lineStyle(1, COLORS.INK_BROWN, 0.2);
    [-100, -60, -20, 20, 60, 100].forEach(x => {
      decorLine.beginPath();
      decorLine.moveTo(x, 47);
      decorLine.lineTo(x, 53);
      decorLine.strokePath();
    });
    this.titleContainer.add(decorLine);

    const eraText = this.add.text(0, 70, '明嘉靖四十年 · 浙江台州', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: '"SimSun", "Songti SC", serif',
    }).setOrigin(0.5);
    this.titleContainer.add(eraText);

    this.scrollContainer.add(this.titleContainer);

    this.tweens.add({
      targets: titleText,
      y: -32,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createButtonSection(cx: number, cy: number) {
    this.buttonContainer = this.add.container(cx, cy);

    const buttonBg = this.add.rectangle(0, 0, 200, 56, COLORS.UI_WOOD);
    buttonBg.setStrokeStyle(3, COLORS.INK_BROWN);
    this.buttonContainer.add(buttonBg);

    const innerBg = this.add.rectangle(0, 0, 190, 46, 0x7B5236);
    this.buttonContainer.add(innerBg);

    const leftFlag = this.createFlagDecor(-85, 0, false);
    const rightFlag = this.createFlagDecor(85, 0, true);
    this.buttonContainer.add([leftFlag, rightFlag]);

    const buttonText = this.add.text(0, -2, '开  战', {
      fontSize: '28px',
      color: '#F3ECD8',
      fontFamily: '"SimSun", "KaiTi", serif',
      stroke: '#4A3C2C',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.buttonContainer.add(buttonText);

    const glow = this.add.rectangle(0, 0, 200, 56, COLORS.FLAG_RED, 0);
    this.buttonContainer.addAt(glow, 0);

    buttonBg.setInteractive({ useHandCursor: true });

    buttonBg.on('pointerover', () => {
      innerBg.setFillStyle(0x8B6236);
      buttonBg.setStrokeStyle(4, COLORS.FLAG_RED);

      this.tweens.add({
        targets: glow,
        alpha: 0.3,
        duration: 200,
      });

      this.tweens.add({
        targets: this.buttonContainer,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 150,
        ease: 'Back.easeOut',
      });

      this.tweens.add({
        targets: [leftFlag, rightFlag],
        scaleX: 1.2,
        duration: 200,
      });
    });

    buttonBg.on('pointerout', () => {
      innerBg.setFillStyle(0x7B5236);
      buttonBg.setStrokeStyle(3, COLORS.INK_BROWN);

      this.tweens.add({
        targets: glow,
        alpha: 0,
        duration: 200,
      });

      this.tweens.add({
        targets: this.buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeOut',
      });

      this.tweens.add({
        targets: [leftFlag, rightFlag],
        scaleX: 1,
        duration: 200,
      });
    });

    buttonBg.on('pointerdown', () => {
      this.tweens.add({
        targets: this.buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fadeOut(400, 44, 24, 16);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('LevelSelectScene');
          });
        },
      });
    });

    this.tweens.add({
      targets: this.buttonContainer,
      y: cy + 3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createFlagDecor(x: number, y: number, flipped: boolean): Phaser.GameObjects.Container {
    const flag = this.add.container(x, y);
    const sx = flipped ? -1 : 1;

    const pole = this.add.rectangle(-15 * sx, 0, 4, 40, COLORS.INK_BROWN);
    flag.add(pole);

    const banner = this.add.triangle(0, 0, 0, -18, 22 * sx, 0, 0, 18, COLORS.FLAG_RED);
    flag.add(banner);

    const pattern = this.add.graphics();
    pattern.lineStyle(1, 0xF3ECD8, 0.5);
    pattern.beginPath();
    pattern.moveTo(5 * sx, -8);
    pattern.lineTo(12 * sx, 0);
    pattern.lineTo(5 * sx, 8);
    pattern.strokePath();
    flag.add(pattern);

    return flag;
  }

  private createFooter(cx: number, cy: number) {
    const container = this.add.container(cx, cy);

    const decorLine = this.add.graphics();
    decorLine.lineStyle(1, COLORS.INK_BROWN, 0.25);

    [-80, 80].forEach(x => {
      decorLine.beginPath();
      decorLine.moveTo(x - 20, 0);
      decorLine.lineTo(x + 20, 0);
      decorLine.strokePath();

      decorLine.fillStyle(COLORS.INK_BROWN, 0.25);
      decorLine.fillCircle(x, 0, 2);
    });
    container.add(decorLine);

    const footerText = this.add.text(0, 15, '基于明朝戚继光抗倭历史改编', {
      fontSize: '12px',
      color: '#888888',
      fontFamily: '"SimSun", serif',
    }).setOrigin(0.5);
    container.add(footerText);

    const achBtn = this.add.rectangle(0, 45, 100, 28, COLORS.UI_WOOD, 0.8);
    achBtn.setStrokeStyle(1, COLORS.FLAG_RED);
    const achText = this.add.text(0, 45, '🏆 战功录', {
      fontSize: '12px',
      color: '#F5A623',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    container.add([achBtn, achText]);

    achBtn.setInteractive({ useHandCursor: true });
    achBtn.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });
    achBtn.on('pointerover', () => achBtn.setFillStyle(0x7B5236, 0.9));
    achBtn.on('pointerout', () => achBtn.setFillStyle(COLORS.UI_WOOD, 0.8));

    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 800,
      delay: 1500,
    });
  }

  private createEnhancedParticles() {
    const particleContainer = this.add.container(0, 0);

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = GAME_HEIGHT + Math.random() * 100;
      const size = 2 + Math.random() * 3;

      const particle = this.add.circle(x, y, size, COLORS.INK_BROWN, 0.15);
      particleContainer.add(particle);

      this.tweens.add({
        targets: particle,
        y: -50,
        x: x + (Math.random() - 0.5) * 100,
        alpha: 0,
        duration: 8000 + Math.random() * 6000,
        repeat: -1,
        delay: Math.random() * 5000,
        onRepeat: () => {
          particle.setPosition(Math.random() * GAME_WIDTH, GAME_HEIGHT + 30);
          particle.setAlpha(0.15);
        },
      });
    }

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * GAME_HEIGHT;

      const dust = this.add.circle(x, y, 1 + Math.random() * 2, 0xF3ECD8, 0.1);
      particleContainer.add(dust);

      this.tweens.add({
        targets: dust,
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 200,
        alpha: { from: 0.1, to: 0 },
        duration: 6000 + Math.random() * 4000,
        repeat: -1,
        delay: Math.random() * 3000,
        onRepeat: () => {
          dust.setPosition(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT);
          dust.setAlpha(0.1);
        },
      });
    }
  }

  private createSpotlightEffect() {
    const spotlight = this.add.graphics();
    spotlight.fillStyle(0xF3ECD8, 0.03);

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 40;

    for (let i = 0; i < 5; i++) {
      const radius = 100 + i * 60;
      spotlight.fillCircle(cx, cy, radius);
    }

    this.tweens.add({
      targets: spotlight,
      alpha: 0.5,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private animateEntrance() {
    this.tweens.add({
      targets: this.scrollContainer,
      scaleX: 1,
      duration: 800,
      ease: 'Back.easeOut',
      delay: 200,
    });

    this.titleContainer.setAlpha(0);
    this.titleContainer.y -= 30;

    this.tweens.add({
      targets: this.titleContainer,
      alpha: 1,
      y: this.titleContainer.y + 30,
      duration: 600,
      ease: 'Power2',
      delay: 800,
    });

    this.buttonContainer.setAlpha(0);
    this.buttonContainer.y += 20;

    this.tweens.add({
      targets: this.buttonContainer,
      alpha: 1,
      y: this.buttonContainer.y - 20,
      duration: 500,
      ease: 'Power2',
      delay: 1200,
    });
  }
}

const scrollHeight = 280;
