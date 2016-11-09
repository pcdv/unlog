export default function enumerate(array) {
  let index = 0
  return array.map(i => Object.assign({}, i, { index: index++ }))
}
