/**
 * 在 task 执行完成后，如果执行时间小于 ms，添加延迟直到 ms
 * @param task - 任务
 * @param ms - 最小执行时间
 */
export async function runAtLeast<T>(
  task: () => Promise<T>,
  ms: number,
): Promise<T> {
  const t = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const [r1, _] = await Promise.all([task(), t(ms)]);
  return r1;
}
