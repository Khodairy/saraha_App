import crypto from "node:crypto";
import { ENCRYPTION_KEY } from "../../../../config/config.service.js";

// 🔑 Use 32 bytes (256 bits) for AES-256
const encryption_key = Buffer.from(ENCRYPTION_KEY); // You should store this securely (e.g., env variable)
const IV_LENGTH = 16; // For AES, the IV is always 16 bytes

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv("aes-256-cbc", encryption_key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function
export function decrypt(text) {
  const [ivHex, encryptedText] = text.split(":");

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", encryption_key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}
