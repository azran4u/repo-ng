export function envToBooleanWIthDefault(
  env: string,
  defaultValue: boolean
): boolean {
  const value = process.env[env];
  if (!value) return defaultValue;
  return value === "true" ? true : false;
}
