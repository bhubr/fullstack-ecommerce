import crypto from 'crypto';
import { createUser } from '../src/models/user';

// take email from command line
const email = process.argv[2];
if (email === undefined) {
  console.error('usage: ts-node create-user.ts <email>');
  process.exit(1);
}
let passwordLen = Number(process.argv[3]);
if (Number.isNaN(passwordLen)) {
  passwordLen = 8;
}

// randomly determine "range" (digit, upper, etc.) that we're going to pick from
const pickRangeType = (): string => {
  const byte = crypto.randomBytes(1)[0];
  if (byte < 56) {
    return 'digit';
  } else if (byte < 112) {
    return 'upper';
  } else if (byte < 168) {
    return 'lower';
  } else if (byte < 190) {
    return 'special1';
  } else if (byte < 212) {
    return 'special2';
  } else if (byte < 234) {
    return 'special3';
  } else {
    return 'special4';
  }
};

// simple password generator
const generatePassword = (len = 10): string => {
  const ranges: Record<string, [number, number]> = {
    digit: [48, 57], // range of 10 digits
    upper: [65, 90], // range of 26 uppercase letters
    lower: [97, 122], // range of 26 lowercase letters
    special1: [33, 47], // range of 15 special characters
    special2: [58, 64], // range of 7 special characters
    special3: [91, 96], // range of 6 special characters
    special4: [123, 126], // range of 4 special characters
  };
  const bytes = Array.from(crypto.randomBytes(len));
  return bytes
    .map((byte: number): string => {
      const rangeType = pickRangeType();
      const [min, max] = ranges[rangeType];
      // compute value within the range, basically byte modulo (max - min + 1) + min
      return String.fromCharCode(min + (byte % (max - min + 1)));
    })
    .join('');
};

async function main(): Promise<void> {
  const password = generatePassword(passwordLen);
  const { id } = await createUser(email, password);
  console.log(`Inserted user with id ${id} and password ${password}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
