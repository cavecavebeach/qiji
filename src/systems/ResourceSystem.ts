export class ResourceSystem {
  private gold: number;
  private scene: Phaser.Scene;
  private goldTimer: Phaser.Time.TimerEvent | null;
  private onGoldChange: ((gold: number) => void) | null;
  private goldRate: number;
  private tickInterval: number;

  constructor(scene: Phaser.Scene, initialGold: number, goldRate: number = 0.5, onGoldChange?: (gold: number) => void) {
    this.scene = scene;
    this.gold = initialGold;
    this.goldRate = goldRate;
    this.tickInterval = 500;
    this.onGoldChange = onGoldChange || null;
    this.goldTimer = null;
  }

  start() {
    const goldPerTick = this.goldRate * (this.tickInterval / 1000);
    this.goldTimer = this.scene.time.addEvent({
      delay: this.tickInterval,
      callback: () => {
        this.gold += goldPerTick;
        this.notifyChange();
      },
      loop: true,
    });
  }

  stop() {
    if (this.goldTimer) {
      this.goldTimer.remove();
      this.goldTimer = null;
    }
  }

  addGold(amount: number) {
    this.gold += amount;
    this.notifyChange();
  }

  spend(amount: number): boolean {
    if (this.gold < amount) return false;
    this.gold -= amount;
    this.notifyChange();
    return true;
  }

  getGold(): number {
    return Math.floor(this.gold);
  }

  canAfford(cost: number): boolean {
    return this.gold >= cost;
  }

  private notifyChange() {
    if (this.onGoldChange) {
      this.onGoldChange(this.getGold());
    }
  }
}
