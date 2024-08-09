// functions
export function parseCellLocation(column: string, row: number) {
  return { row, col: column.toLowerCase().charCodeAt(0) - "a".charCodeAt(0) };
}
