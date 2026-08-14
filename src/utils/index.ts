export function generateCharExcluding(excluidos: string | string[]): string {
  let char: string;
  do {
    const codigoAscii = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
    char = String.fromCharCode(codigoAscii);
  } while (excluidos.includes(char));
  return char;
}
