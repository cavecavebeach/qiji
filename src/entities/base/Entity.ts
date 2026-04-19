import Phaser from 'phaser';
import type { EntityState, ArmorType } from '../../types';
import { COLORS } from '../../utils/Constants';

export class Entity {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  attackDamage: number;
  attackRange: number;
  attackSpeed: number;
  armorType: ArmorType;
  state: EntityState;
  sprite: Phaser.GameObjects.Container | null;
  body: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle | null;
  hpBarBg: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle | null;
  hpBarFill: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle | null;
  lastAttackTime: number;
  scene: Phaser.Scene;
  isDead: boolean;
  textureKey: string;
  shadow: Phaser.GameObjects.Ellipse | null;

  constructor(scene: Phaser.Scene, x: number, y: number, hp: number, speed: number, attackDamage: number, attackRange: number, attackSpeed: number, armorType: ArmorType) {
    this.id = Phaser.Utils.String.UUID();
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.attackDamage = attackDamage;
    this.attackRange = attackRange;
    this.attackSpeed = attackSpeed;
    this.armorType = armorType;
    this.state = 'idle';
    this.sprite = null;
    this.body = null;
    this.hpBarBg = null;
    this.hpBarFill = null;
    this.lastAttackTime = 0;
    this.scene = scene;
    this.isDead = false;
    this.textureKey = '';
    this.shadow = null;
  }

  createVisuals(color: number, width: number, height: number) {
    this.sprite = this.scene.add.container(this.x, this.y);

    this.shadow = this.scene.add.ellipse(0, height / 2 - 2, width * 0.8, 8, 0x000000, 0.2);
    this.sprite.add(this.shadow);

    if (this.scene.textures.exists(this.textureKey)) {
      this.body = this.scene.add.sprite(0, 0, this.textureKey);
    } else {
      this.body = this.scene.add.rectangle(0, 0, width, height, color);
      this.addInkOutline(this.body as Phaser.GameObjects.Rectangle, width, height);
    }
    this.sprite.add(this.body);

    if (this.scene.textures.exists('hp_bar_bg')) {
      this.hpBarBg = this.scene.add.sprite(0, -height / 2 - 8, 'hp_bar_bg');
      this.hpBarFill = this.scene.add.sprite(-17, -height / 2 - 8, 'hp_bar_fill').setOrigin(0, 0.5);
    } else {
      this.hpBarBg = this.scene.add.rectangle(0, -height / 2 - 8, 36, 5, 0x333333).setStrokeStyle(1, COLORS.INK_BROWN);
      this.hpBarFill = this.scene.add.rectangle(-17, -height / 2 - 8, 34, 3, COLORS.HP_GREEN).setOrigin(0, 0.5);
    }
    this.sprite.add(this.hpBarBg);
    this.sprite.add(this.hpBarFill);

    this.addIdleAnimation();
  }

  private addInkOutline(rect: Phaser.GameObjects.Rectangle, width: number, height: number) {
    rect.setStrokeStyle(2, COLORS.INK_BROWN);
  }

  private addIdleAnimation() {
    if (!this.sprite) return;

    this.scene.tweens.add({
      targets: this.sprite,
      y: this.y - 2,
      duration: 800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    if (this.shadow) {
      this.scene.tweens.add({
        targets: this.shadow,
        scaleX: 0.9,
        alpha: 0.15,
        duration: 800 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  update(time: number, delta: number, ..._args: unknown[]) {
    if (this.isDead) return;
    this.updateHpBar();
  }

  takeDamage(amount: number, isCrit: boolean = false) {
    if (this.isDead) return;
    this.hp = Math.max(0, this.hp - amount);
    this.showDamageEffect(isCrit);
    if (this.hp <= 0) {
      this.die();
    }
  }

  protected showDamageEffect(isCrit: boolean = false) {
    if (!this.sprite) return;

    const shakeIntensity = isCrit ? 8 : 4;
    const shakeDuration = isCrit ? 150 : 80;
    
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.x + Phaser.Math.Between(-shakeIntensity, shakeIntensity),
      y: this.y + Phaser.Math.Between(-shakeIntensity / 2, shakeIntensity / 2),
      duration: shakeDuration / 3,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (this.sprite) this.sprite.setPosition(this.x, this.y);
      },
    });

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.4,
      duration: 30,
      yoyo: true,
      repeat: 1,
    });

    if (this.body && this.body instanceof Phaser.GameObjects.Sprite) {
      const originalTint = 0xffffff;
      this.body.setTint(0xff3333);
      this.scene.time.delayedCall(isCrit ? 150 : 80, () => {
        if (this.body && !this.isDead && this.body instanceof Phaser.GameObjects.Sprite) {
          this.body.setTint(originalTint);
        }
      });
    }

    if (this.body) {
      const flash = this.scene.add.ellipse(this.x, this.y, 50, 50, 0xff0000, 0.5);
      flash.setDepth(90);
      this.scene.tweens.add({
        targets: flash,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 150,
        onComplete: () => flash.destroy(),
      });
    }
  }

  die() {
    this.isDead = true;
    this.state = 'dead';
    
    this.createDeathEffect();
    
    if (this.sprite) {
      this.scene.tweens.killTweensOf(this.sprite);

      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        y: this.sprite.y + 20,
        scaleX: 0.7,
        scaleY: 0.2,
        angle: Phaser.Math.Between(-20, 20),
        duration: 350,
        ease: 'Power3',
        onComplete: () => {
          this.sprite?.destroy();
        },
      });

      if (this.shadow) {
        this.scene.tweens.add({
          targets: this.shadow,
          alpha: 0,
          scaleX: 1.5,
          duration: 350,
        });
      }
    }
  }

  private createDeathEffect() {
    const particleCount = 15;
    const colors = [0xff4444, 0xff6600, 0xffaa00, 0x8b0000];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const speed = 40 + Math.random() * 60;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 5;
      
      const particle = this.scene.add.circle(this.x, this.y, size, color, 1);
      particle.setDepth(95);
      
      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * speed,
        y: this.y + Math.sin(angle) * speed + 30,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 400 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }

    const shockwave = this.scene.add.circle(this.x, this.y, 10, 0xff4444, 0);
    shockwave.setStrokeStyle(3, 0xff4444, 0.8);
    shockwave.setDepth(94);
    
    this.scene.tweens.add({
      targets: shockwave,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => shockwave.destroy(),
    });

    const flash = this.scene.add.circle(this.x, this.y, 25, 0xffffff, 0.7);
    flash.setDepth(96);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 150,
      onComplete: () => flash.destroy(),
    });
  }

  updateHpBar() {
    if (!this.hpBarFill || !this.sprite) return;
    const ratio = this.hp / this.maxHp;

    if (this.hpBarFill instanceof Phaser.GameObjects.Sprite) {
      this.hpBarFill.setScale(ratio, 1);

      if (ratio > 0.5) {
        this.hpBarFill.setTexture('hp_bar_fill');
      } else if (ratio > 0.25) {
        this.hpBarFill.setTexture('hp_bar_mid');
      } else {
        this.hpBarFill.setTexture('hp_bar_low');
      }
    } else {
      this.hpBarFill.width = 34 * ratio;
      const color = ratio > 0.5 ? COLORS.HP_GREEN : ratio > 0.25 ? 0xF5A623 : COLORS.HP_RED;
      this.hpBarFill.setFillStyle(color);
    }
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    if (this.sprite) {
      this.sprite.setPosition(x, y);
    }
  }

  showAttackEffect(targetX?: number, targetY?: number, effectColor = 0xFFFFFF, isHeavy: boolean = false) {
    const tx = targetX ?? this.x + 20;
    const ty = targetY ?? this.y;

    const impactScale = isHeavy ? 1.5 : 1;
    
    const effect = this.scene.add.circle(tx, ty, 10 * impactScale, effectColor, 0.9);
    effect.setDepth(100);

    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scaleX: 3 * impactScale,
      scaleY: 3 * impactScale,
      duration: isHeavy ? 350 : 200,
      ease: 'Power2',
      onComplete: () => effect.destroy(),
    });

    const slashCount = isHeavy ? 3 : 1;
    for (let i = 0; i < slashCount; i++) {
      const slash = this.scene.add.graphics();
      const lineWidth = isHeavy ? 5 : 3;
      slash.lineStyle(lineWidth, effectColor, 0.9);
      
      const offset = (i - 1) * 8;
      const angle1 = Math.random() * Math.PI;
      const angle2 = angle1 + Math.PI;
      const length = 15 + Math.random() * 10;
      
      slash.beginPath();
      slash.moveTo(tx + Math.cos(angle1) * length, ty + Math.sin(angle1) * length + offset);
      slash.lineTo(tx + Math.cos(angle2) * length, ty + Math.sin(angle2) * length + offset);
      slash.strokePath();
      slash.setDepth(100);

      this.scene.tweens.add({
        targets: slash,
        alpha: 0,
        duration: isHeavy ? 250 : 120,
        delay: i * 30,
        onComplete: () => slash.destroy(),
      });
    }

    const particleCount = isHeavy ? 8 : 4;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 20 + Math.random() * 30;
      const particle = this.scene.add.circle(tx, ty, 2 + Math.random() * 3, effectColor, 0.8);
      particle.setDepth(99);
      
      this.scene.tweens.add({
        targets: particle,
        x: tx + Math.cos(angle) * speed,
        y: ty + Math.sin(angle) * speed,
        alpha: 0,
        duration: 200 + Math.random() * 100,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  showDamageNumber(damage: number, isCrit = false) {
    const color = isCrit ? '#F5A623' : '#FFFFFF';
    const size = isCrit ? '18px' : '14px';

    const text = this.scene.add.text(this.x, this.y - 30, `${Math.floor(damage)}`, {
      fontSize: size,
      color: color,
      fontFamily: 'serif',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(200);

    this.scene.tweens.add({
      targets: text,
      y: this.y - 60,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });
  }

  getDistanceTo(target: Entity): number {
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
