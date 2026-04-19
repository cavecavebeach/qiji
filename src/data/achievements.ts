import type { AchievementConfig } from '../types';

export const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'firstGlory',
    name: '初露锋芒',
    description: '通关第1-3关',
    condition: (progress) => {
      return [1, 2, 3].every(id => progress.levelsCompleted.includes(id));
    },
  },
  {
    id: 'mandarinDuck',
    name: '鸳鸯阵传人',
    description: '通关第4-6关',
    condition: (progress) => {
      return [4, 5, 6].every(id => progress.levelsCompleted.includes(id));
    },
  },
  {
    id: 'taizhouVictory',
    name: '台州大捷',
    description: '通关第7-9关',
    condition: (progress) => {
      return [7, 8, 9].every(id => progress.levelsCompleted.includes(id));
    },
  },
  {
    id: 'qiTiger',
    name: '戚老虎',
    description: '全关卡通关',
    condition: (progress) => {
      return progress.levelsCompleted.length >= 9;
    },
  },
];
