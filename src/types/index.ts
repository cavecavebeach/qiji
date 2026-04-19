export type EntityState = 'idle' | 'moving' | 'attacking' | 'dead';

export type UnitType = 'shieldBearer' | 'spearman' | 'wolfSoldier' | 'forkGuard' | 'firearmsUnit';

export type EnemyType = 'ronin' | 'longSpear' | 'archer' | 'vineArmor' | 'sniper' | 'boss';

export type ArmorType = 'none' | 'light' | 'heavy';

export type LaneId = 'top' | 'bottom';

export interface EntityConfig {
  hp: number;
  speed: number;
  attackDamage: number;
  attackRange: number;
  attackSpeed: number;
  armorType: ArmorType;
}

export interface UnitConfig extends EntityConfig {
  type: UnitType;
  cost: number;
  color: number;
  width: number;
  height: number;
}

export interface EnemyConfig extends EntityConfig {
  type: EnemyType;
  reward: number;
  color: number;
  width: number;
  height: number;
}

export interface WaveEnemyGroup {
  type: EnemyType;
  count: number;
  delay: number;
  lane?: LaneId;
}

export interface WaveConfig {
  enemies: WaveEnemyGroup[];
}

export interface LaneConfig {
  id: LaneId;
  spawnYMin: number;
  spawnYMax: number;
  riverY: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  initialGold: number;
  waves: WaveConfig[];
  availableUnits: UnitType[];
  multiLane: boolean;
  lanes: LaneConfig[];
  goldRate: number;
  historicalNote: string;
}

export interface BattleResult {
  victory: boolean;
  levelId: number;
  flagHpRemaining: number;
  enemiesDefeated: number;
}

export interface WaveState {
  currentWave: number;
  totalWaves: number;
  isComplete: boolean;
  allWavesSpawned: boolean;
}

export interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  condition: (progress: AchievementProgress) => boolean;
}

export interface AchievementProgress {
  levelsCompleted: number[];
  totalVictories: number;
}
