import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { LEVEL_CONFIGS } from '../data/levels';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.PAPER_BG);

    this.drawInkBorder();

    const title = this.add.text(GAME_WIDTH / 2, 40, '台州九战九捷', {
      fontSize: '32px',
      color: '#4A3C2C',
      fontFamily: 'serif',
      stroke: '#F3ECD8',
      strokeThickness: 2,
    }).setOrigin(0.5);

    const subtitle = this.add.text(GAME_WIDTH / 2, 72, '选择战役', {
      fontSize: '16px',
      color: '#8B6914',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    const completedLevels = this.getCompletedLevels();

    const cols = 3;
    const cardW = 240;
    const cardH = 130;
    const gapX = 30;
    const gapY = 20;
    const startX = (GAME_WIDTH - (cols * cardW + (cols - 1) * gapX)) / 2 + cardW / 2;
    const startY = 140;

    LEVEL_CONFIGS.forEach((level, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      const isUnlocked = true;
      const isCompleted = completedLevels.includes(level.id);

      this.createLevelCard(x, y, cardW, cardH, level, isUnlocked, isCompleted);
    });

    this.createBackButton();
    this.createAchievementButton();
  }

  private drawInkBorder() {
    const borderG = this.add.graphics();
    borderG.lineStyle(3, COLORS.INK_BROWN, 0.6);
    borderG.strokeRect(10, 10, GAME_WIDTH - 20, GAME_HEIGHT - 20);
    borderG.lineStyle(1, COLORS.INK_BROWN, 0.3);
    borderG.strokeRect(15, 15, GAME_WIDTH - 30, GAME_HEIGHT - 30);
  }

  private createLevelCard(x: number, y: number, w: number, h: number, level: { id: number; name: string; subtitle: string; multiLane: boolean }, isUnlocked: boolean, isCompleted: boolean) {
    const container = this.add.container(x, y);

    const bgColor = isUnlocked ? COLORS.UI_WOOD : 0x555555;
    const bg = this.add.rectangle(0, 0, w, h, bgColor, 0.95);
    bg.setStrokeStyle(2, isUnlocked ? COLORS.INK_BROWN : 0x444444);
    container.add(bg);

    const numText = this.add.text(-w / 2 + 20, -h / 2 + 18, `第${this.getChineseNumber(level.id)}关`, {
      fontSize: '13px',
      color: isUnlocked ? '#F5A623' : '#777777',
      fontFamily: 'serif',
    }).setOrigin(0, 0.5);
    container.add(numText);

    const nameText = this.add.text(0, -10, level.name, {
      fontSize: '22px',
      color: isUnlocked ? '#F3ECD8' : '#888888',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    container.add(nameText);

    const subText = this.add.text(0, 18, level.subtitle, {
      fontSize: '12px',
      color: isUnlocked ? '#B8A080' : '#666666',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    container.add(subText);

    if (level.multiLane && isUnlocked) {
      const laneTag = this.add.text(w / 2 - 15, -h / 2 + 15, '双路', {
        fontSize: '10px',
        color: '#5BA0C9',
        fontFamily: 'serif',
        stroke: '#4A3C2C',
        strokeThickness: 1,
      }).setOrigin(0.5);
      container.add(laneTag);
    }

    if (isCompleted) {
      const star = this.add.text(w / 2 - 20, h / 2 - 18, '★', {
        fontSize: '18px',
        color: '#F5A623',
        fontFamily: 'serif',
      }).setOrigin(0.5);
      container.add(star);
    }

    if (!isUnlocked) {
      const lock = this.add.text(0, 0, '🔒', {
        fontSize: '28px',
      }).setOrigin(0.5).setAlpha(0.6);
      container.add(lock);
    }

    if (isUnlocked) {
      bg.setInteractive({ useHandCursor: true });

      bg.on('pointerdown', () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.start('BattleScene', { levelId: level.id });
        });
      });

      bg.on('pointerover', () => {
        bg.setFillStyle(0x7B5236);
        this.tweens.add({
          targets: container,
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 100,
        });
      });

      bg.on('pointerout', () => {
        bg.setFillStyle(COLORS.UI_WOOD);
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
        });
      });
    }
  }

  private createBackButton() {
    const btn = this.add.rectangle(60, GAME_HEIGHT - 35, 80, 36, COLORS.UI_WOOD);
    btn.setStrokeStyle(2, COLORS.INK_BROWN);
    const text = this.add.text(60, GAME_HEIGHT - 35, '返回', {
      fontSize: '16px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    btn.on('pointerover', () => btn.setFillStyle(0x7B5236));
    btn.on('pointerout', () => btn.setFillStyle(COLORS.UI_WOOD));
  }

  private createAchievementButton() {
    const btn = this.add.rectangle(GAME_WIDTH - 80, GAME_HEIGHT - 35, 100, 36, COLORS.UI_WOOD);
    btn.setStrokeStyle(2, COLORS.FLAG_RED);
    const text = this.add.text(GAME_WIDTH - 80, GAME_HEIGHT - 35, '成就', {
      fontSize: '16px',
      color: '#F5A623',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      this.showAchievements();
    });
    btn.on('pointerover', () => btn.setFillStyle(0x7B5236));
    btn.on('pointerout', () => btn.setFillStyle(COLORS.UI_WOOD));
  }

  private showAchievements() {
    const overlay = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    overlay.setDepth(500);

    const bgDim = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    overlay.add(bgDim);

    const panel = this.add.rectangle(0, 0, 500, 400, COLORS.PAPER_BG, 0.98);
    panel.setStrokeStyle(3, COLORS.INK_BROWN);
    overlay.add(panel);

    const title = this.add.text(0, -160, '战 功 录', {
      fontSize: '28px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    overlay.add(title);

    const achievements = [
      { id: 'firstGlory', name: '初露锋芒', desc: '通关第1-3关' },
      { id: 'mandarinDuck', name: '鸳鸯阵传人', desc: '通关第4-6关' },
      { id: 'taizhouVictory', name: '台州大捷', desc: '通关第7-9关' },
      { id: 'qiTiger', name: '戚老虎', desc: '全关卡通关' },
    ];

    const unlocked = this.getUnlockedAchievements();

    achievements.forEach((ach, i) => {
      const ay = -100 + i * 65;
      const isUnlocked = unlocked.includes(ach.id);

      const achBg = this.add.rectangle(0, ay, 440, 50, isUnlocked ? 0xF5E6C8 : 0x888888, 0.9);
      achBg.setStrokeStyle(1, isUnlocked ? COLORS.FLAG_RED : 0x666666);
      overlay.add(achBg);

      const icon = this.add.text(-190, ay, isUnlocked ? '🏆' : '🔒', {
        fontSize: '22px',
      }).setOrigin(0, 0.5);
      overlay.add(icon);

      const name = this.add.text(-150, ay - 8, ach.name, {
        fontSize: '18px',
        color: isUnlocked ? '#4A3C2C' : '#888888',
        fontFamily: 'serif',
      }).setOrigin(0, 0.5);
      overlay.add(name);

      const desc = this.add.text(-150, ay + 12, ach.desc, {
        fontSize: '12px',
        color: isUnlocked ? '#8B6914' : '#666666',
        fontFamily: 'serif',
      }).setOrigin(0, 0.5);
      overlay.add(desc);
    });

    const closeBtn = this.add.rectangle(0, 160, 120, 40, COLORS.UI_WOOD);
    closeBtn.setStrokeStyle(2, COLORS.INK_BROWN);
    const closeText = this.add.text(0, 160, '关闭', {
      fontSize: '18px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    overlay.add([closeBtn, closeText]);

    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      overlay.destroy(true);
    });
    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x7B5236));
    closeBtn.on('pointerout', () => closeBtn.setFillStyle(COLORS.UI_WOOD));
  }

  private getChineseNumber(n: number): string {
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return nums[n] || String(n);
  }

  private getCompletedLevels(): number[] {
    try {
      const saved = localStorage.getItem('qiji_completed_levels');
      if (saved) return JSON.parse(saved) as number[];
    } catch {}
    return [];
  }

  private getUnlockedAchievements(): string[] {
    try {
      const saved = localStorage.getItem('qiji_achievements');
      if (saved) return JSON.parse(saved) as string[];
    } catch {}
    return [];
  }
}
