export default function enumerate<T extends object>(array: T[]): (T & { index: number; isLast?: boolean })[] {
  let index = 0
  const res = array.map(i => Object.assign({}, i, { index: index++, isLast: false }) as T & { index: number; isLast: boolean })
  if (res.length > 0)
    res[res.length - 1].isLast = true
  return res
}
