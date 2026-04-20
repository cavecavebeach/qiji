import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, FLAG_X, FLAG_Y, FLAG_HP, HALF_FIELD_X, BATTLEFIELD_TOP, BATTLEFIELD_BOTTOM, BATTLEFIELD_LEFT, BATTLEFIELD_RIGHT } from '../utils/Constants';
import { LEVEL_CONFIGS } from '../data/levels';
import { UNIT_CONFIGS } from '../data/units';
import { Unit } from '../entities/base/Unit';
import { Enemy } from '../entities/base/Enemy';
import { ShieldBearer } from '../entities/units/ShieldBearer';
import { Spearman } from '../entities/units/Spearman';
import { WolfSoldier } from '../entities/units/WolfSoldier';
import { ForkGuard } from '../entities/units/ForkGuard';
import { FirearmsUnit } from '../entities/units/FirearmsUnit';
import { Boss } from '../entities/enemies/Boss';
import { CombatSystem } from '../systems/CombatSystem';
import { ResourceSystem } from '../systems/ResourceSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { SpawnSystem } from '../systems/SpawnSystem';
import { EffectsSystem } from '../systems/EffectsSystem';
import { HUD } from '../ui/HUD';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';
import type { UnitType, BattleResult } from '../types';

const MAX_ENTITIES = 80;
const VIEWPORT_MARGIN = 50;

export class BattleScene extends Phaser.Scene {
  units: Unit[];
  enemies: Enemy[];
  private combatSystem!: CombatSystem;
  private resourceSystem!: ResourceSystem;
  private waveSystem!: WaveSystem;
  private spawnSystem!: SpawnSystem;
  private effectsSystem!: EffectsSystem;
  private hud!: HUD;
  private performanceMonitor!: PerformanceMonitor;
  private flagHp: number;
  private levelId: number;
  private battleOver: boolean;
  private enemiesDefeated: number;
  private flagSprite!: Phaser.GameObjects.Container;
  private flagIcon!: Phaser.GameObjects.Sprite;
  private flagPole!: Phaser.GameObjects.Rectangle;
  private placementIndicator: Phaser.GameObjects.Arc | null;
  private levelText!: Phaser.GameObjects.Text;
  private flagGuardTimer: Phaser.Time.TimerEvent | null;
  private flagGuardDamage: number;
  private flagGuardInterval: number;
  private isPaused: boolean;
  private pauseOverlay: Phaser.GameObjects.Container | null;
  private multiLane: boolean;
  private laneRivers: Phaser.GameObjects.Graphics[];
  private viewportBounds: { left: number; right: number; top: number; bottom: number };

  getEntityCount(): number {
    return this.units.length + this.enemies.length;
  }

  canSpawnEntity(): boolean {
    return this.getEntityCount() < MAX_ENTITIES;
  }

  isEntityInViewport(x: number, y: number): boolean {
    return x >= this.viewportBounds.left && 
           x <= this.viewportBounds.right && 
           y >= this.viewportBounds.top && 
           y <= this.viewportBounds.bottom;
  }

  constructor() {
    super({ key: 'BattleScene' });
    this.units = [];
    this.enemies = [];
    this.flagHp = FLAG_HP;
    this.levelId = 1;
    this.battleOver = false;
    this.enemiesDefeated = 0;
    this.placementIndicator = null;
    this.flagGuardTimer = null;
    this.flagGuardDamage = 30;
    this.flagGuardInterval = 3000;
    this.isPaused = false;
    this.pauseOverlay = null;
    this.multiLane = false;
    this.laneRivers = [];
    this.viewportBounds = {
      left: BATTLEFIELD_LEFT - VIEWPORT_MARGIN,
      right: BATTLEFIELD_RIGHT + VIEWPORT_MARGIN,
      top: BATTLEFIELD_TOP - VIEWPORT_MARGIN,
      bottom: BATTLEFIELD_BOTTOM + VIEWPORT_MARGIN,
    };
  }

  create(data: { levelId: number }) {
    this.levelId = data.levelId || 1;
    this.units = [];
    this.enemies = [];
    this.flagHp = FLAG_HP;
    this.battleOver = false;
    this.enemiesDefeated = 0;
    this.isPaused = false;
    this.pauseOverlay = null;
    this.laneRivers = [];

    const level = LEVEL_CONFIGS.find(l => l.id === this.levelId);
    if (!level) {
      this.scene.start('MenuScene');
      return;
    }

    this.multiLane = level.multiLane;

    this.drawBattlefield(level);
    this.createFlag();

    this.resourceSystem = new ResourceSystem(this, level.initialGold, level.goldRate, (gold) => {
      this.hud.updateGold(gold);
    });
    this.resourceSystem.start();

    this.spawnSystem = new SpawnSystem(this, this.enemies);

    this.waveSystem = new WaveSystem(this, level.waves, level.lanes, (state) => {
      this.hud.updateWave(state);
    });
    this.waveSystem.setSpawnCallback((type, x, y) => {
      const enemy = this.spawnSystem.spawnEnemy(type, x, y);
      if (type === 'boss') {
        const boss = enemy as Boss;
        boss.setSummonCallback((sx: number, sy: number) => {
          this.spawnSystem.spawnEnemy('ronin', sx, sy - 30);
          this.spawnSystem.spawnEnemy('ronin', sx, sy + 30);
        });
      }
    });
    this.waveSystem.setOnWaveComplete((nextWaveNum) => {
      this.time.delayedCall(1000, () => {
        this.showWaveWarning(nextWaveNum);
      });
    });

    this.combatSystem = new CombatSystem(this, this.units, this.enemies);

    this.hud = new HUD(this, level.availableUnits, (type) => {
      this.onUnitSelected(type);
    });
    this.hud.setPauseCallback(() => this.togglePause());

    this.hud.updateGold(this.resourceSystem.getGold());
    this.hud.updateFlagHp(this.flagHp, FLAG_HP);
    this.hud.updateWave(this.waveSystem.getState());

    this.effectsSystem = new EffectsSystem(this);

    this.performanceMonitor = new PerformanceMonitor(this, {
      enabled: true,
      showPanel: false,
      fpsWarningThreshold: 30,
    });

    this.startFlagGuard();

    this.time.delayedCall(1500, () => {
      this.showWaveWarning(1);
    });

    this.setupBattlefieldClick();

    this.setupPauseKey();
  }

  private setupPauseKey() {
    this.input.keyboard?.on('keydown-ESC', () => {
      this.togglePause();
    });
  }

  togglePause() {
    if (this.battleOver) return;
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.physics?.world?.pause();
      this.showPauseOverlay();
    } else {
      this.physics?.world?.resume();
      this.hidePauseOverlay();
    }
  }

  private showPauseOverlay() {
    if (this.pauseOverlay) return;

    this.pauseOverlay = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.pauseOverlay.setDepth(500);

    const bg = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    this.pauseOverlay.add(bg);

    const panel = this.add.rectangle(0, 0, 320, 240, COLORS.PAPER_BG, 0.95);
    panel.setStrokeStyle(3, COLORS.INK_BROWN);
    this.pauseOverlay.add(panel);

    const title = this.add.text(0, -80, '暂 停', {
      fontSize: '36px',
      color: '#4A3C2C',
      fontFamily: 'serif',
      stroke: '#F3ECD8',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.pauseOverlay.add(title);

    const resumeBtn = this.add.rectangle(0, -20, 200, 45, COLORS.UI_WOOD)
      .setStrokeStyle(2, COLORS.FLAG_RED)
      .setInteractive({ useHandCursor: true });
    const resumeText = this.add.text(0, -20, '继续战斗', {
      fontSize: '20px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    this.pauseOverlay.add([resumeBtn, resumeText]);
    resumeBtn.on('pointerdown', () => this.togglePause());
    resumeBtn.on('pointerover', () => resumeBtn.setFillStyle(0x7B5236));
    resumeBtn.on('pointerout', () => resumeBtn.setFillStyle(COLORS.UI_WOOD));

    const menuBtn = this.add.rectangle(0, 45, 200, 45, COLORS.UI_WOOD)
      .setStrokeStyle(2, COLORS.INK_BROWN)
      .setInteractive({ useHandCursor: true });
    const menuText = this.add.text(0, 45, '返回菜单', {
      fontSize: '20px',
      color: '#F3ECD8',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    this.pauseOverlay.add([menuBtn, menuText]);
    menuBtn.on('pointerdown', () => {
      this.isPaused = false;
      this.scene.start('MenuScene');
    });
    menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x7B5236));
    menuBtn.on('pointerout', () => menuBtn.setFillStyle(COLORS.UI_WOOD));

    const hint = this.add.text(0, 95, '按 ESC 继续', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'serif',
    }).setOrigin(0.5);
    this.pauseOverlay.add(hint);
  }

  private hidePauseOverlay() {
    if (this.pauseOverlay) {
      this.pauseOverlay.destroy(true);
      this.pauseOverlay = null;
    }
  }

  private startFlagGuard() {
    this.flagGuardTimer = this.time.addEvent({
      delay: this.flagGuardInterval,
      callback: () => {
        this.flagGuardAttack();
      },
      loop: true,
    });
  }

  private flagGuardAttack() {
    if (this.battleOver || this.isPaused) return;

    let closestEnemy: Enemy | null = null;
    let closestDist = Infinity;

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      if (enemy.x >= HALF_FIELD_X) continue;
      const dist = Math.abs(enemy.x - FLAG_X);
      if (dist < closestDist) {
        closestDist = dist;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy) {
      closestEnemy.takeDamage(this.flagGuardDamage);
      this.showFlagGuardShot(closestEnemy.x, closestEnemy.y);
      closestEnemy.showDamageNumber(this.flagGuardDamage, true);
    }
  }

  private showFlagGuardShot(targetX: number, targetY: number) {
    const bullet = this.add.sprite(FLAG_X + 20, FLAG_Y, 'bullet');
    bullet.setDepth(150);

    this.tweens.add({
      targets: bullet,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        bullet.destroy();
        const impact = this.add.circle(targetX, targetY, 8, 0xFFFF00, 0.8);
        impact.setDepth(151);
        this.tweens.add({
          targets: impact,
          alpha: 0,
          scaleX: 2,
          scaleY: 2,
          duration: 150,
          onComplete: () => impact.destroy(),
        });
      },
    });
  }

  private showWaveWarning(waveNum: number) {
    const level = LEVEL_CONFIGS.find(l => l.id === this.levelId);
    if (!level || waveNum > level.waves.length) return;

    const wave = level.waves[waveNum - 1];
    const enemyTypes: string[] = [];

    const enemyNames: Record<string, string> = {
      ronin: '浪人',
      archer: '弓箭手',
      longSpear: '长枪兵',
      vineArmor: '藤甲兵',
      sniper: '狙击手',
      boss: '头目',
    };

    wave.enemies.forEach(group => {
      const name = enemyNames[group.type] || group.type;
      if (!enemyTypes.includes(name)) {
        enemyTypes.push(name);
      }
    });

    this.effectsSystem.showWaveWarning(waveNum, enemyTypes, () => {
      this.waveSystem.startNextWave();
    });
  }

  private drawBattlefield(level: { id: number; name: string; multiLane: boolean; lanes: { id: string; spawnYMin: number; spawnYMax: number; riverY: number }[] }) {
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'level1_bg');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    if (level.multiLane && level.lanes.length > 1) {
      this.drawMultiLaneRivers(level.lanes);
    } else {
      this.drawRiver();
    }

    this.drawInkBorder();
    this.addLevelInfo(level);
  }

  private drawMultiLaneRivers(lanes: { id: string; riverY: number }[]) {
    const riverG = this.add.graphics();

    for (const lane of lanes) {
      riverG.fillStyle(COLORS.RIVER, 0.5);
      riverG.fillRoundedRect(HALF_FIELD_X - 6, lane.riverY - 3, 12, 6, 3);

      riverG.lineStyle(2, COLORS.INK_BROWN, 0.3);
      riverG.beginPath();
      riverG.moveTo(HALF_FIELD_X - 6, lane.riverY - 3);
      riverG.lineTo(HALF_FIELD_X - 6, lane.riverY + 3);
      riverG.strokePath();
      riverG.beginPath();
      riverG.moveTo(HALF_FIELD_X + 6, lane.riverY - 3);
      riverG.lineTo(HALF_FIELD_X + 6, lane.riverY + 3);
      riverG.strokePath();
    }

    const dividerG = this.add.graphics();
    dividerG.lineStyle(1, COLORS.INK_BROWN, 0.15);
    dividerG.beginPath();
    dividerG.moveTo(60, 280);
    dividerG.lineTo(964, 280);
    dividerG.strokePath();

    const topLabel = this.add.text(GAME_WIDTH - 80, lanes[0].riverY, '上路', {
      fontSize: '11px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5).setAlpha(0.5);

    const bottomLabel = this.add.text(GAME_WIDTH - 80, lanes[1].riverY, '下路', {
      fontSize: '11px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5).setAlpha(0.5);

    this.tweens.add({
      targets: riverG,
      alpha: { from: 0.5, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private drawRiver() {
    const riverG = this.add.graphics();
    riverG.fillStyle(COLORS.RIVER, 0.5);
    riverG.fillRoundedRect(HALF_FIELD_X - 6, BATTLEFIELD_TOP, 12, BATTLEFIELD_BOTTOM - BATTLEFIELD_TOP, 4);

    riverG.lineStyle(2, COLORS.INK_BROWN, 0.3);
    riverG.beginPath();
    riverG.moveTo(HALF_FIELD_X - 6, BATTLEFIELD_TOP);
    riverG.lineTo(HALF_FIELD_X - 6, BATTLEFIELD_BOTTOM);
    riverG.strokePath();
    riverG.beginPath();
    riverG.moveTo(HALF_FIELD_X + 6, BATTLEFIELD_TOP);
    riverG.lineTo(HALF_FIELD_X + 6, BATTLEFIELD_BOTTOM);
    riverG.strokePath();

    this.tweens.add({
      targets: riverG,
      alpha: { from: 0.5, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private drawInkBorder() {
    const borderG = this.add.graphics();
    borderG.lineStyle(3, COLORS.INK_BROWN, 0.8);
    borderG.strokeRect(10, 10, GAME_WIDTH - 20, GAME_HEIGHT - 20);

    borderG.lineStyle(1, COLORS.INK_BROWN, 0.4);
    borderG.strokeRect(15, 15, GAME_WIDTH - 30, GAME_HEIGHT - 30);

    this.drawCornerDecoration(20, 20);
    this.drawCornerDecoration(GAME_WIDTH - 20, 20, true);
    this.drawCornerDecoration(20, GAME_HEIGHT - 20, false, true);
    this.drawCornerDecoration(GAME_WIDTH - 20, GAME_HEIGHT - 20, true, true);
  }

  private drawCornerDecoration(x: number, y: number, flipX = false, flipY = false) {
    const g = this.add.graphics();
    g.lineStyle(2, COLORS.INK_BROWN, 0.6);

    const sx = flipX ? -1 : 1;
    const sy = flipY ? -1 : 1;

    g.beginPath();
    g.moveTo(x, y + 15 * sy);
    g.lineTo(x, y);
    g.lineTo(x + 15 * sx, y);
    g.strokePath();

    g.beginPath();
    g.moveTo(x + 5 * sx, y + 10 * sy);
    g.lineTo(x + 10 * sx, y);
    g.lineTo(x, y + 5 * sy);
    g.strokePath();
  }

  private addLevelInfo(level: { id: number; name: string }) {
    const bg = this.add.rectangle(700, 35, 260, 30, COLORS.PAPER_BG, 0.9);
    bg.setStrokeStyle(2, COLORS.INK_BROWN);

    this.levelText = this.add.text(700, 35, `第${this.getChineseNumber(level.id)}关 · ${level.name}`, {
      fontSize: '16px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5).setDepth(101);
  }

  private getChineseNumber(n: number): string {
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return nums[n] || String(n);
  }

  private createFlag() {
    this.flagSprite = this.add.container(FLAG_X, FLAG_Y);

    this.flagPole = this.add.rectangle(0, -25, 6, 90, 0x8B6914);
    this.flagPole.setStrokeStyle(1, COLORS.INK_BROWN);
    this.flagSprite.add(this.flagPole);

    if (this.textures.exists('flag')) {
      this.flagIcon = this.add.sprite(15, -45, 'flag');
    } else {
      const flagRect = this.add.rectangle(15, -45, 35, 25, COLORS.FLAG_RED);
      flagRect.setStrokeStyle(2, COLORS.INK_BROWN);
      this.flagSprite.add(flagRect);
    }
    if (this.flagIcon) {
      this.flagSprite.add(this.flagIcon);
    }

    const flagText = this.add.text(15, -45, '戚', {
      fontSize: '16px',
      color: '#F5A623',
      fontFamily: 'serif',
      stroke: '#4A3C2C',
      strokeThickness: 1,
    }).setOrigin(0.5);
    this.flagSprite.add(flagText);

    const base = this.add.ellipse(0, 20, 30, 10, 0x5A4A3A);
    this.flagSprite.add(base);

    if (this.flagIcon) {
      this.tweens.add({
        targets: this.flagIcon,
        x: 18,
        angle: 3,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private onUnitSelected(type: UnitType | null) {
    if (this.placementIndicator) {
      this.placementIndicator.destroy();
      this.placementIndicator = null;
    }
  }

  private setupBattlefieldClick() {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < BATTLEFIELD_TOP || pointer.y > BATTLEFIELD_BOTTOM) return;
      const selected = this.hud.getSelectedUnit();
      if (!selected) {
        if (this.placementIndicator) {
          this.placementIndicator.destroy();
          this.placementIndicator = null;
        }
        return;
      }

      const px = Math.max(100, Math.min(HALF_FIELD_X - 20, pointer.x));
      const py = Math.max(BATTLEFIELD_TOP + 20, Math.min(BATTLEFIELD_BOTTOM - 20, pointer.y));

      if (!this.placementIndicator) {
        this.placementIndicator = this.add.circle(px, py, 20, 0x50B89C, 0.3).setDepth(50);
        this.placementIndicator.setStrokeStyle(2, 0x50B89C, 0.8);
      } else {
        this.placementIndicator.setPosition(px, py);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.battleOver || this.isPaused) return;
      if (pointer.y < BATTLEFIELD_TOP || pointer.y > BATTLEFIELD_BOTTOM) return;

      const selectedType = this.hud.getSelectedUnit();
      if (!selectedType) return;

      if (pointer.x > HALF_FIELD_X) return;

      const config = UNIT_CONFIGS[selectedType];
      if (!this.resourceSystem.canAfford(config.cost)) return;

      const px = Math.max(100, Math.min(HALF_FIELD_X - 20, pointer.x));
      const py = Math.max(BATTLEFIELD_TOP + 20, Math.min(BATTLEFIELD_BOTTOM - 20, pointer.y));

      this.spawnUnit(selectedType, px, py);
      this.resourceSystem.spend(config.cost);
      this.hud.deselectUnit();

      this.showSpawnEffect(px, py);

      if (this.placementIndicator) {
        this.placementIndicator.destroy();
        this.placementIndicator = null;
      }
    });
  }

  private showSpawnEffect(x: number, y: number) {
    const circle = this.add.circle(x, y, 5, 0x50B89C, 0.8);
    this.tweens.add({
      targets: circle,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 300,
      onComplete: () => circle.destroy(),
    });
  }

  private spawnUnit(type: UnitType, x: number, y: number) {
    if (!this.canSpawnEntity()) {
      return null;
    }

    let unit: Unit;
    switch (type) {
      case 'shieldBearer':
        unit = new ShieldBearer(this, x, y);
        break;
      case 'spearman':
        unit = new Spearman(this, x, y);
        break;
      case 'wolfSoldier':
        unit = new WolfSoldier(this, x, y);
        break;
      case 'forkGuard':
        unit = new ForkGuard(this, x, y);
        break;
      case 'firearmsUnit':
        unit = new FirearmsUnit(this, x, y);
        break;
      default:
        unit = new ShieldBearer(this, x, y);
    }
    this.units.push(unit);
    return unit;
  }

  update(time: number, delta: number) {
    if (this.battleOver || this.isPaused) return;

    const timeScale = this.effectsSystem.getTimeScale();
    const scaledDelta = delta * timeScale;

    this.combatSystem.update(time, scaledDelta);
    this.effectsSystem.update(time, delta);

    if (this.performanceMonitor.isEnabled()) {
      this.performanceMonitor.update(time, delta);
      this.performanceMonitor.setEntityCount(this.units.length + this.enemies.length);
      const tweens = (this.tweens as unknown as { getAllTweens?: () => unknown[] }).getAllTweens;
      if (tweens) {
        this.performanceMonitor.setTweenCount(tweens.call(this.tweens).length);
      }
    }

    this.checkFlagDamage();
    this.collectRewards();
    this.combatSystem.removeDeadEntities();

    const victory = this.waveSystem.checkWaveComplete(this.enemies.length);
    if (victory) {
      this.endBattle(true);
      return;
    }

    if (this.flagHp <= 0) {
      this.endBattle(false);
      return;
    }

    this.hud.updateFlagHp(this.flagHp, FLAG_HP);
  }

  private checkFlagDamage() {
    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      if (enemy.hasReachedFlag()) {
        this.flagHp -= enemy.attackDamage * 0.3;
        enemy.takeDamage(999);
        this.showFlagDamageEffect();
      }
    }
  }

  private showFlagDamageEffect() {
    this.cameras.main.flash(200, 139, 42, 28, true);

    if (this.flagSprite) {
      this.tweens.add({
        targets: this.flagSprite,
        x: FLAG_X - 5,
        angle: -5,
        duration: 50,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.flagSprite.angle = 0;
        },
      });
    }

    if (this.flagIcon) {
      this.flagIcon.setTint(0xff6666);
      this.time.delayedCall(200, () => {
        if (this.flagIcon) this.flagIcon.setTint(0xffffff);
      });
    }
  }

  private collectRewards() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.isDead && enemy.reward > 0) {
        this.resourceSystem.addGold(enemy.reward);
        this.enemiesDefeated++;
        this.showGoldEffect(enemy.x, enemy.y, enemy.reward);
        enemy.reward = 0;
      }
    }
  }

  private showGoldEffect(x: number, y: number, amount: number) {
    const text = this.add.text(x, y - 20, `+${amount}`, {
      fontSize: '16px',
      color: '#F5A623',
      fontFamily: 'serif',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    const coin = this.add.circle(x, y, 8, 0xF5A623, 0.9).setDepth(199);
    this.tweens.add({
      targets: coin,
      y: y - 30,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 600,
      onComplete: () => coin.destroy(),
    });
  }

  private endBattle(victory: boolean) {
    this.battleOver = true;
    this.resourceSystem.stop();

    if (this.flagGuardTimer) {
      this.flagGuardTimer.remove();
      this.flagGuardTimer = null;
    }

    if (this.performanceMonitor) {
      this.performanceMonitor.destroy();
    }

    if (victory) {
      this.checkAchievements();
    }

    const result: BattleResult = {
      victory,
      levelId: this.levelId,
      flagHpRemaining: Math.max(0, Math.ceil(this.flagHp)),
      enemiesDefeated: this.enemiesDefeated,
    };

    this.time.delayedCall(1500, () => {
      this.scene.start('ResultScene', result);
    });
  }

  private checkAchievements() {
    try {
      const completed = this.getCompletedLevels();
      if (!completed.includes(this.levelId)) {
        completed.push(this.levelId);
      }
      localStorage.setItem('qiji_completed_levels', JSON.stringify(completed));

      const achievements: string[] = [];
      if (completed.includes(1) && completed.includes(2) && completed.includes(3)) {
        achievements.push('firstGlory');
      }
      if (completed.includes(4) && completed.includes(5) && completed.includes(6)) {
        achievements.push('mandarinDuck');
      }
      if (completed.includes(7) && completed.includes(8) && completed.includes(9)) {
        achievements.push('taizhouVictory');
      }
      if (completed.length >= 9) {
        achievements.push('qiTiger');
      }

      const existing = JSON.parse(localStorage.getItem('qiji_achievements') || '[]') as string[];
      for (const a of achievements) {
        if (!existing.includes(a)) {
          existing.push(a);
        }
      }
      localStorage.setItem('qiji_achievements', JSON.stringify(existing));
    } catch {}
  }

  private getCompletedLevels(): number[] {
    try {
      const saved = localStorage.getItem('qiji_completed_levels');
      if (saved) return JSON.parse(saved) as number[];
    } catch {}
    return [];
  }
}
