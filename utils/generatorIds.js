export default function generatorIds(initial = 0) {
  let id = initial
  return () => {
    return id++
  }
}
