import { uncurryThis } from "../safe/index.ts";

const SameValueZero = (left: unknown, right: unknown) =>
  (left === left) ? left === right : right !== right;

const map_prototype_clear = /* #__PURE__ */ uncurryThis(Map.prototype.clear);
const map_prototype_delete = /* #__PURE__ */ uncurryThis(Map.prototype.delete);
const map_prototype_set = /* #__PURE__ */ uncurryThis(Map.prototype.set);

/**
 * Bi-directional map.
 */
export class BiMap<K, V> extends Map<K, V> {
  readonly inverse: BiMap<V, K>;

  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    super();

    if (iterable instanceof BiMap && !iterable.inverse) {
      this.inverse = iterable;
    } else {
      this.inverse = new new.target(this as unknown as []);
      if (iterable != null) {
        for (const { 0: key, 1: value } of iterable) {
          this.set(key, value);
        }
      }
    }
  }

  override clear(): void {
    map_prototype_clear(this);
    map_prototype_clear(this.inverse);
  }

  override delete(key: K): boolean {
    const value = this.get(key);
    return map_prototype_delete(this, key) &&
      map_prototype_delete(this.inverse, value);
  }

  override set(key: K, value: V): this {
    if (this.has(key)) {
      const keyValue = this.get(key)!;

      // 既に (key, value) のエントリがあれば早期リターン。
      if (SameValueZero(keyValue, value)) return this;

      map_prototype_delete(this.inverse, keyValue);
    }

    if (this.inverse.has(value)) {
      const valueKey = this.inverse.get(value)!;
      map_prototype_delete(this, valueKey);
    }

    map_prototype_set(this, key, value);
    map_prototype_set(this.inverse, value, key);

    return this;
  }
}

const weakmap_prototype_delete = /* #__PURE__ */ uncurryThis(
  WeakMap.prototype.delete,
);
const weakmap_prototype_set = /* #__PURE__ */ uncurryThis(
  WeakMap.prototype.set,
);

export const isWeakKey = (key: unknown): key is WeakKey =>
  (typeof key == "object" && key != null) || typeof key == "symbol";

export class WeakBiMap<
  K extends WeakKey,
  V extends WeakKey,
> extends WeakMap<K, V> {
  readonly inverse: WeakBiMap<V, K>;

  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    super();

    if (iterable instanceof WeakBiMap && !iterable.inverse) {
      this.inverse = iterable;
    } else {
      this.inverse = new new.target(this as unknown as []);
      if (iterable != null) {
        for (const { 0: key, 1: value } of iterable) {
          this.set(key, value);
        }
      }
    }
  }

  override delete(key: K): boolean {
    const value = this.get(key);
    return weakmap_prototype_delete(this, key) &&
      weakmap_prototype_delete(this.inverse, value!);
  }

  override set(key: K, value: V): this {
    if (!isWeakKey(key) || !isWeakKey(value)) {
      throw new TypeError("Invalid value used as weak map key");
    }

    const keyValue = this.get(key);

    // 既に (key, value) のエントリがあれば早期リターン。
    // key, value 共に NaN は入ってこない為 SameValueZero を使う必要はない。
    if (keyValue === value) return this;

    if (keyValue !== undefined) {
      weakmap_prototype_delete(this.inverse, keyValue);
    }

    const valueKey = this.inverse.get(value);
    if (valueKey !== undefined) {
      weakmap_prototype_delete(this, valueKey);
    }

    weakmap_prototype_set(this, key, value);
    weakmap_prototype_set(this.inverse, value, key);

    return this;
  }
}
