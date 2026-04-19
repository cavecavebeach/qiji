export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 600;

export const GRID_SIZE = 40;

export const BATTLEFIELD_TOP = 80;
export const BATTLEFIELD_BOTTOM = 480;
export const BATTLEFIELD_LEFT = 60;
export const BATTLEFIELD_RIGHT = 964;

export const FLAG_X = 80;
export const FLAG_Y = 280;
export const FLAG_HP = 100;

export const SPAWN_X = 960;

export const HALF_FIELD_X = 512;

export const GOLD_PER_SECOND = 0.5;
export const GOLD_TICK_INTERVAL = 500;

export const UNIT_SPAWN_Y_MIN = 120;
export const UNIT_SPAWN_Y_MAX = 440;

export const COLORS = {
  BACKGROUND: 0x2C1810,
  BATTLEFIELD: 0xA68A5C,
  RIVER: 0x3A6B8C,
  FLAG_RED: 0x8B2A1C,
  GOLD_TEXT: 0xF5A623,
  HP_GREEN: 0x50B89C,
  HP_RED: 0xD0021B,
  UI_BG: 0x4A3C2C,
  UI_WOOD: 0x6B4226,
  UI_TEXT: 0xF3ECD8,
  SHIELD_BEARER: 0xD4A017,
  SPEARMAN: 0xB83A2A,
  RONIN: 0x4A5A6A,
  ARCHER: 0x3A4A4A,
  DAMAGE: 0xFFFFFF,
  CRIT_DAMAGE: 0xF5A623,

  PAPER_BG: 0xF3ECD8,
  INK_BROWN: 0x4A3C2C,
  ENEMY_PURPLE: 0x2D1B2E,
  SAND: 0xA68A5C,

  RATTAN_YELLOW: 0xD4A017,
  RATTAN_DARK: 0xB8860B,
  BAMBOO_GREEN: 0x5E7C4A,
  BAMBOO_LIGHT: 0x7BA368,
  VERMILION: 0xB83A2A,
  COPPER_GREEN: 0x5F8A7A,
  IRON_BLACK: 0x3A3C40,

  SKIN_TONE: 0xF0C8A0,
  COAT_RED: 0xC23B22,
  PANTS_BLUE: 0x3A5F7A,

  HEAL_GREEN: 0x50B89C,
  ICE_BLUE: 0x5BA0C9,
  CINNABAR: 0xD0021B,

  WOOD_DARK: 0x8B5A2B,
  WOOD_LIGHT: 0x7B5236,
  METAL_SILVER: 0xE8E8E8,
  METAL_DARK: 0xC0C0C0,
};

export const FONTS = {
  TITLE: {
    fontFamily: 'serif',
    fontSize: '42px',
    color: '#F3ECD8',
    stroke: '#4A3C2C',
    strokeThickness: 3,
  },
  SUBTITLE: {
    fontFamily: 'serif',
    fontSize: '18px',
    color: '#F5A623',
  },
  BODY: {
    fontFamily: 'serif',
    fontSize: '16px',
    color: '#F3ECD8',
  },
  SMALL: {
    fontFamily: 'serif',
    fontSize: '12px',
    color: '#F3ECD8',
  },
  DAMAGE: {
    fontFamily: 'serif',
    fontSize: '14px',
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 2,
  },
  GOLD: {
    fontFamily: 'serif',
    fontSize: '14px',
    color: '#F5A623',
    stroke: '#000000',
    strokeThickness: 1,
  },
};

export const UNIT_COLORS = {
  shieldBearer: {
    primary: COLORS.RATTAN_YELLOW,
    secondary: COLORS.RATTAN_DARK,
    coat: COLORS.COAT_RED,
    pants: COLORS.PANTS_BLUE,
    skin: COLORS.SKIN_TONE,
  },
  spearman: {
    primary: COLORS.VERMILION,
    secondary: COLORS.METAL_SILVER,
    coat: COLORS.COAT_RED,
    pants: COLORS.PANTS_BLUE,
    skin: COLORS.SKIN_TONE,
  },
  wolfSoldier: {
    primary: COLORS.BAMBOO_GREEN,
    secondary: COLORS.BAMBOO_LIGHT,
    coat: COLORS.COAT_RED,
    pants: COLORS.PANTS_BLUE,
    skin: COLORS.SKIN_TONE,
  },
  forkGuard: {
    primary: COLORS.COPPER_GREEN,
    secondary: 0x8B6914,
    coat: COLORS.COAT_RED,
    pants: COLORS.PANTS_BLUE,
    skin: COLORS.SKIN_TONE,
  },
  firearmsUnit: {
    primary: COLORS.IRON_BLACK,
    secondary: 0x5A4020,
    coat: COLORS.COAT_RED,
    pants: COLORS.PANTS_BLUE,
    skin: COLORS.SKIN_TONE,
  },
};

export const ENEMY_COLORS = {
  ronin: {
    primary: 0x4A5A6A,
    secondary: 0x5A4A3A,
    skin: COLORS.SKIN_TONE,
  },
  archer: {
    primary: 0x3A4A4A,
    secondary: 0x7A6040,
    skin: COLORS.SKIN_TONE,
  },
  longSpear: {
    primary: 0x6A4A2A,
    secondary: COLORS.METAL_SILVER,
    skin: COLORS.SKIN_TONE,
  },
  vineArmor: {
    primary: 0x9B8A4A,
    secondary: 0x7A6A3A,
    skin: COLORS.SKIN_TONE,
  },
  sniper: {
    primary: 0x2A2A2A,
    secondary: 0x1A1A1A,
    skin: COLORS.SKIN_TONE,
  },
  boss: {
    primary: 0x3A2A1A,
    secondary: COLORS.VERMILION,
    skin: COLORS.SKIN_TONE,
  },
};
