import type { LevelConfig } from '../types';

const SINGLE_LANE = [
  { id: 'top' as const, spawnYMin: 120, spawnYMax: 440, riverY: 280 },
];

const MULTI_LANE = [
  { id: 'top' as const, spawnYMin: 100, spawnYMax: 250, riverY: 175 },
  { id: 'bottom' as const, spawnYMin: 310, spawnYMax: 460, riverY: 385 },
];

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: '宁海之战',
    subtitle: '戚继光首摆鸳鸯阵',
    initialGold: 8,
    availableUnits: ['shieldBearer', 'spearman'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '嘉靖四十年四月，戚继光首摆鸳鸯阵，于宁海歼敌数百，己方无一阵亡，鸳鸯阵一战成名。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 2, delay: 1200 },
          { type: 'archer', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 1000 },
          { type: 'archer', count: 3, delay: 1500 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '新河之战',
    subtitle: '戚夫人空城计',
    initialGold: 6,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '新河兵力空虚，戚夫人王氏巧施空城计，援军内外夹击，歼敌五百余。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1500 },
          { type: 'longSpear', count: 1, delay: 3000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 2, delay: 1200 },
          { type: 'longSpear', count: 2, delay: 2000 },
          { type: 'archer', count: 1, delay: 2500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'archer', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800 },
          { type: 'longSpear', count: 3, delay: 1200 },
          { type: 'archer', count: 2, delay: 1800 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '花街之战',
    subtitle: '星夜驰援大破倭寇',
    initialGold: 12,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '戚继光星夜驰援花街，斩首三百零八级，倭寇闻风丧胆。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 1200 },
          { type: 'archer', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'archer', count: 3, delay: 1800 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 800 },
          { type: 'longSpear', count: 2, delay: 1200 },
          { type: 'archer', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'archer', count: 3, delay: 1500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 600 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'archer', count: 4, delay: 1200 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '上峰岭之战',
    subtitle: '伏击全歼两千倭寇',
    initialGold: 10,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '上峰岭设伏，全歼两千余名倭寇，鸳鸯阵攻防一体尽显威力。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1200 },
          { type: 'vineArmor', count: 1, delay: 3000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'vineArmor', count: 1, delay: 2500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800 },
          { type: 'longSpear', count: 2, delay: 1200 },
          { type: 'vineArmor', count: 2, delay: 2000 },
          { type: 'archer', count: 2, delay: 1800 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 700 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'vineArmor', count: 2, delay: 1500 },
          { type: 'archer', count: 3, delay: 1200 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 600 },
          { type: 'longSpear', count: 3, delay: 800 },
          { type: 'vineArmor', count: 3, delay: 1200 },
          { type: 'archer', count: 3, delay: 1000 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: '披山之战',
    subtitle: '分兵合击破敌',
    initialGold: 10,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: true,
    lanes: MULTI_LANE,
    goldRate: 0.7,
    historicalNote: '披山阻击战，戚家军分兵合击，上下夹攻大破倭寇。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 2, delay: 1500, lane: 'top' },
          { type: 'ronin', count: 2, delay: 1500, lane: 'bottom' },
          { type: 'archer', count: 1, delay: 2500, lane: 'top' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1200, lane: 'top' },
          { type: 'longSpear', count: 1, delay: 2000, lane: 'bottom' },
          { type: 'archer', count: 2, delay: 1800, lane: 'top' },
          { type: 'ronin', count: 2, delay: 1500, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1000, lane: 'top' },
          { type: 'ronin', count: 3, delay: 1000, lane: 'bottom' },
          { type: 'longSpear', count: 2, delay: 1500, lane: 'top' },
          { type: 'vineArmor', count: 1, delay: 2500, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800, lane: 'top' },
          { type: 'ronin', count: 3, delay: 900, lane: 'bottom' },
          { type: 'longSpear', count: 2, delay: 1200, lane: 'top' },
          { type: 'archer', count: 2, delay: 1500, lane: 'bottom' },
          { type: 'vineArmor', count: 1, delay: 2000, lane: 'top' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 600, lane: 'top' },
          { type: 'ronin', count: 4, delay: 700, lane: 'bottom' },
          { type: 'longSpear', count: 2, delay: 1000, lane: 'top' },
          { type: 'longSpear', count: 2, delay: 1000, lane: 'bottom' },
          { type: 'archer', count: 3, delay: 1200, lane: 'top' },
          { type: 'vineArmor', count: 2, delay: 1500, lane: 'bottom' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '洋坑之战',
    subtitle: '冒雨追击水陆夹击',
    initialGold: 10,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '冒雨追击，水陆夹击大破倭寇，镋钯兵护卫后排抵挡狙击。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 3, delay: 1200 },
          { type: 'sniper', count: 1, delay: 3000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'sniper', count: 1, delay: 2500 },
          { type: 'archer', count: 2, delay: 1800 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800 },
          { type: 'sniper', count: 2, delay: 2000 },
          { type: 'vineArmor', count: 1, delay: 2500 },
          { type: 'archer', count: 2, delay: 1500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 700 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'sniper', count: 2, delay: 1500 },
          { type: 'vineArmor', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 600 },
          { type: 'longSpear', count: 3, delay: 800 },
          { type: 'sniper', count: 3, delay: 1200 },
          { type: 'archer', count: 3, delay: 1000 },
          { type: 'vineArmor', count: 2, delay: 1500 },
        ],
      },
    ],
  },
  {
    id: 7,
    name: '藤岭之战',
    subtitle: '山林追击阵型全歼',
    initialGold: 12,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '山林追击战，保持阵型完整，全歼残敌，鸳鸯阵配合天衣无缝。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'archer', count: 2, delay: 2000 },
          { type: 'sniper', count: 1, delay: 2500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 800 },
          { type: 'longSpear', count: 3, delay: 1200 },
          { type: 'vineArmor', count: 2, delay: 1500 },
          { type: 'archer', count: 3, delay: 1000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 700 },
          { type: 'sniper', count: 2, delay: 1200 },
          { type: 'vineArmor', count: 2, delay: 1500 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'archer', count: 2, delay: 1800 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 600 },
          { type: 'longSpear', count: 3, delay: 800 },
          { type: 'sniper', count: 2, delay: 1200 },
          { type: 'vineArmor', count: 3, delay: 1000 },
          { type: 'archer', count: 3, delay: 900 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 7, delay: 500 },
          { type: 'longSpear', count: 4, delay: 700 },
          { type: 'sniper', count: 3, delay: 1000 },
          { type: 'vineArmor', count: 3, delay: 800 },
          { type: 'archer', count: 4, delay: 600 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 8, delay: 400 },
          { type: 'longSpear', count: 4, delay: 600 },
          { type: 'sniper', count: 3, delay: 800 },
          { type: 'vineArmor', count: 4, delay: 700 },
          { type: 'archer', count: 4, delay: 500 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: '长沙之战',
    subtitle: '三路攻敌巢擒斩无数',
    initialGold: 15,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: false,
    lanes: SINGLE_LANE,
    goldRate: 0.5,
    historicalNote: '戚继光分三路攻敌巢，擒斩焚溺倭寇无数，倭寇头目授首。',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 1000 },
          { type: 'longSpear', count: 2, delay: 1500 },
          { type: 'archer', count: 2, delay: 2000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 800 },
          { type: 'vineArmor', count: 2, delay: 1200 },
          { type: 'sniper', count: 2, delay: 1500 },
          { type: 'archer', count: 3, delay: 1000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 700 },
          { type: 'longSpear', count: 3, delay: 1000 },
          { type: 'vineArmor', count: 2, delay: 1200 },
          { type: 'sniper', count: 2, delay: 1500 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 600 },
          { type: 'longSpear', count: 3, delay: 800 },
          { type: 'vineArmor', count: 3, delay: 1000 },
          { type: 'sniper', count: 2, delay: 1200 },
          { type: 'archer', count: 3, delay: 900 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 7, delay: 500 },
          { type: 'longSpear', count: 4, delay: 700 },
          { type: 'vineArmor', count: 3, delay: 800 },
          { type: 'sniper', count: 3, delay: 1000 },
          { type: 'archer', count: 3, delay: 600 },
          { type: 'boss', count: 1, delay: 3000 },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 8, delay: 400 },
          { type: 'longSpear', count: 4, delay: 600 },
          { type: 'vineArmor', count: 4, delay: 700 },
          { type: 'sniper', count: 3, delay: 800 },
          { type: 'archer', count: 4, delay: 500 },
        ],
      },
    ],
  },
  {
    id: 9,
    name: '洋岐外海之战',
    subtitle: '水军截击全沉倭船',
    initialGold: 20,
    availableUnits: ['shieldBearer', 'spearman', 'wolfSoldier', 'firearmsUnit', 'forkGuard'],
    multiLane: true,
    lanes: MULTI_LANE,
    goldRate: 0.7,
    historicalNote: '水军外海截击，全沉十艘倭船，台州九战九捷圆满收官！',
    waves: [
      {
        enemies: [
          { type: 'ronin', count: 4, delay: 1000, lane: 'top' },
          { type: 'ronin', count: 3, delay: 1200, lane: 'bottom' },
          { type: 'longSpear', count: 2, delay: 2000, lane: 'top' },
          { type: 'archer', count: 2, delay: 1800, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 800, lane: 'top' },
          { type: 'ronin', count: 4, delay: 900, lane: 'bottom' },
          { type: 'longSpear', count: 2, delay: 1200, lane: 'top' },
          { type: 'vineArmor', count: 2, delay: 1500, lane: 'bottom' },
          { type: 'sniper', count: 1, delay: 2000, lane: 'top' },
          { type: 'archer', count: 2, delay: 1500, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 5, delay: 700, lane: 'top' },
          { type: 'ronin', count: 5, delay: 700, lane: 'bottom' },
          { type: 'longSpear', count: 3, delay: 1000, lane: 'top' },
          { type: 'longSpear', count: 2, delay: 1200, lane: 'bottom' },
          { type: 'sniper', count: 2, delay: 1500, lane: 'top' },
          { type: 'vineArmor', count: 2, delay: 1200, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 6, delay: 600, lane: 'top' },
          { type: 'ronin', count: 5, delay: 700, lane: 'bottom' },
          { type: 'longSpear', count: 3, delay: 800, lane: 'top' },
          { type: 'longSpear', count: 3, delay: 900, lane: 'bottom' },
          { type: 'sniper', count: 2, delay: 1200, lane: 'top' },
          { type: 'vineArmor', count: 3, delay: 1000, lane: 'bottom' },
          { type: 'archer', count: 3, delay: 800, lane: 'top' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 7, delay: 500, lane: 'top' },
          { type: 'ronin', count: 6, delay: 600, lane: 'bottom' },
          { type: 'longSpear', count: 3, delay: 700, lane: 'top' },
          { type: 'longSpear', count: 3, delay: 800, lane: 'bottom' },
          { type: 'sniper', count: 3, delay: 1000, lane: 'top' },
          { type: 'vineArmor', count: 3, delay: 800, lane: 'bottom' },
          { type: 'archer', count: 3, delay: 600, lane: 'top' },
          { type: 'archer', count: 3, delay: 700, lane: 'bottom' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 8, delay: 400, lane: 'top' },
          { type: 'ronin', count: 7, delay: 500, lane: 'bottom' },
          { type: 'longSpear', count: 4, delay: 600, lane: 'top' },
          { type: 'longSpear', count: 3, delay: 700, lane: 'bottom' },
          { type: 'sniper', count: 3, delay: 800, lane: 'top' },
          { type: 'vineArmor', count: 4, delay: 600, lane: 'bottom' },
          { type: 'archer', count: 4, delay: 500, lane: 'top' },
          { type: 'boss', count: 1, delay: 3000, lane: 'top' },
        ],
      },
      {
        enemies: [
          { type: 'ronin', count: 10, delay: 300, lane: 'top' },
          { type: 'ronin', count: 8, delay: 400, lane: 'bottom' },
          { type: 'longSpear', count: 4, delay: 500, lane: 'top' },
          { type: 'longSpear', count: 4, delay: 600, lane: 'bottom' },
          { type: 'sniper', count: 3, delay: 700, lane: 'top' },
          { type: 'sniper', count: 3, delay: 800, lane: 'bottom' },
          { type: 'vineArmor', count: 4, delay: 500, lane: 'top' },
          { type: 'vineArmor', count: 4, delay: 600, lane: 'bottom' },
          { type: 'archer', count: 4, delay: 400, lane: 'top' },
          { type: 'archer', count: 4, delay: 500, lane: 'bottom' },
          { type: 'boss', count: 1, delay: 2500, lane: 'bottom' },
        ],
      },
    ],
  },
];
