import Phaser from 'phaser';
import { COLORS } from '../utils/Constants';

export class EffectsSystem {
  private scene: Phaser.Scene;
  private comboCount: number;
  private comboTimer: number;
  private comboText: Phaser.GameObjects.Text | null;
  private lastKillTime: number;
  private slowMotionFactor: number;
  private isSlowMotion: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboText = null;
    this.lastKillTime = 0;
    this.slowMotionFactor = 1;
    this.isSlowMotion = false;
  }

  update(time: number, delta: number) {
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }

    if (this.isSlowMotion) {
      this.slowMotionFactor = Phaser.Math.Linear(this.slowMotionFactor, 1, 0.05);
      if (Math.abs(this.slowMotionFactor - 1) < 0.01) {
        this.slowMotionFactor = 1;
        this.isSlowMotion = false;
      }
    }
  }

  getTimeScale(): number {
    return this.slowMotionFactor;
  }

  screenShake(intensity: number = 3, duration: number = 100) {
    this.scene.cameras.main.shake(duration, intensity / 100);
  }

  screenFlash(color: number = 0xffffff, duration: number = 100) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    this.scene.cameras.main.flash(duration, r, g, b, true);
  }

  hitStop(duration: number = 50) {
    this.scene.physics?.world?.pause();
    this.scene.time.delayedCall(duration, () => {
      this.scene.physics?.world?.resume();
    });
  }

  createImpactEffect(x: number, y: number, color: number = 0xffffff, scale: number = 1) {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 30 + Math.random() * 40;
      const px = x + Math.cos(angle) * 10;
      const py = y + Math.sin(angle) * 10;
      
      const particle = this.scene.add.circle(px, py, 3 * scale, color, 0.9);
      particle.setDepth(150);
      
      this.scene.tweens.add({
        targets: particle,
        x: px + Math.cos(angle) * speed,
        y: py + Math.sin(angle) * speed,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 300 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }

    const ring = this.scene.add.circle(x, y, 10, color, 0);
    ring.setStrokeStyle(3, color, 0.8);
    ring.setDepth(149);
    
    this.scene.tweens.add({
      targets: ring,
      scaleX: 3 * scale,
      scaleY: 3 * scale,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });
  }

  createDeathExplosion(x: number, y: number, color: number = 0xff4444, size: 'small' | 'medium' | 'large' = 'medium') {
    const particleCount = size === 'small' ? 12 : size === 'medium' ? 20 : 30;
    const explosionScale = size === 'small' ? 1 : size === 'medium' ? 1.5 : 2;
    
    const flash = this.scene.add.circle(x, y, 30 * explosionScale, 0xffffff, 0.8);
    flash.setDepth(200);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 150,
      onComplete: () => flash.destroy(),
    });

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = (50 + Math.random() * 80) * explosionScale;
      const particleColor = Math.random() > 0.5 ? color : 0xffaa00;
      const size = 4 + Math.random() * 6;
      
      const particle = this.scene.add.circle(x, y, size, particleColor, 1);
      particle.setDepth(199);
      
      const gravity = 200;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      this.scene.tweens.add({
        targets: particle,
        x: x + vx * 0.5,
        y: y + vy * 0.5 + gravity * 0.25,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 400 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }

    const shockwave = this.scene.add.circle(x, y, 20, 0xffffff, 0);
    shockwave.setStrokeStyle(4, color, 0.9);
    shockwave.setDepth(198);
    
    this.scene.tweens.add({
      targets: shockwave,
      scaleX: 5 * explosionScale,
      scaleY: 5 * explosionScale,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => shockwave.destroy(),
    });

    this.triggerSlowMotion(0.3, 200);
    this.screenShake(4, 120);
    this.addCombo();
  }

  triggerSlowMotion(targetScale: number = 0.3, duration: number = 200) {
    this.isSlowMotion = true;
    this.slowMotionFactor = targetScale;
    
    this.scene.time.delayedCall(duration, () => {
      this.isSlowMotion = false;
    });
  }

  addCombo() {
    const now = this.scene.time.now;
    if (now - this.lastKillTime < 1500) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastKillTime = now;
    this.comboTimer = 2000;

    this.showComboText();
  }

  private showComboText() {
    if (this.comboCount < 2) return;

    if (this.comboText) {
      this.comboText.destroy();
    }

    const cx = this.scene.cameras.main.width / 2;
    const cy = this.scene.cameras.main.height / 3;

    const comboTexts = ['连击!', '双杀!', '三连击!', '四连击!', '五连击!', '大杀特杀!', '无敌!'];
    const text = comboTexts[Math.min(this.comboCount - 2, comboTexts.length - 1)];
    
    const colors = ['#FFFFFF', '#F5A623', '#FF6B35', '#FF4444', '#FF0000', '#FFD700', '#FF1493'];
    const color = colors[Math.min(this.comboCount - 2, colors.length - 1)];

    this.comboText = this.scene.add.text(cx, cy, `${this.comboCount} ${text}`, {
      fontSize: `${32 + Math.min(this.comboCount * 4, 24)}px`,
      color: color,
      fontFamily: 'serif',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(300);

    this.scene.tweens.add({
      targets: this.comboText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: this.comboText,
      y: cy - 30,
      alpha: 0,
      duration: 800,
      delay: 400,
      ease: 'Power2',
      onComplete: () => {
        if (this.comboText) {
          this.comboText.destroy();
          this.comboText = null;
        }
      },
    });
  }

  private resetCombo() {
    this.comboCount = 0;
    if (this.comboText) {
      this.comboText.destroy();
      this.comboText = null;
    }
  }

  createSlashEffect(x: number, y: number, angle: number = 0, color: number = 0xffffff) {
    const slash = this.scene.add.graphics();
    slash.setDepth(160);
    
    const length = 40;
    const width = 3;
    
    slash.lineStyle(width, color, 0.9);
    slash.beginPath();
    slash.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
    slash.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    slash.strokePath();

    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      ease: 'Power2',
      onComplete: () => slash.destroy(),
    });
  }

  createCriticalHitEffect(x: number, y: number, damage: number) {
    this.screenShake(5, 150);
    this.createImpactEffect(x, y, 0xffd700, 1.5);
    
    const critText = this.scene.add.text(x, y - 40, '暴击!', {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'serif',
      stroke: '#8B0000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(250);

    this.scene.tweens.add({
      targets: critText,
      y: y - 80,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => critText.destroy(),
    });
  }

  showWaveWarning(waveNumber: number, enemyTypes: string[], callback?: () => void) {
    const cx = this.scene.cameras.main.width / 2;
    const cy = this.scene.cameras.main.height / 2;

    const overlay = this.scene.add.rectangle(cx, cy, 800, 600, 0x000000, 0.6);
    overlay.setDepth(400);

    const panel = this.scene.add.rectangle(cx, cy, 400, 200, COLORS.PAPER_BG, 0.95);
    panel.setStrokeStyle(3, COLORS.INK_BROWN);
    panel.setDepth(401);

    const warningText = this.scene.add.text(cx, cy - 60, `第 ${waveNumber} 波敌人即将来袭!`, {
      fontSize: '28px',
      color: '#D0021B',
      fontFamily: 'serif',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(402);

    let enemyTypeText = '敌人类型: ';
    if (enemyTypes.length > 0) {
      enemyTypeText += enemyTypes.join(', ');
    } else {
      enemyTypeText += '未知';
    }

    const enemyTypeLabel = this.scene.add.text(cx, cy - 10, enemyTypeText, {
      fontSize: '18px',
      color: '#4A3C2C',
      fontFamily: 'serif',
    }).setOrigin(0.5).setDepth(402);

    const countdownText = this.scene.add.text(cx, cy + 40, '3', {
      fontSize: '48px',
      color: '#F5A623',
      fontFamily: 'serif',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(402);

    let count = 3;
    const countdownTimer = this.scene.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        count--;
        countdownText.setText(String(count));
        this.scene.tweens.add({
          targets: countdownText,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 100,
          yoyo: true,
        });
      },
    });

    this.scene.time.delayedCall(3000, () => {
      overlay.destroy();
      panel.destroy();
      warningText.destroy();
      enemyTypeLabel.destroy();
      countdownText.destroy();
      countdownTimer.remove();
      if (callback) callback();
    });

    this.scene.tweens.add({
      targets: [overlay, panel],
      alpha: { from: 0, to: 1 },
      duration: 200,
    });
  }
}
