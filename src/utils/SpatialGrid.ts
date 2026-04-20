import { Entity } from '../entities/base/Entity';

export class SpatialGrid<T extends Entity = Entity> {
  private cellSize: number;
  private grid: Map<string, T[]>;

  constructor(cellSize: number = 50) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  private getKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  clear(): void {
    this.grid.clear();
  }

  insert(entity: T): void {
    if (entity.isDead) return;
    const key = this.getKey(entity.x, entity.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(entity);
  }

  insertMany(entities: T[]): void {
    for (const entity of entities) {
      this.insert(entity);
    }
  }

  getNearby(x: number, y: number, radius: number): T[] {
    const result: T[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const centerCellX = Math.floor(x / this.cellSize);
    const centerCellY = Math.floor(y / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${centerCellX + dx},${centerCellY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          result.push(...cell);
        }
      }
    }

    return result;
  }

  getNearbyFiltered(x: number, y: number, radius: number, filter: (e: T) => boolean): T[] {
    const nearby = this.getNearby(x, y, radius);
    const result: T[] = [];
    const radiusSq = radius * radius;

    for (const entity of nearby) {
      if (!filter(entity)) continue;
      const dx = entity.x - x;
      const dy = entity.y - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq) {
        result.push(entity);
      }
    }

    return result;
  }

  getStats(): { cellCount: number; entityCount: number; avgPerCell: number } {
    let entityCount = 0;
    for (const cell of this.grid.values()) {
      entityCount += cell.length;
    }
    return {
      cellCount: this.grid.size,
      entityCount,
      avgPerCell: this.grid.size > 0 ? entityCount / this.grid.size : 0,
    };
  }
}
