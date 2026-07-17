export interface GuessResult {
  strikes: number
  balls: number
}

export type GuessValidationError = 'length' | 'digits' | 'duplicate' | 'leadingZero';

export function generateSecretNumber(random = Math.random): string {
  const firstDigit = String(Math.floor(random() * 9) + 1);
  const remainingDigits = Array.from({ length: 10 }, (_, digit) => String(digit)).filter(digit => digit !== firstDigit);
  const digits = [firstDigit];

  while (digits.length < 3) {
    const index = Math.floor(random() * remainingDigits.length);
    digits.push(remainingDigits.splice(index, 1)[0]);
  }

  return digits.join('');
}

export function validateGuess(guess: string): GuessValidationError | null {
  if (guess.length !== 3) return 'length';
  if (!/^\d{3}$/.test(guess)) return 'digits';
  if (guess.startsWith('0')) return 'leadingZero';
  if (new Set(guess).size !== 3) return 'duplicate';
  return null;
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  let strikes = 0;
  let matches = 0;

  for (let index = 0; index < secret.length; index += 1) {
    if (secret[index] === guess[index]) strikes += 1;
    if (secret.includes(guess[index])) matches += 1;
  }

  return { strikes, balls: matches - strikes };
}
