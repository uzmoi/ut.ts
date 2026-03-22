import { uncurryThis } from "../safe/index.ts";
import { SameValueZero } from "./simple.ts";

const bind = /* #__PURE__ */ uncurryThis(Function.prototype.bind);

const map_prototype_has = /* #__PURE__ */ uncurryThis(Map.prototype.has);
const map_prototype_get = /* #__PURE__ */ uncurryThis(Map.prototype.get);
const map_prototype_clear = /* #__PURE__ */ uncurryThis(Map.prototype.clear);
const map_prototype_delete = /* #__PURE__ */ uncurryThis(Map.prototype.delete);
const map_prototype_set = /* #__PURE__ */ uncurryThis(Map.prototype.set);

let constructingBiMap: BiMap<unknown, unknown> | undefined;
// new new.target() してから super() までの間のみ false になる。
let isConstructedInverseBiMap = true;

/**
 * Bi-directional map.
 */
export class BiMap<K, V> extends Map<K, V> {
  readonly inverse: BiMap<V, K>;

  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    super();

    if (constructingBiMap == null) {
      constructingBiMap = this;
      isConstructedInverseBiMap = false;
      this.inverse = new new.target();
      constructingBiMap = undefined;

      if (iterable != null) {
        const set = bind(this.set, this);
        for (const { 0: key, 1: value } of iterable) {
          set(key, value);
        }
      }
    } else {
      if (isConstructedInverseBiMap) {
        throw new Error("Cannot construct BiMap before calling super()");
      }
      isConstructedInverseBiMap = true;

      this.inverse = constructingBiMap as BiMap<V, K>;
    }
  }

  override clear(): void {
    map_prototype_clear(this);
    map_prototype_clear(this.inverse);
  }

  override delete(key: K): boolean {
    const value: V | undefined = map_prototype_get(this, key);
    return map_prototype_delete(this, key) &&
      map_prototype_delete(this.inverse, value);
  }

  override set(key: K, value: V): this {
    if (map_prototype_has(this, key)) {
      const keyValue: V = map_prototype_get(this, key);

      // 既に (key, value) のエントリがあれば早期リターン。
      if (SameValueZero(keyValue, value)) return this;

      map_prototype_delete(this.inverse, keyValue);
    }

    if (map_prototype_has(this.inverse, value)) {
      const valueKey: K = map_prototype_get(this.inverse, value);
      map_prototype_delete(this, valueKey);
    }

    map_prototype_set(this, key, value);
    map_prototype_set(this.inverse, value, key);

    return this;
  }
}

const weakmap_prototype_get = /* #__PURE__ */ uncurryThis(
  WeakMap.prototype.get,
);
const weakmap_prototype_delete = /* #__PURE__ */ uncurryThis(
  WeakMap.prototype.delete,
);
const weakmap_prototype_set = /* #__PURE__ */ uncurryThis(
  WeakMap.prototype.set,
);

export const isWeakKey = (key: unknown): key is WeakKey =>
  (typeof key == "object" && key != null) ||
  (typeof key == "symbol" && Symbol.keyFor(key) == null);

let constructingWeakBiMap: WeakBiMap<WeakKey, WeakKey> | undefined;
// new new.target() してから super() までの間のみ false になる。
let isConstructedInverseWeakBiMap = true;

export class WeakBiMap<
  K extends WeakKey,
  V extends WeakKey,
> extends WeakMap<K, V> {
  readonly inverse: WeakBiMap<V, K>;

  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    super();

    if (constructingWeakBiMap == null) {
      constructingWeakBiMap = this;
      isConstructedInverseWeakBiMap = false;
      this.inverse = new new.target();
      constructingWeakBiMap = undefined;

      if (iterable != null) {
        const set = bind(this.set, this);
        for (const { 0: key, 1: value } of iterable) {
          set(key, value);
        }
      }
    } else {
      if (isConstructedInverseWeakBiMap) {
        throw new Error("Cannot construct WeakBiMap before calling super()");
      }
      isConstructedInverseWeakBiMap = true;

      this.inverse = constructingWeakBiMap as WeakBiMap<V, K>;
    }
  }

  override delete(key: K): boolean {
    const value: V | undefined = weakmap_prototype_get(this, key);
    return weakmap_prototype_delete(this, key) &&
      weakmap_prototype_delete(this.inverse, value!);
  }

  override set(key: K, value: V): this {
    if (!isWeakKey(key) || !isWeakKey(value)) {
      throw new TypeError("Invalid value used as weak map key");
    }

    const keyValue: V | undefined = weakmap_prototype_get(this, key);

    // 既に (key, value) のエントリがあれば早期リターン。
    // key, value 共に NaN は入ってこない為 SameValueZero を使う必要はない。
    if (keyValue === value) return this;

    if (keyValue !== undefined) {
      weakmap_prototype_delete(this.inverse, keyValue);
    }

    const valueKey: K | undefined = weakmap_prototype_get(this.inverse, value);
    if (valueKey !== undefined) {
      weakmap_prototype_delete(this, valueKey);
    }

    weakmap_prototype_set(this, key, value);
    weakmap_prototype_set(this.inverse, value, key);

    return this;
  }
}
