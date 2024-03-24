import crypto from 'crypto';
import { createUser } from '../src/models/user';

// take email from command line
const email = process.argv[2];
if (email === undefined) {
  console.error('usage: ts-node create-user.ts <email>');
  process.exit(1);
}
let passwordLen = Number(process.argv[3])
if (Number.isNaN(passwordLen)) {
  passwordLen = 8;
}

// simple password generator
const generatePassword = (len = 8): string => {
  const ranges: Record<string, [number, number]> = {
    digit: [48, 57],
    upper: [65, 90],
    lower: [97, 122],
    special1: [33, 47],
    special2: [58, 64],
    special3: [91, 96],
    special4: [123, 126],
  };
  const bytes = Array.from(crypto.randomBytes(len));
  return bytes
    .map((byte: number): string => {
      for (const [, [min, max]] of Object.entries(ranges)) {
        if (byte >= min && byte <= max) {
          return String.fromCharCode(byte);
        }
      }
      // default: pick any from special{1..4}
      const modulo = byte % 16;
      return modulo < 15
        ? String.fromCharCode(33 + modulo)
        : String.fromCharCode(126);
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
