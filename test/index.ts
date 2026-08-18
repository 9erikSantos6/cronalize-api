export function generateCharExcluding(excluidos: Set<string>): string {
  let char: string;
  do {
    const codigoAscii = Math.floor(Math.random() * 26) + 97;
    char = String.fromCharCode(codigoAscii);
  } while (excluidos.has(char));
  return char;
}

export function generateRandomString(length: number, excluding?: string | string[]): string {
  const excluidosSet = new Set<string>(excluding);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += generateCharExcluding(excluidosSet);
  }
  return result;
}
