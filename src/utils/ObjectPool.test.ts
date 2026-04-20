import { ObjectPool, Poolable } from './ObjectPool';

class TestObject implements Poolable {
  x: number = 0;
  y: number = 0;
  value: string = '';
  private _active: boolean = false;

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.value = '';
  }

  setActive(active: boolean): void {
    this._active = active;
  }

  get active(): boolean {
    return this._active;
  }
}

export class ObjectPoolTester {
  static runAllTests(): { passed: number; failed: number; results: string[] } {
    const results: string[] = [];
    let passed = 0;
    let failed = 0;

    const test = (name: string, fn: () => boolean) => {
      try {
        if (fn()) {
          results.push(`✅ ${name}`);
          passed++;
        } else {
          results.push(`❌ ${name} - 断言失败`);
          failed++;
        }
      } catch (e) {
        results.push(`❌ ${name} - 异常: ${e}`);
        failed++;
      }
    };

    test('预分配对象', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 10,
      });
      return pool.getPoolSize() === 10;
    });

    test('获取对象', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 5,
      });
      const obj = pool.acquire();
      return obj.active === true && pool.getActiveCount() === 1 && pool.getPoolSize() === 4;
    });

    test('归还对象', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 5,
      });
      const obj = pool.acquire();
      pool.release(obj);
      return obj.active === false && pool.getActiveCount() === 0 && pool.getPoolSize() === 5;
    });

    test('池空时创建新对象', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 1,
      });
      pool.acquire();
      pool.acquire();
      return pool.getActiveCount() === 2;
    });

    test('对象重置状态', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 1,
      });
      const obj = pool.acquire();
      obj.x = 100;
      obj.y = 200;
      obj.value = 'test';
      pool.release(obj);
      return obj.x === 0 && obj.y === 0 && obj.value === '';
    });

    test('复用对象', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 1,
      });
      const obj1 = pool.acquire();
      obj1.x = 100;
      pool.release(obj1);
      const obj2 = pool.acquire();
      return obj1 === obj2 && obj2.x === 0;
    });

    test('状态污染隔离', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 2,
      });
      const obj1 = pool.acquire();
      const obj2 = pool.acquire();
      obj1.x = 100;
      obj1.value = 'obj1';
      obj2.x = 200;
      obj2.value = 'obj2';
      pool.release(obj1);
      pool.release(obj2);
      const obj3 = pool.acquire();
      const obj4 = pool.acquire();
      return obj3.x === 0 && obj3.value === '' && obj4.x === 0 && obj4.value === '';
    });

    test('最大尺寸限制', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 0,
        maxSize: 3,
      });
      pool.acquire();
      pool.acquire();
      pool.acquire();
      pool.acquire();
      return pool.getActiveCount() === 3;
    });

    test('统计信息', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 5,
      });
      pool.acquire();
      pool.acquire();
      const stats = pool.getStats();
      return stats.pooled === 3 && stats.active === 2 && stats.total === 5;
    });

    test('批量释放', () => {
      const pool = new ObjectPool<TestObject>({
        create: () => new TestObject(),
        reset: (obj) => obj.reset(),
        initialSize: 0,
      });
      pool.acquire();
      pool.acquire();
      pool.acquire();
      pool.releaseAll();
      return pool.getActiveCount() === 0 && pool.getPoolSize() === 3;
    });

    console.log('\n===== 对象池测试结果 =====');
    results.forEach(r => console.log(r));
    console.log(`\n总计: ${passed} 通过, ${failed} 失败`);
    console.log('========================\n');

    return { passed, failed, results };
  }
}
