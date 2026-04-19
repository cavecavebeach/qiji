import { Unit } from '../base/Unit';
import { UNIT_CONFIGS } from '../../data/units';
import { Enemy } from '../base/Enemy';
import type { ArmorType } from '../../types';

export class FirearmsUnit extends Unit {
  isAiming: boolean;
  aimStartTime: number;
  aimDuration: number;
  aimInterrupted: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, UNIT_CONFIGS.firearmsUnit);
    this.isAiming = false;
    this.aimStartTime = 0;
    this.aimDuration = 1500;
    this.aimInterrupted = false;
  }

  update(time: number, delta: number, enemies?: Enemy[], allies?: Unit[]) {
    if (this.isDead) return;

    if (this.isAiming) {
      this.updateAim(time);
      return;
    }

    super.update(time, delta, enemies, allies);
  }

  private updateAim(time: number) {
    if (!this.target || this.target.isDead) {
      this.cancelAim();
      this.state = 'moving';
      return;
    }

    const aimElapsed = time - this.aimStartTime;
    if (aimElapsed >= this.aimDuration) {
      this.fireShot(time);
    }
  }

  tryAttack(time: number) {
    if (this.isAiming) return;
    if (!this.target || this.target.isDead) return;

    this.startAim(time);
  }

  private startAim(time: number) {
    this.isAiming = true;
    this.aimStartTime = time;
    this.aimInterrupted = false;
    this.state = 'attacking';

    this.showAimEffect();
  }

  private cancelAim() {
    this.isAiming = false;
    this.aimInterrupted = false;
  }

  interruptAim() {
    if (!this.isAiming) return;
    this.isAiming = false;
    this.aimInterrupted = true;
    this.state = 'moving';
    this.target = null;
  }

  takeDamage(amount: number, isCrit: boolean = false) {
    super.takeDamage(amount, isCrit);
    if (this.isAiming) {
      this.interruptAim();
    }
  }

  private fireShot(time: number) {
    if (!this.target || this.target.isDead) {
      this.cancelAim();
      this.state = 'moving';
      return;
    }

    this.isAiming = false;
    this.lastAttackTime = time;

    const damage = this.calculateDamage(this.target.armorType);
    this.showBulletEffect(this.target.x, this.target.y);
    this.target.takeDamage(damage, damage >= 30);
    this.target.showDamageNumber(damage, damage >= 30);

    this.showRecoilEffect();
  }

  calculateDamage(targetArmor?: ArmorType): number {
    if (!targetArmor) return this.attackDamage;

    switch (targetArmor) {
      case 'none':
      case 'light':
        return 999;
      case 'heavy':
        return 30;
      default:
        return this.attackDamage;
    }
  }

  private showAimEffect() {
    if (!this.sprite) return;

    const aimLine = this.scene.add.graphics();
    aimLine.lineStyle(1, 0xFFFF00, 0.4);
    aimLine.setDepth(90);

    const updateLine = () => {
      if (!this.isAiming || !this.target || this.isDead) {
        aimLine.destroy();
        return;
      }
      aimLine.clear();
      aimLine.lineStyle(1, 0xFFFF00, 0.4);
      aimLine.beginPath();
      aimLine.moveTo(this.x + 15, this.y);
      aimLine.lineTo(this.target.x, this.target.y);
      aimLine.strokePath();
    };

    const timer = this.scene.time.addEvent({
      delay: 50,
      callback: updateLine,
      repeat: 30,
    });

    this.scene.time.delayedCall(this.aimDuration, () => {
      aimLine.destroy();
      timer.remove();
    });
  }

  private showBulletEffect(targetX: number, targetY: number) {
    const bullet = this.scene.add.sprite(this.x + 15, this.y, 'bullet');
    bullet.setDepth(150);

    this.scene.tweens.add({
      targets: bullet,
      x: targetX,
      y: targetY,
      duration: 150,
      ease: 'Linear',
      onComplete: () => bullet.destroy(),
    });

    const muzzleFlash = this.scene.add.circle(this.x + 20, this.y, 8, 0xFFFF00, 0.9);
    muzzleFlash.setDepth(151);
    this.scene.tweens.add({
      targets: muzzleFlash,
      alpha: 0,
      scaleX: 3,
      scaleY: 3,
      duration: 150,
      onComplete: () => muzzleFlash.destroy(),
    });
  }

  private showRecoilEffect() {
    if (!this.sprite) return;

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.x - 5,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
    });
  }
}
