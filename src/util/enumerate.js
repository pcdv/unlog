export default function enumerate(array) {
  let index = 0
  const res = array.map(i => Object.assign({}, i, { index: index++ }))
  if (res.length)
    res[res.length - 1].isLast = true
  return res
}
