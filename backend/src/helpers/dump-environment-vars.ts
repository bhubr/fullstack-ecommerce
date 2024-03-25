/**
 * Obfuscate a string, keeping only the first and last two characters.
 */
function obfuscateString(str: string): string {
  if (str.length <= 4) {
    return '*'.repeat(str.length);
  }
  return str.slice(0, 2) + '*'.repeat(str.length - 4) + str.slice(-2);
}

/**
 * Pretty-print environment variables with their values.
 * 1st arg is a list of key-values (e.g. { 'NODE_ENV': 'environment' }), the values
 * being actually the _names_ of convenience variables used in settings.ts
 * 2nd arg is a list of keys (e.g. ['PG_PASSWORD'])  to be obfuscated
 */
export default function dumpEnvironmentVars(
  keyValues: Record<string, string>,
  obfuscateKeys: string[]
): void {
  for (const [key, value] of Object.entries(keyValues)) {
    const actualValue = process.env[value];
    console.log(
      `${key} (${value}):`,
      obfuscateKeys.includes(key) ? obfuscateString(actualValue ?? '') : actualValue
    );
  }
}
