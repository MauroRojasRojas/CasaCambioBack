import bcrypt from "bcrypt";

export async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}
