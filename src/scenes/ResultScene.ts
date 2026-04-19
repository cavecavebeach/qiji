import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { LEVEL_CONFIGS } from '../data/levels';
import type { BattleResult } from '../types';

const VICTORY_DESCRIPTIONS: Record<number, string> = {
  1: '戚继光首摆鸳鸯阵，于宁海歼敌数百，己方无一阵亡，鸳鸯阵一战成名。',
  2: '新河兵力空虚，戚夫人王氏巧施空城计，援军内外夹击，歼敌五百余。',
  3: '戚继光星夜驰援花街，斩首三百零八级，倭寇闻风丧胆。',
  4: '上峰岭设伏，全歼两千余名倭寇，鸳鸯阵攻防一体尽显威力。',
  5: '披山阻击战，戚家军分兵合击，上下夹攻大破倭寇。',
  6: '冒雨追击，水陆夹击大破倭寇，镋钯兵护卫后排抵挡狙击。',
  7: '山林追击战，保持阵型完整，全歼残敌，鸳鸯阵配合天衣无缝。',
  8: '戚继光分三路攻敌巢，擒斩焚溺倭寇无数，倭寇头目授首。',
  9: '水军外海截击，全沉十艘倭船，台州九战九捷圆满收官！',
};

const DEFEAT_TIPS: Record<number, string> = {
  1: '尝试在长枪兵前方放置藤牌兵，形成攻防配合。',
  2: '使用狼筅兵减速长枪倭寇，阻止其穿刺后排。',
  3: '火器兵需要保护，在藤牌兵后方部署可安全瞄准。',
  4: '藤甲倭寇免疫火器秒杀，用长枪穿透和镋钯保护应对。',
  5: '双路进攻需要合理分配兵力，关键路口优先防守。',
  6: '狙击手专攻后排，用镋钯兵吸引火力保护输出核心。',
  7: '混合敌群需要全部兵种配合，保持阵型完整性。',
  8: '倭寇头目会召唤小怪，需要集火快速击杀。',
  9: '终极挑战，善用全部兵种配合，双头目需分路应对。',
};

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  create(data: BattleResult) {
    const { victory, levelId, flagHpRemaining, enemiesDefeated } = data;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.PAPER_BG);

    this.drawInkBorder();

    const level = LEVEL_CONFIGS.find(l => l.id === levelId);

    if (victory) {
      this.showVictory(levelId, flagHpRemaining, enemiesDefeated, level);
    } else {
      this.showDefeat(levelId, flagHpRemaining, enemiesDefeated, level);
    }
  }

  private showVictory(levelId: number, flagHp: number, enemiesDefeated: number, level: { name: string; subtitle: string } | undefined) {
    const title = this.add.text(GAME_WIDTH / 2, 60, '大 捷', {
      fontSize: '48px',
      color: '#F5A623',
      fontFamily: 'serif',
      stroke: '#4A3C2C',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const levelName = this.add.text(GAME_WIDTH / 2, 110, `第${this.getChineseNumber(levelId)}关 · ${level?.name || ''}`, {
      fontSize: '22px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    this.showBattleStats(flagHp, enemiesDefeated);

    const desc = VICTORY_DESCRIPTIONS[levelId] || '战役胜利！';
    const descText = this.add.text(GAME_WIDTH / 2, 280, desc, {
      fontSize: '14px',
      color: '#4A3C2C',
      fontFamily: 'serif',
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5);

    const historyLabel = this.add.text(GAME_WIDTH / 2, 240, '── 战役纪要 ──', {
      fontSize: '13px',
      color: '#8B6914',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    this.showNewAchievements();

    if (levelId < 9) {
      this.createNextLevelButton(levelId + 1);
    }

    this.createButtons(false);
  }

  private showDefeat(levelId: number, flagHp: number, enemiesDefeated: number, level: { name: string; subtitle: string } | undefined) {
    const title = this.add.text(GAME_WIDTH / 2, 60, '兵 败', {
      fontSize: '48px',
      color: '#D0021B',
      fontFamily: 'serif',
      stroke: '#4A3C2C',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const levelName = this.add.text(GAME_WIDTH / 2, 110, `第${this.getChineseNumber(levelId)}关 · ${level?.name || ''}`, {
      fontSize: '22px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    this.showBattleStats(flagHp, enemiesDefeated);

    const tip = DEFEAT_TIPS[levelId] || '调整阵型再试一次。';
    const tipLabel = this.add.text(GAME_WIDTH / 2, 240, '── 战术建议 ──', {
      fontSize: '13px',
      color: '#8B6914',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    const tipText = this.add.text(GAME_WIDTH / 2, 280, tip, {
      fontSize: '14px',
      color: '#4A3C2C',
      fontFamily: 'serif',
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5);

    this.createButtons(true);
  }

  private showBattleStats(flagHp: number, enemiesDefeated: number) {
    const statsY = 160;

    const statsBg = this.add.rectangle(GAME_WIDTH / 2, statsY, 500, 50, COLORS.UI_WOOD, 0.3);
    statsBg.setStrokeStyle(1, COLORS.INK_BROWN);

    const flagStat = this.add.text(GAME_WIDTH / 2 - 120, statsY, `🚩 帅旗: ${flagHp}HP`, {
      fontSize: '16px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    const enemyStat = this.add.text(GAME_WIDTH / 2 + 120, statsY, `⚔️ 歼敌: ${enemiesDefeated}`, {
      fontSize: '16px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5);
  }

  private showNewAchievements() {
    try {
      const achievements = JSON.parse(localStorage.getItem('qiji_achievements') || '[]') as string[];

      const achievementNames: Record<string, string> = {
        firstGlory: '初露锋芒',
        mandarinDuck: '鸳鸯阵传人',
        taizhouVictory: '台州大捷',
        qiTiger: '戚老虎',
      };

      if (achievements.length > 0) {
        const achY = 330;
        const achLabel = this.add.text(GAME_WIDTH / 2, achY, '── 解锁成就 ──', {
          fontSize: '13px',
          color: '#F5A623',
          fontFamily: 'serif',
        }).setOrigin(0.5);

        achievements.forEach((ach, i) => {
          const name = achievementNames[ach] || ach;
          const achText = this.add.text(GAME_WIDTH / 2, achY + 25 + i * 22, `🏆 ${name}`, {
            fontSize: '14px',
            color: '#F5A623',
            fontFamily: 'serif',
          }).setOrigin(0.5);
        });
      }
    } catch {}
  }

  private createNextLevelButton(nextLevelId: number) {
    const btn = this.add.rectangle(GAME_WIDTH / 2, 430, 180, 45, COLORS.FLAG_RED);
    btn.setStrokeStyle(2, COLORS.INK_BROWN);
    const text = this.add.text(GAME_WIDTH / 2, 430, '下一关 →', {
      fontSize: '20px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('BattleScene', { levelId: nextLevelId });
      });
    });
    btn.on('pointerover', () => btn.setFillStyle(0xA83420));
    btn.on('pointerout', () => btn.setFillStyle(COLORS.FLAG_RED));
  }

  private createButtons(showRetry: boolean) {
    const btnY = showRetry ? 430 : 490;

    if (showRetry) {
      const retryBtn = this.add.rectangle(GAME_WIDTH / 2, btnY, 180, 45, COLORS.FLAG_RED);
      retryBtn.setStrokeStyle(2, COLORS.INK_BROWN);
      const retryText = this.add.text(GAME_WIDTH / 2, btnY, '再战一次', {
        fontSize: '20px',
        color: '#F3ECD8',
        fontFamily: 'serif',
      }).setOrigin(0.5);

      retryBtn.setInteractive({ useHandCursor: true });
      retryBtn.on('pointerdown', () => {
        const levelId = this.registry.get('lastLevelId') || 1;
        this.scene.start('BattleScene', { levelId });
      });
      retryBtn.on('pointerover', () => retryBtn.setFillStyle(0xA83420));
      retryBtn.on('pointerout', () => retryBtn.setFillStyle(COLORS.FLAG_RED));
    }

    const selectBtn = this.add.rectangle(GAME_WIDTH / 2 - 110, btnY + 60, 160, 40, COLORS.UI_WOOD);
    selectBtn.setStrokeStyle(2, COLORS.INK_BROWN);
    const selectText = this.add.text(GAME_WIDTH / 2 - 110, btnY + 60, '选择关卡', {
      fontSize: '16px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    selectBtn.setInteractive({ useHandCursor: true });
    selectBtn.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });
    selectBtn.on('pointerover', () => selectBtn.setFillStyle(0x7B5236));
    selectBtn.on('pointerout', () => selectBtn.setFillStyle(COLORS.UI_WOOD));

    const menuBtn = this.add.rectangle(GAME_WIDTH / 2 + 110, btnY + 60, 160, 40, COLORS.UI_WOOD);
    menuBtn.setStrokeStyle(2, COLORS.INK_BROWN);
    const menuText = this.add.text(GAME_WIDTH / 2 + 110, btnY + 60, '返回菜单', {
      fontSize: '16px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);

    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x7B5236));
    menuBtn.on('pointerout', () => menuBtn.setFillStyle(COLORS.UI_WOOD));
  }

  private drawInkBorder() {
    const borderG = this.add.graphics();
    borderG.lineStyle(3, COLORS.INK_BROWN, 0.6);
    borderG.strokeRect(10, 10, GAME_WIDTH - 20, GAME_HEIGHT - 20);
    borderG.lineStyle(1, COLORS.INK_BROWN, 0.3);
    borderG.strokeRect(15, 15, GAME_WIDTH - 30, GAME_HEIGHT - 30);
  }

  private getChineseNumber(n: number): string {
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return nums[n] || String(n);
  }
}
