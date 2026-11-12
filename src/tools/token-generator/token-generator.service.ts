const RANGE = 0x100000000;

// Rejection sampling: values in the last partial block are dropped so every index is equally likely.
function randomIndex(max: number): number {
  const limit = RANGE - (RANGE % max);
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  length?: number
  alphabet?: string
}) {
  const allAlphabet = alphabet ?? [
    withUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
    withLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
    withNumbers ? '0123456789' : '',
    withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '',
  ].join('');

  if (allAlphabet.length === 0) {
    return '';
  }

  let token = '';
  for (let i = 0; i < length; i++) {
    token += allAlphabet[randomIndex(allAlphabet.length)];
  }
  return token;
}
