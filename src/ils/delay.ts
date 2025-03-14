interface Delay {
  (ms: number): Promise<void>;
  <T>(ms: number, value: T): Promise<T>;
}

export const delay: Delay = <T>(ms: number, value?: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms, value);
  });
