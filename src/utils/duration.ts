export function duration(start: [number, number]): number {
  const end = process.hrtime(start);
  return (end[0] * 1000000000 + end[1]) / 1000000;
}
