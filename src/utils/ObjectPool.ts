export interface Poolable {
  reset(): void;
  setActive(active: boolean): void;
  get active(): boolean;
}

export interface ObjectPoolConfig<T extends Poolable> {
  create: () => T;
  reset: (obj: T) => void;
  initialSize?: number;
  maxSize?: number;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private activeObjects: Set<T> = new Set();
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;

  constructor(config: ObjectPoolConfig<T>) {
    this.createFn = config.create;
    this.resetFn = config.reset;
    this.maxSize = config.maxSize || 1000;

    if (config.initialSize) {
      this.preallocate(config.initialSize);
    }
  }

  preallocate(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.pool.length + this.activeObjects.size >= this.maxSize) break;
      const obj = this.createFn();
      obj.setActive(false);
      this.pool.push(obj);
    }
  }

  acquire(): T {
    let obj: T;

    if (this.pool.length > 0) {
      obj = this.pool.pop()!;
    } else if (this.activeObjects.size < this.maxSize) {
      obj = this.createFn();
    } else {
      console.warn('ObjectPool: Max size reached, reusing oldest object');
      const iterator = this.activeObjects.values();
      const first = iterator.next();
      if (first.value) {
        this.release(first.value);
        obj = this.pool.pop()!;
      } else {
        obj = this.createFn();
      }
    }

    this.resetFn(obj);
    obj.setActive(true);
    this.activeObjects.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (!this.activeObjects.has(obj)) return;

    this.activeObjects.delete(obj);
    obj.setActive(false);
    this.resetFn(obj);
    this.pool.push(obj);
  }

  releaseAll(): void {
    for (const obj of this.activeObjects) {
      obj.setActive(false);
      this.resetFn(obj);
      this.pool.push(obj);
    }
    this.activeObjects.clear();
  }

  getStats(): { pooled: number; active: number; total: number } {
    return {
      pooled: this.pool.length,
      active: this.activeObjects.size,
      total: this.pool.length + this.activeObjects.size,
    };
  }

  getActiveCount(): number {
    return this.activeObjects.size;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  forEachActive(callback: (obj: T) => void): void {
    for (const obj of this.activeObjects) {
      callback(obj);
    }
  }

  clear(): void {
    this.pool = [];
    this.activeObjects.clear();
  }
}
